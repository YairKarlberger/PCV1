import uuid

from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Numeric, String
from sqlalchemy.orm import relationship

from app.db.base import Base


def _uuid_col():
    return Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))


class Receipt(Base):
    __tablename__ = "receipts"

    id = _uuid_col()
    envelope_id = Column(String, ForeignKey("envelopes.id", ondelete="CASCADE"), nullable=False)

    original_filename = Column(String, nullable=True)
    file_path = Column(String, nullable=True)

    detected_datetime = Column(DateTime, nullable=True)
    vendor = Column(String, nullable=True)

    net = Column(Numeric(12, 2), nullable=True)
    pst = Column(Numeric(12, 2), nullable=True)
    gst = Column(Numeric(12, 2), nullable=True)
    hst = Column(Numeric(12, 2), nullable=True)
    tip = Column(Numeric(12, 2), nullable=True)
    total = Column(Numeric(12, 2), nullable=True)

    phash = Column(String, nullable=True)
    ocr_json = Column(JSON, nullable=True)
    flags_json = Column(JSON, nullable=True)
    confidence = Column(Float, nullable=True)

    envelope = relationship("Envelope", back_populates="receipts")
