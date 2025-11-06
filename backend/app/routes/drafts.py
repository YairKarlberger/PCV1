from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models import Envelope, EnvelopeStatus, LineItem
from app.pdf.render import render_envelope_pdf, render_receipts_pdf
from app.routes._schemas import EnvelopeHeaderIn, LinesIn
from app.services.env_number import get_next_env_no
from app.services import storage

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/drafts")
def create_draft(payload: EnvelopeHeaderIn, db: Session = Depends(get_db)):
    if not payload.custodian_first or not payload.custodian_last:
        raise HTTPException(status_code=400, detail="custodian_first and custodian_last are required")

    env = Envelope(
        production=payload.production,
        dept=payload.dept,
        custodian_first=payload.custodian_first,
        custodian_last=payload.custodian_last,
        currency=payload.currency or "CAD",
        float_amount=payload.float_amount if payload.float_amount is not None else 0,
        start_date=payload.start_date,
        end_date=payload.end_date,
        co=payload.co,
        loc=payload.loc,
        epi=payload.epi,
        detl=payload.detl,
        set=payload.set,
        ff1=payload.ff1,
        ff4=payload.ff4,
        status=EnvelopeStatus.DRAFT,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(env)
    db.commit()
    db.refresh(env)
    return {"draftId": env.id}


@router.put("/drafts/{draft_id}/header")
def update_header(draft_id: str, payload: EnvelopeHeaderIn, db: Session = Depends(get_db)):
    env = db.get(Envelope, draft_id)
    if not env or env.status != EnvelopeStatus.DRAFT:
        raise HTTPException(status_code=404, detail="Draft not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(env, key, value)

    env.updated_at = datetime.utcnow()
    db.commit()
    return {"ok": True}


@router.put("/drafts/{draft_id}/lines")
def upsert_lines(draft_id: str, payload: LinesIn, db: Session = Depends(get_db)):
    env = db.get(Envelope, draft_id)
    if not env or env.status != EnvelopeStatus.DRAFT:
        raise HTTPException(status_code=404, detail="Draft not found")

    position_counter = 1
    for item in payload.items:
        data = item.model_dump(exclude_unset=True)
        line_id = data.pop("id", None)

        if line_id:
            line = db.get(LineItem, line_id)
            if not line:
                raise HTTPException(status_code=404, detail=f"Line {line_id} not found")
            if line.envelope_id != env.id:
                raise HTTPException(status_code=400, detail="Line item does not belong to draft")
        else:
            line = LineItem(envelope_id=env.id)
            db.add(line)

        position = data.pop("position", None)
        for key, value in data.items():
            setattr(line, key, value)

        line.position = position or line.position or position_counter
        position_counter += 1

    env.updated_at = datetime.utcnow()
    db.commit()
    return {"ok": True}


@router.post("/drafts/{draft_id}/submit")
def submit_draft(draft_id: str, db: Session = Depends(get_db)):
    env = db.get(Envelope, draft_id)
    if not env or env.status != EnvelopeStatus.DRAFT:
        raise HTTPException(status_code=404, detail="Draft not found")

    lines = (
        db.execute(select(LineItem).where(LineItem.envelope_id == env.id).order_by(LineItem.position))
        .scalars()
        .all()
    )
    if not lines:
        raise HTTPException(status_code=400, detail="No line items to submit")

    env_no = get_next_env_no(db)
    env.env_no = env_no
    env.status = EnvelopeStatus.SUBMITTED
    env.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(env)

    storage.ensure_storage()
    env_dir = storage.env_folder(env.custodian_last, env.custodian_first, env_no)
    envelope_pdf_path = f"{env_dir}/{env_no}-envelope.pdf"
    receipts_pdf_path = f"{env_dir}/{env_no}-receipts.pdf"
    json_path = f"{env_dir}/{env_no}.json"

    envelope_bytes = render_envelope_pdf(env.id)
    receipts_bytes = render_receipts_pdf(env.id)
    storage.write_pdf_bytes(envelope_pdf_path, envelope_bytes)
    storage.write_pdf_bytes(receipts_pdf_path, receipts_bytes)

    payload = {
        "env_no": env_no,
        "custodian": {"first": env.custodian_first, "last": env.custodian_last},
        "production": env.production,
        "dept": env.dept,
        "currency": env.currency,
        "float_amount": str(env.float_amount) if env.float_amount is not None else None,
        "start_date": env.start_date.isoformat() if env.start_date else None,
        "end_date": env.end_date.isoformat() if env.end_date else None,
        "coding": {
            "co": env.co,
            "loc": env.loc,
            "epi": env.epi,
            "detl": env.detl,
            "set": env.set,
            "ff1": env.ff1,
            "ff4": env.ff4,
        },
        "lines": [
            {
                "id": line.id,
                "position": line.position,
                "date": line.date.isoformat() if line.date else None,
                "vendor": line.vendor,
                "description": line.description,
                "category": line.category,
                "gl_account": line.gl_account,
                "dept_code": line.dept_code,
                "cost_code": line.cost_code,
                "net": str(line.net) if line.net is not None else None,
                "pst": str(line.pst) if line.pst is not None else None,
                "gst": str(line.gst) if line.gst is not None else None,
                "hst": str(line.hst) if line.hst is not None else None,
                "tip": str(line.tip) if line.tip is not None else None,
                "total": str(line.total) if line.total is not None else None,
                "voucher_no": line.voucher_no,
            }
            for line in lines
        ],
        "submitted_at": datetime.utcnow().isoformat() + "Z",
    }
    storage.write_json(json_path, payload)

    return {
        "envNo": env_no,
        "envelopePdfPath": envelope_pdf_path,
        "receiptsPdfPath": receipts_pdf_path,
        "jsonPath": json_path,
    }
