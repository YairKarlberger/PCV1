from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models import Envelope, LineItem

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/envelopes/{env_no}")
def get_envelope(env_no: str, db: Session = Depends(get_db)):
    env = db.execute(select(Envelope).where(Envelope.env_no == env_no)).scalar_one_or_none()
    if not env:
        raise HTTPException(status_code=404, detail="Envelope not found")

    lines = (
        db.execute(
            select(LineItem).where(LineItem.envelope_id == env.id).order_by(LineItem.position)
        )
        .scalars()
        .all()
    )

    return {
        "envNo": env.env_no,
        "custodian": {"first": env.custodian_first, "last": env.custodian_last},
        "production": env.production,
        "dept": env.dept,
        "float_amount": str(env.float_amount) if env.float_amount is not None else None,
        "lines": [
            {
                "position": li.position,
                "date": li.date.isoformat() if li.date else None,
                "vendor": li.vendor,
                "description": li.description,
                "net": str(li.net) if li.net is not None else None,
                "pst": str(li.pst) if li.pst is not None else None,
                "gst": str(li.gst) if li.gst is not None else None,
                "hst": str(li.hst) if li.hst is not None else None,
                "tip": str(li.tip) if li.tip is not None else None,
                "total": str(li.total) if li.total is not None else None,
                "voucher_no": li.voucher_no,
            }
            for li in lines
        ],
    }
