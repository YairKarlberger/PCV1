import os

from app.core.config import settings


def ensure_storage():
    os.makedirs(settings.STORAGE_ROOT, exist_ok=True)
    os.makedirs(os.path.join(settings.STORAGE_ROOT, "tmp"), exist_ok=True)
    os.makedirs(os.path.join(settings.STORAGE_ROOT, "petty-cash"), exist_ok=True)
