from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.services.storage import ensure_storage
from app.routes import health, drafts, receipts, envelopes

app = FastAPI(title="Petty Cash App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    ensure_storage()
    Base.metadata.create_all(bind=engine)


app.include_router(health.router, prefix="/api")
app.include_router(drafts.router, prefix="/api")
app.include_router(receipts.router, prefix="/api")
app.include_router(envelopes.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Petty Cash API running"}
