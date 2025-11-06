# Petty Cash App (Clean Rebuild)

## Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Run: `uvicorn app.main:app --reload --port 8000`
   - Creates `app.db` and storage folders
4. Health: open `/api/health`

## Frontend
1. `cd frontend`
2. `npm i`
3. `npm run dev` (http://localhost:5173)

## Smoke Test (MVP)
- Open frontend, click **Create Draft**, then **Submit Sample**.
- Backend will assign `ENV00001`, render envelope PDF (template with correct columns), and write files to:
  `storage/petty-cash/SMITH, Alex/ENV00001/`
- You should see:
  - `ENV00001-envelope.pdf` (formatted to template)
  - `ENV00001-receipts.pdf` (placeholder page)
  - `ENV00001.json`

Notes:
- ENV numbers are global and assigned on submit only.
- Totals & owed logic in PDF are computed from line items and float.
- Coding strip fields exist and render; front-end editing to be expanded.
- Alembic can be added later; dev uses `Base.metadata.create_all`.
