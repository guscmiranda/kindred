
from datetime import datetime, timedelta, timezone
from uuid import UUID

import jwt

from app.core.config import settings


def create_access_token(user_id: UUID) -> str:
    """Gera um JWT de acesso para o usuário."""

    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(
            minutes=settings.access_token_expire_minutes
        ),
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> dict:
    """Decodifica e valida um JWT de acesso."""

    return jwt.decode(
        token,
        settings.jwt_secret_key.get_secret_value(),
        algorithms=[settings.jwt_algorithm],
        options={
            "require": ["sub", "iat", "exp"],
        },
    )
