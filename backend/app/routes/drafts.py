from fastapi import APIRouter

router = APIRouter()


@router.post("/drafts")
def create_draft():
    return {"draftId": "stub-draft-id"}
