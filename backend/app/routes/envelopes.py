from fastapi import APIRouter

router = APIRouter()


@router.get("/envelopes/{env_no}")
def get_envelope(env_no: str):
    return {"envNo": env_no, "status": "STUB"}
