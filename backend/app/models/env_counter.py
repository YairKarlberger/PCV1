from sqlalchemy import Column, Integer

from app.db.base import Base


class EnvCounter(Base):
    __tablename__ = "env_counter"

    id = Column(Integer, primary_key=True)
    next_int = Column(Integer, nullable=False, default=1)
