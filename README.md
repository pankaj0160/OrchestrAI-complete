# OrchestrAI

OrchestrAI is a full-stack multi-agent research dashboard. Users enter a topic, the backend runs a staged AI research pipeline, and the frontend displays real-time progress, the final Markdown report, critic feedback, and optional detailed execution logs.

## Highlights

- Real-time multi-agent pipeline with Search, Reader, Writer, Critic, and Final Report stages
- Server-Sent Events for live progress without page refreshes
- Durable final report state so completed reports do not disappear after rerenders
- Critic Review section displayed alongside the final report
- Copy and download actions that include both the report and critic review
- Milestone-first logs with collapsible detailed raw stream events
- Stable dashboard layout that avoids page jumping while the pipeline runs
- Light and dark theme support with `localStorage` persistence
- Simulation mode for local demos when provider API keys are not configured
- SQLite-backed history endpoints

## Working Screenshots :

<img width="1403" height="738" alt="Screenshot 2026-05-29 174921" src="https://github.com/user-attachments/assets/4c8d8393-93c3-414b-9839-a768628f17ae" />

<img width="1143" height="641" alt="Screenshot 2026-05-29 175020" src="https://github.com/user-attachments/assets/9e4545ec-a658-421c-91fd-66c0d723a0ed" />

<img width="1355" height="451" alt="Screenshot 2026-05-29 174938" src="https://github.com/user-attachments/assets/1235970a-90aa-4b28-95d4-d448ad8cafc7" />

<img width="1162" height="640" alt="Screenshot 2026-05-29 175035" src="https://github.com/user-attachments/assets/6c4890d7-427b-49b4-950e-4172976e55d5" />

<img width="1143" height="641" alt="Screenshot 2026-05-29 175020" src="https://github.com/user-attachments/assets/60613228-408c-46db-b4d9-3fbd6a92719e" />


## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Markdown
- Backend: FastAPI, Server-Sent Events, SQLite
- AI and tools: LangChain, LangGraph, Groq, Tavily
- Deployment: Docker Compose, Nginx frontend container

## Project Structure

```text
orchestrai-complete/
  orchestrai-backend/
    agents.py
    database.py
    main.py
    pipeline.py
    requirements.txt
    tools.py
  orchestrai-frontend/
    src/
      components/
      context/
      hooks/
      pages/
      services/
    package.json
    vite.config.js
  docker-compose.yml
  how_to_run.md
  README.md
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- npm
- Optional: Docker and Docker Compose

### Backend

```bash
cd orchestrai-backend
pip install -r requirements.txt
python main.py
```

The backend runs at `http://localhost:8000`.

### Frontend

```bash
cd orchestrai-frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Environment Variables

Create an `.env` file in `orchestrai-backend/` for real provider calls:

```env
GROQ_API_KEYS=your_groq_key
TAVILY_API_KEYS=your_tavily_key
FRONTEND_ORIGIN=http://localhost:5173
```

If `GROQ_API_KEYS` or `TAVILY_API_KEYS` are missing, OrchestrAI automatically uses simulation mode. This lets you test the dashboard and streaming UX without external API calls.

## Docker

Run the full stack:

```bash
docker compose up --build
```

Default ports:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## API Overview

### Health

```http
GET /api/health
```

### Research Stream

```http
GET /api/research/stream?topic=your-topic
```

The stream emits JSON Server-Sent Events:

```json
{
  "agent": "writer",
  "type": "streaming",
  "msg": "Report text chunk",
  "tool": null
}
```

At completion, the backend emits a durable final report event:

```json
{
  "agent": "system",
  "type": "final_report",
  "msg": "Report ready",
  "report": "...",
  "feedback": "...",
  "run_id": 1
}
```

### History

```http
GET /api/history
GET /api/history/{run_id}
DELETE /api/history/{run_id}
```

## UX Behavior

- Loading -> Pipeline Running -> Generating Report -> Report Ready
- The report panel displays the Writer output and Critic Review in one result area
- Raw logs are retained but hidden behind "Show Detailed Logs"
- Only the logs and report panels scroll internally
- Theme selection survives refreshes
- User-facing errors avoid stack traces

## Verification

Frontend build:

```bash
cd orchestrai-frontend
npm run build
```

Backend syntax check:

```bash
cd orchestrai-backend
python -m py_compile main.py pipeline.py
```

## License
MIT -License
