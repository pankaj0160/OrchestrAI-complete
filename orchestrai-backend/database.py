"""
database.py — SQLite history handler for OrchestrAI.

Schema:
  runs(id, topic, report, feedback, created_at)

All operations are synchronous (called from FastAPI's thread executor).
"""

from __future__ import annotations

import json
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Generator

DB_PATH = Path(__file__).parent / "orchestrai.db"

# ── Schema ────────────────────────────────────────────────────────────────────

_CREATE_SQL = """
CREATE TABLE IF NOT EXISTS runs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    topic       TEXT    NOT NULL,
    report      TEXT    NOT NULL DEFAULT '',
    feedback    TEXT    NOT NULL DEFAULT '',
    score       REAL,
    created_at  REAL    NOT NULL
);
"""


@contextmanager
def _conn() -> Generator[sqlite3.Connection, None, None]:
    con = sqlite3.connect(DB_PATH, check_same_thread=False)
    con.row_factory = sqlite3.Row
    try:
        yield con
        con.commit()
    except Exception:
        con.rollback()
        raise
    finally:
        con.close()


def init_db() -> None:
    """Create tables if they don't exist. Call once at startup."""
    with _conn() as con:
        con.executescript(_CREATE_SQL)
    print(f"[DB] Initialised at {DB_PATH}")


# ── Write ─────────────────────────────────────────────────────────────────────

def save_run(topic: str, report: str, feedback: str) -> int:
    """
    Persist a completed research run.
    Parses score from feedback text if available.
    Returns the new row id.
    """
    import re
    score: float | None = None
    m = re.search(r"Score:\s*(\d+(?:\.\d+)?)\/10", feedback, re.IGNORECASE)
    if m:
        score = float(m.group(1))

    with _conn() as con:
        cur = con.execute(
            "INSERT INTO runs (topic, report, feedback, score, created_at) VALUES (?,?,?,?,?)",
            (topic, report, feedback, score, time.time()),
        )
        return cur.lastrowid


# ── Read ──────────────────────────────────────────────────────────────────────

def get_history(limit: int = 50) -> list[dict]:
    """Return recent runs (newest first), without full report text."""
    with _conn() as con:
        rows = con.execute(
            """SELECT id, topic, score, created_at,
                      substr(report, 1, 200) AS excerpt
               FROM runs
               ORDER BY created_at DESC
               LIMIT ?""",
            (limit,),
        ).fetchall()
    return [dict(r) for r in rows]


def get_run(run_id: int) -> dict | None:
    """Return a single run by id, including full report + feedback."""
    with _conn() as con:
        row = con.execute(
            "SELECT * FROM runs WHERE id = ?", (run_id,)
        ).fetchone()
    return dict(row) if row else None


# ── Delete ────────────────────────────────────────────────────────────────────

def delete_run(run_id: int) -> bool:
    """Delete a run. Returns True if a row was deleted."""
    with _conn() as con:
        cur = con.execute("DELETE FROM runs WHERE id = ?", (run_id,))
        return cur.rowcount > 0
