from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Interest, InterestCategory, User, UserInterest
from app.schemas.interest import UserInterestUpdateRequest

def get_interest_categories(
    db: Session,
) -> list[InterestCategory]:
    """Retorna todas as categorias do catálogo."""

    statement = (
        select(InterestCategory)
        .order_by(InterestCategory.name)
    )

    return list(db.scalars(statement).all())


def get_interests(
    db: Session,
    category_slug: str | None = None,
) -> list[Interest]:
    """Retorna os interesses, opcionalmente filtrados por categoria."""

    statement = (
        select(Interest)
        .options(selectinload(Interest.categories))
        .order_by(Interest.name)
    )

    if category_slug is not None:
        statement = statement.where(
            Interest.categories.any(
                InterestCategory.slug == category_slug
            )
        )

    return list(db.scalars(statement).all())


def get_user_interests(
    db: Session,
    user: User,
) -> list[UserInterest]:
    """Retorna os interesses associados ao usuário."""

    statement = (
        select(UserInterest)
        .where(UserInterest.user_id == user.id)
        .options(
            selectinload(UserInterest.interest).selectinload(
                Interest.categories
            )
        )
        .order_by(UserInterest.created_at.desc())
    )

    return list(db.scalars(statement).all())


def add_user_interest(
    db: Session,
    user: User,
    interest_id: UUID,
    interest_level: int,
    is_highlighted: bool,
) -> UserInterest:
    """Adiciona um interesse ao perfil do usuário."""

    interest = db.get(Interest, interest_id)

    if interest is None:
        raise InterestNotFound

    association = db.get(
        UserInterest,
        (user.id, interest_id),
    )

    if association is not None:
        raise UserInterestAlreadyExists

    association = UserInterest(
        user_id=user.id,
        interest_id=interest_id,
        interest_level=interest_level,
        is_highlighted=is_highlighted,
    )

    db.add(association)
    db.commit()
    db.refresh(association)

    return association


def update_user_interest(
    db: Session,
    user: User,
    interest_id: UUID,
    data: UserInterestUpdateRequest,
) -> UserInterest:
    """Atualiza os dados de um interesse associado ao usuário."""

    association = db.get(
        UserInterest,
        (user.id, interest_id),
    )

    if association is None:
        raise UserInterestNotFound

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(association, field, value)

    db.commit()
    db.refresh(association)

    return association


def remove_user_interest(
    db: Session,
    user: User,
    interest_id: UUID,
) -> None:
    """Remove um interesse do perfil do usuário."""

    association = db.get(
        UserInterest,
        (user.id, interest_id),
    )

    if association is None:
        raise UserInterestNotFound

    db.delete(association)
    db.commit()


class InterestNotFound(Exception):
    pass


class UserInterestAlreadyExists(Exception):
    pass


class UserInterestNotFound(Exception):
    pass
