import json
import os

from app.core.config import settings


def ensure_storage() -> None:
    os.makedirs(settings.STORAGE_ROOT, exist_ok=True)
    os.makedirs(os.path.join(settings.STORAGE_ROOT, "tmp"), exist_ok=True)
    os.makedirs(os.path.join(settings.STORAGE_ROOT, "petty-cash"), exist_ok=True)


def person_folder(last_name: str, first_name: str) -> str:
    root = os.path.join(settings.STORAGE_ROOT, "petty-cash")
    folder = os.path.join(root, f"{last_name.upper()}, {first_name.title()}")
    os.makedirs(folder, exist_ok=True)
    return folder


def env_folder(last_name: str, first_name: str, env_no: str) -> str:
    folder = os.path.join(person_folder(last_name, first_name), env_no)
    os.makedirs(folder, exist_ok=True)
    return folder


def write_pdf_bytes(path: str, data: bytes) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as fh:
        fh.write(data)


def write_json(path: str, payload: dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
