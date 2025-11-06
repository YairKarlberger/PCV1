from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.routes import drafts, envelopes, health
from app.services.storage import ensure_storage

app = FastAPI(title="Petty Cash API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    ensure_storage()
    Base.metadata.create_all(bind=engine)


app.include_router(health.router, prefix="/api")
app.include_router(drafts.router, prefix="/api")
app.include_router(envelopes.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Petty Cash API running", "currency": settings.CURRENCY}
