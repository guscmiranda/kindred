from uuid import UUID
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models import User
from app.schemas.interest import (
    InterestCategoryResponse,
    InterestResponse,
    UserInterestCreateRequest,
    UserInterestUpdateRequest,
    UserInterestResponse,
)
from app.services.interest import (
    get_interest_categories,
    get_interests,
    InterestNotFound,
    UserInterestAlreadyExists,
    UserInterestNotFound,
    get_user_interests,
    add_user_interest,
    update_user_interest,
    remove_user_interest,
)

router = APIRouter(prefix="/interests", tags=["Interests"])


@router.get(
    "/categories",
    response_model=list[InterestCategoryResponse],
)
def list_interest_categories(
    db: Session = Depends(get_db),
):
    return get_interest_categories(db)


@router.get(
    "",
    response_model=list[InterestResponse],
)
def list_interests(
    category_slug: str | None = Query(default=None, min_length=1),
    db: Session = Depends(get_db),
):
    return get_interests(db, category_slug)



@router.get(
    "/me",
    response_model=list[UserInterestResponse],
)
def list_my_interests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_interests(db, current_user)


@router.post(
    "/me",
    response_model=UserInterestResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_my_interest(
    data: UserInterestCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return add_user_interest(
            db,
            current_user,
            data.interest_id,
            data.interest_level,
            data.is_highlighted,
        )
    except InterestNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interesse não encontrado.",
        )
    except UserInterestAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este interesse já está associado ao seu perfil.",
        )


@router.patch(
    "/me/{interest_id}",
    response_model=UserInterestResponse,
)
def edit_my_interest(
    interest_id: UUID,
    data: UserInterestUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return update_user_interest(
            db,
            current_user,
            interest_id,
            data,
        )
    except UserInterestNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interesse não encontrado no seu perfil.",
        )


@router.delete(
    "/me/{interest_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_my_interest(
    interest_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        remove_user_interest(
            db,
            current_user,
            interest_id,
        )
    except UserInterestNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interesse não encontrado no seu perfil.",
        )
