
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models import User
from app.models import Profile
from app.schemas.profile import ProfileUpdateRequest


class UsernameAlreadyExists(Exception):
    """Indica que o username já está sendo utilizado."""


def update_profile(
    db: Session,
    profile: Profile,
    data: ProfileUpdateRequest,
) -> Profile:
    """Atualiza os campos enviados de um perfil."""

    updates = data.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(profile, field, value)

    try:
        db.commit()
        db.refresh(profile)
        return profile

    except IntegrityError as error:
        db.rollback()

        diagnostic = getattr(error.orig, "diag", None)
        constraint = getattr(diagnostic, "constraint_name", None)

        if constraint == "profiles_username_key":
            raise UsernameAlreadyExists from error

        raise

class ProfileNotFound(Exception):
    """Indica que o perfil não existe ou não pode ser visualizado."""


class PrivateProfile(Exception):
    """Indica que o perfil é privado para o solicitante."""

def get_profile_by_username(
    db: Session,
    username: str,
    current_user: User | None,
) -> Profile:
    """Busca um perfil pelo username respeitando sua visibilidade."""

    profile = db.scalar(
        select(Profile).where(Profile.username == username)
    )

    if profile is None:
        raise ProfileNotFound

    if profile.visibility == "private":
        if current_user is None or current_user.id != profile.user_id:
            raise PrivateProfile

    return profile