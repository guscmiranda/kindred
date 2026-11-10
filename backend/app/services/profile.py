
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

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
