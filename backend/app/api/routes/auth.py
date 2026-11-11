
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
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


@router.post("/login")
def login(
    data: LoginRequest,
    response: Response,
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

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.environment == "production",
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )

    return {
        "message": "Login realizado com sucesso."
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=settings.environment == "production",
        samesite="lax",
        path="/",
    )

    return {"message": "Logout realizado com sucesso."}


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