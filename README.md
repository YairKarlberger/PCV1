# Petty Cash Envelope Monorepo

This repository houses the backend API and frontend client for the Petty Cash envelope application.

## Backend

1. Create a `.env` file from `.env.example` if needed.
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Run the development server (from within `backend/`):
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000`. The `/health` endpoint returns `{"ok": true}` when the service is running.

## Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the app at [http://localhost:5173](http://localhost:5173).

The initial landing page renders the heading **"Petty Cash — MVP Scaffold"**.

## Storage directories

When the backend starts it ensures that the following directories exist:

- `./storage`
- `./storage/tmp`
- `./storage/petty-cash`

These paths are configurable via environment variables.
