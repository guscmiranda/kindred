
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
)

from app.services.auth import (
    EmailAlreadyExists,
    UsernameAlreadyExists,
    register_user,
    InvalidCredentials,
    login_user,
)
from app.services.token import create_access_token
from app.api.deps import get_current_user
from app.models import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    """Registra um usuário e seu perfil."""

    try:
        user, profile = register_user(db, data)

    except EmailAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este e-mail já está cadastrado.",
        )

    except UsernameAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este username já está em uso.",
        )

    return RegisterResponse(
        id=user.id,
        email=user.email,
        username=profile.username,
        display_name=profile.display_name,
        bio=profile.bio,
    )

@router.post("/login", response_model=LoginResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    try:
        user = login_user(
            db,
            str(data.email),
            data.password.get_secret_value(),
        )
    except InvalidCredentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(user.id)

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
    )

@router.get("/me", response_model=RegisterResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return RegisterResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.profile.username,
        display_name=current_user.profile.display_name,
        bio=current_user.profile.bio,
    )