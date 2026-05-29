# Local dev
cd orchestrai-backend && uv pip install -r requirements.txt
cp .env.example .env  # fill in keys (or leave blank for Simulation Mode)
python main.py        # → http://localhost:8000

cd orchestrai-frontend && npm install && npm run dev  # → http://localhost:5173

# Docker (full stack, one command)
docker compose up --build  # frontend → :3000, backend → :8000