import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Enum, Numeric, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


def _uuid_col():
    return Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))


class EnvelopeStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    FAILED_EXPORT = "FAILED_EXPORT"
    REJECTED = "REJECTED"


class Envelope(Base):
    __tablename__ = "envelopes"

    id = _uuid_col()
    env_no = Column(String, unique=True, nullable=True)
    production = Column(String, nullable=True)
    dept = Column(String, nullable=True)

    custodian_first = Column(String, nullable=False)
    custodian_last = Column(String, nullable=False)

    currency = Column(String, nullable=False, default="CAD")
    float_amount = Column(Numeric(12, 2), nullable=False, default=0)

    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    co = Column(String, nullable=True)
    loc = Column(String, nullable=True)
    epi = Column(String, nullable=True)
    detl = Column(String, nullable=True)
    set = Column(String, nullable=True)
    ff1 = Column(String, nullable=True)
    ff4 = Column(String, nullable=True)

    status = Column(Enum(EnvelopeStatus), nullable=False, default=EnvelopeStatus.DRAFT)
    approver_notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    receipts = relationship("Receipt", back_populates="envelope", cascade="all, delete-orphan")
    lines = relationship("LineItem", back_populates="envelope", cascade="all, delete-orphan")
    approvals = relationship("Approval", back_populates="envelope", cascade="all, delete-orphan")
