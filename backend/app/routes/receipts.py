from fastapi import APIRouter

router = APIRouter()


@router.post("/receipts/upload")
def upload_receipts():
    return {"receipts": []}
