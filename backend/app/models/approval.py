import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship

from app.db.base import Base


def _uuid_col():
    return Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))


class Approval(Base):
    __tablename__ = "approvals"

    id = _uuid_col()
    envelope_id = Column(String, ForeignKey("envelopes.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, nullable=False)  # custodian | supervisor | accounting
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    signed_at = Column(DateTime, nullable=True)
    signature_path = Column(String, nullable=True)

    envelope = relationship("Envelope", back_populates="approvals")
