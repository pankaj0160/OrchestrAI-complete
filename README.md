# OrchestrAI

OrchestrAI is a full-stack research pipeline app with a FastAPI backend and a Vite/React frontend. It can run in either real mode using Groq and Tavily APIs, or in simulation mode without API keys for demo/testing.

## Features

- Multi-agent research pipeline:
  - Search agent (Tavily web search)
  - Reader agent (web page scraping)
  - Writer chain (Markdown research report generation)
  - Critic chain (quality review)
- SSE streaming pipeline from backend to frontend
- Local dev support and Docker-based full-stack deployment
- SQLite persistence for saved runs

## Architecture

- `orchestrai-backend/`
  - FastAPI backend
  - Multi-agent pipeline logic
  - Dockerfile for containerized backend
  - `.env` support for API keys
- `orchestrai-frontend/`
  - Vite + React frontend
  - Live SSE client for research progress
  - Dockerfile serving built assets through Nginx
- `docker-compose.yml`
  - Orchestrates backend + frontend containers
  - Uses a local Docker volume for persisted SQLite data

## Prerequisites

- Python 3.12+
- Node.js 20+ and npm
- Docker and Docker Compose (optional, for container deployment)

## Local development

### Backend

```bash
cd orchestrai-backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add any API keys you want to use.
python main.py
```

The backend will start on `http://localhost:8000`.

### Frontend

```bash
cd orchestrai-frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

### Use

Open the frontend URL and run a research topic. The UI streams pipeline progress and renders the generated report.

## Docker deployment

From the project root:

```bash
docker compose up --build
```

- Frontend will be available on `http://localhost:3000`
- Backend will be available on `http://localhost:8000`

## Environment variables

Copy and edit the backend env file:

```bash
cd orchestrai-backend
cp .env.example .env
```

The backend looks for:

- `GROQ_API_KEYS` — comma-separated Groq API keys
- `TAVILY_API_KEYS` — comma-separated Tavily API keys
- `FRONTEND_ORIGIN` — optional CORS origin for production

If both API key sets are absent, OrchestrAI runs in simulation mode.

## Troubleshooting

- If the backend reports simulation mode even though `.env` contains keys:
  - confirm you started the backend from `orchestrai-backend`
  - confirm the file is named exactly `.env`
  - restart the backend after editing `.env`

- If the frontend cannot connect to the backend:
  - verify CORS origins in `orchestrai-backend/main.py`
  - check the backend port and frontend requests

- If Docker fails to build:
  - ensure `docker compose` is run from the project root
  - verify the backend `.env` file exists at `orchestrai-backend/.env`

## Project structure

```text
orchestrai-complete/
├── docker-compose.yml
├── README.md
├── how_to_run.md
├── orchestrai-backend/
│   ├── Dockerfile
│   ├── main.py
│   ├── pipeline.py
│   ├── agents.py
│   ├── tools.py
│   ├── requirements.txt
│   ├── .env.example
│   └── ...
└── orchestrai-frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── src/
    └── ...
```

## Notes

- The backend uses FastAPI and SQLite.
- The frontend is built with React, Vite, Tailwind CSS, and Markdown rendering.
- The Docker setup uses separate containers for frontend and backend, with a shared Docker network.
