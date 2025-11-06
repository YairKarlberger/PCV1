from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import EnvCounter


def get_next_env_no(db: Session) -> str:
    row = db.execute(select(EnvCounter).where(EnvCounter.id == 1)).scalar_one_or_none()
    if row is None:
        row = EnvCounter(id=1, next_int=1)
        db.add(row)
        db.flush()
    n = row.next_int
    row.next_int = n + 1
    db.flush()
    return f"ENV{n:05d}"
