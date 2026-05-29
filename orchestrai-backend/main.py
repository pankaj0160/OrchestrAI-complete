"""
main.py — FastAPI server for OrchestrAI.

Routes:
  GET  /api/health                → health check
  GET  /api/research/stream       → SSE pipeline stream
  GET  /api/history               → list past runs
  GET  /api/history/{id}          → single run
  DELETE /api/history/{id}        → delete run

SSE event format (JSON):
  {"agent": str, "type": str, "msg": str, "tool": str|null}
"""

from __future__ import annotations

import json
import os
from contextlib import asynccontextmanager

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from database import delete_run, get_history, get_run, init_db, save_run
from pipeline import run_pipeline_async

load_dotenv()

# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="OrchestrAI API",
    version="1.0.0",
    description="Multi-Agent AI Research Pipeline — SSE streaming backend",
    lifespan=lifespan,
)

# CORS — allow Vite dev server and production frontend
_ORIGINS = [
    "http://localhost:5173",   # Vite dev
    "http://localhost:3000",   # Docker / preview
    os.getenv("FRONTEND_ORIGIN", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in _ORIGINS if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "OrchestrAI"}


# ── SSE Stream ────────────────────────────────────────────────────────────────

@app.get("/api/research/stream")
async def research_stream(topic: str = Query(..., min_length=2, max_length=300)):
    """
    Server-Sent Events endpoint.
    Streams pipeline events in real time and persists the final run to SQLite.
    """
    if not topic.strip():
        raise HTTPException(status_code=422, detail="topic cannot be blank")

    async def event_generator():
        report   = ""
        feedback = ""

        try:
            async for event in run_pipeline_async(topic):
                # Accumulate writer / critic output for persistence
                if event["agent"] == "writer" and event["type"] == "streaming":
                    report += event["msg"]
                elif event["agent"] == "critic" and event["type"] == "streaming":
                    feedback += event["msg"]
                elif event["agent"] == "writer" and event["type"] == "complete" and not report:
                    report = event["msg"]
                elif event["agent"] == "critic" and event["type"] == "complete" and not feedback:
                    feedback = event["msg"]

                # Emit SSE event
                payload = json.dumps(event, ensure_ascii=False)
                yield f"data: {payload}\n\n"

            final_payload = {
                "agent": "system",
                "type": "final_report",
                "msg": "Report ready",
                "tool": None,
                "report": report,
                "feedback": feedback,
            }

            # Persist after pipeline completes
            if report:
                run_id = save_run(topic=topic, report=report, feedback=feedback)
                final_payload["run_id"] = run_id

            yield f"data: {json.dumps(final_payload, ensure_ascii=False)}\n\n"

            done_event = json.dumps({
                "agent": "system",
                "type": "complete",
                "msg": "Pipeline complete",
                "tool": None,
                "run_id": final_payload.get("run_id"),
            }, ensure_ascii=False)
            yield f"data: {done_event}\n\n"

        except Exception as exc:
            err_event = json.dumps({
                "agent": "system",
                "type": "error",
                "msg": "The research pipeline failed before the report could be generated.",
                "tool": None,
            })
            yield f"data: {err_event}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disable Nginx buffering
            "Connection": "keep-alive",
        },
    )


# ── History ───────────────────────────────────────────────────────────────────

@app.get("/api/history")
async def list_history(limit: int = Query(default=50, ge=1, le=200)):
    return {"runs": get_history(limit=limit)}


@app.get("/api/history/{run_id}")
async def get_run_detail(run_id: int):
    run = get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    return run


@app.delete("/api/history/{run_id}")
async def delete_run_route(run_id: int):
    deleted = delete_run(run_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    return {"deleted": True, "id": run_id}


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
