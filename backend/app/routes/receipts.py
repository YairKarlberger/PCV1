from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import List
import os
import shutil
import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import SessionLocal
from app.core.config import settings
from app.models import Envelope, Receipt

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _tmp_dir(draft_id: str) -> str:
    path = os.path.join(settings.STORAGE_ROOT, "tmp", draft_id)
    os.makedirs(path, exist_ok=True)
    return path


@router.post("/receipts/upload")
async def upload_receipts(
    draftId: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    env = db.get(Envelope, draftId)
    if not env or env.env_no is not None:
        raise HTTPException(status_code=404, detail="Draft not found or already submitted")

    saved = []
    tmp_dir = _tmp_dir(draftId)

    for upload in files:
        name = upload.filename or "upload"
        ext = os.path.splitext(name)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".pdf"]:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

        receipt_id = str(uuid.uuid4())
        safe_name = f"{receipt_id}{ext}"
        dest = os.path.join(tmp_dir, safe_name)
        with open(dest, "wb") as out:
            shutil.copyfileobj(upload.file, out)

        receipt = Receipt(
            id=receipt_id,
            envelope_id=env.id,
            original_filename=name,
            file_path=dest,
        )
        db.add(receipt)
        saved.append({"id": receipt_id, "original": name, "path": dest})

    db.commit()

    return {"uploaded": saved}


@router.get("/receipts/list/{draft_id}")
def list_receipts(draft_id: str, db: Session = Depends(get_db)):
    env = db.get(Envelope, draft_id)
    if not env or env.env_no is not None:
        raise HTTPException(status_code=404, detail="Draft not found or already submitted")

    receipts = db.execute(select(Receipt).where(Receipt.envelope_id == env.id)).scalars().all()
    return [{"id": receipt.id, "file": receipt.original_filename, "path": receipt.file_path} for receipt in receipts]
