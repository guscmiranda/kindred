
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import User
from app.schemas.profile import (
    ProfileUpdateRequest,
    ProfileResponse,
)
from app.services.profile import (
    UsernameAlreadyExists,
    update_profile,
)

router = APIRouter(prefix="/profiles", tags=["Profiles"])


@router.patch("/me", response_model=ProfileResponse)
def update_my_profile(
    data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        profile = update_profile(
            db,
            current_user.profile,
            data,
        )
    except UsernameAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este username já está em uso.",
        )

    return ProfileResponse.model_validate(profile)
