import uuid

from sqlalchemy import Column, Date, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


def _uuid_col():
    return Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))


class LineItem(Base):
    __tablename__ = "line_items"

    id = _uuid_col()
    envelope_id = Column(String, ForeignKey("envelopes.id", ondelete="CASCADE"), nullable=False)
    receipt_id = Column(String, ForeignKey("receipts.id", ondelete="SET NULL"), nullable=True)

    position = Column(Integer, nullable=True)

    date = Column(Date, nullable=True)
    vendor = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    category = Column(String, nullable=True)
    gl_account = Column(String, nullable=True)
    dept_code = Column(String, nullable=True)
    cost_code = Column(String, nullable=True)

    net = Column(Numeric(12, 2), nullable=True, default=0)
    pst = Column(Numeric(12, 2), nullable=True, default=0)
    gst = Column(Numeric(12, 2), nullable=True, default=0)
    hst = Column(Numeric(12, 2), nullable=True, default=0)
    tip = Column(Numeric(12, 2), nullable=True, default=0)
    total = Column(Numeric(12, 2), nullable=True, default=0)

    voucher_no = Column(String, nullable=True)

    envelope = relationship("Envelope", back_populates="lines")
    receipt = relationship("Receipt")
