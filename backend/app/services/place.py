from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models import (
    Place,
    PlaceAttribute,
    PlaceCategory,
    PlaceManager,
    User,
)

from app.schemas.place import (
    ManagedPlaceResponse,
    PlaceAttributeResponse,
    PlaceCategoryResponse,
    PlaceCreateRequest,
    PlaceListResponse,
    PlaceUpdateRequest,
)


def create_place(
    db: Session,
    user: User,
    data: PlaceCreateRequest,
) -> Place:
    """Cria um estabelecimento e associa seu primeiro responsável."""

    categories = list(
        db.scalars(
            select(PlaceCategory).where(
                PlaceCategory.id.in_(data.category_ids)
            )
        ).all()
    )

    if len(categories) != len(data.category_ids):
        raise PlaceCategoriesNotFound

    attributes = list(
        db.scalars(
            select(PlaceAttribute).where(
                PlaceAttribute.id.in_(data.attribute_ids),
                PlaceAttribute.is_active.is_(True),
            )
        ).all()
    )

    if len(attributes) != len(data.attribute_ids):
        raise PlaceAttributesNotFound

    place = Place(
        name=data.name,
        description=data.description,
        address=data.address,
        latitude=data.latitude,
        longitude=data.longitude,
        categories=categories,
        attributes=attributes,
    )

    place.managers.append(
        PlaceManager(
            user=user,
            role="owner",
        )
    )

    try:
        db.add(place)
        db.commit()
        db.refresh(place)
    except Exception:
        db.rollback()
        raise

    return place

def list_places(
    db: Session,
    name: str | None = None,
    category: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> PlaceListResponse:
    """Lista estabelecimentos ativos com filtros e paginação."""

    filters = [Place.is_active.is_(True)]

    if name:
        filters.append(Place.name.ilike(f"%{name}%"))

    if category:
        filters.append(
            Place.categories.any(PlaceCategory.slug == category)
        )

    total = db.scalar(
        select(func.count(Place.id)).where(*filters)
    ) or 0

    statement = (
        select(Place)
        .options(
            selectinload(Place.categories),
            selectinload(Place.attributes),
        )
        .where(*filters)
        .order_by(Place.name.asc())
        .limit(limit)
        .offset(offset)
    )

    places = list(db.scalars(statement).all())

    return PlaceListResponse(
        items=places,
        total=total,
        limit=limit,
        offset=offset,
    )

def get_place_by_id(
    db: Session,
    place_id: UUID,
) -> Place:
    """Busca um estabelecimento ativo pelo seu identificador."""

    statement = (
        select(Place)
        .options(
            selectinload(Place.categories),
            selectinload(Place.attributes),
        )
        .where(
            Place.id == place_id,
            Place.is_active.is_(True),
        )
    )

    place = db.scalar(statement)

    if place is None:
        raise PlaceNotFound

    return place

def update_place(
    db: Session,
    user: User,
    place_id: UUID,
    data: PlaceUpdateRequest,
) -> Place:
    """Atualiza um estabelecimento conforme as permissões do usuário."""

    statement = (
        select(Place, PlaceManager.role)
        .join(PlaceManager, Place.id == PlaceManager.place_id)
        .options(
            selectinload(Place.categories),
            selectinload(Place.attributes),
        )
        .where(
            Place.id == place_id,
            PlaceManager.user_id == user.id,
            Place.is_active.is_(True),
        )
    )

    result = db.execute(statement).first()

    if result is None:
        raise PlaceNotFound

    place, role = result

    if role not in ("owner", "admin"):
        raise PlacePermissionDenied

    categories = list(
        db.scalars(
            select(PlaceCategory).where(
                PlaceCategory.id.in_(data.category_ids)
            )
        ).all()
    )

    if len(categories) != len(data.category_ids):
        raise PlaceCategoriesNotFound

    attributes = list(
        db.scalars(
            select(PlaceAttribute).where(
                PlaceAttribute.id.in_(data.attribute_ids),
                PlaceAttribute.is_active.is_(True),
            )
        ).all()
    )

    if len(attributes) != len(data.attribute_ids):
        raise PlaceAttributesNotFound

    place.name = data.name
    place.description = data.description
    place.address = data.address
    place.latitude = data.latitude
    place.longitude = data.longitude
    place.categories = categories
    place.attributes = attributes

    try:
        db.commit()
        db.refresh(place)
    except Exception:
        db.rollback()
        raise

    return place

def list_place_categories(
    db: Session,
) -> list[PlaceCategoryResponse]:
    """Lista as categorias disponíveis para estabelecimentos."""

    statement = select(PlaceCategory).order_by(PlaceCategory.name.asc())

    categories = db.scalars(statement).all()

    return [
        PlaceCategoryResponse.model_validate(category)
        for category in categories
    ]


def list_place_attributes(
    db: Session,
    group: str | None = None,
) -> list[PlaceAttributeResponse]:
    """Lista características ativas, opcionalmente filtradas por grupo."""

    statement = select(PlaceAttribute).where(
        PlaceAttribute.is_active.is_(True)
    )

    if group:
        statement = statement.where(PlaceAttribute.group == group)

    statement = statement.order_by(
        PlaceAttribute.group.asc(),
        PlaceAttribute.name.asc(),
    )

    attributes = db.scalars(statement).all()

    return [
        PlaceAttributeResponse.model_validate(attribute)
        for attribute in attributes
    ]


def list_managed_places(
    db: Session,
    user: User,
) -> list[ManagedPlaceResponse]:
    """Lista os estabelecimentos gerenciados por um usuário."""

    statement = (
        select(Place, PlaceManager.role)
        .join(PlaceManager, Place.id == PlaceManager.place_id)
        .options(
            selectinload(Place.categories),
            selectinload(Place.attributes),
        )
        .where(PlaceManager.user_id == user.id)
        .order_by(Place.name.asc())
    )

    results = db.execute(statement).all()

    return [
        ManagedPlaceResponse(
            place=place,
            role=role,
        )
        for place, role in results
    ]


def activate_place(db: Session, user: User, place_id: UUID) -> Place:
    """Reativa um estabelecimento desativado."""

    statement = (
        select(Place, PlaceManager.role)
        .join(PlaceManager, PlaceManager.place_id == Place.id)
        .where(
            Place.id == place_id,
            PlaceManager.user_id == user.id,
            Place.is_active.is_(False),
        )
    )

    result = db.execute(statement).first()

    if result is None:
        raise PlaceNotFound

    place, role = result

    if role not in ("owner", "admin"):
        raise PlacePermissionDenied

    try:
        place.is_active = True

        db.commit()
        db.refresh(place)

    except Exception:
        db.rollback()
        raise

    return place

def deactivate_place(db: Session, user: User, place_id: UUID) -> Place:
    """Desativa um estabelecimento, sem excluir seus dados."""

    statement = (
        select(Place, PlaceManager.role)
        .join(PlaceManager, PlaceManager.place_id == Place.id)
        .where(
            Place.id == place_id,
            PlaceManager.user_id == user.id,
            Place.is_active.is_(True),
        )
    )

    result = db.execute(statement).first()

    if result is None:
        raise PlaceNotFound

    place, role = result

    if role not in ("owner", "admin"):
        raise PlacePermissionDenied

    try:
        place.is_active = False

        db.commit()
        db.refresh(place)

    except Exception:
        db.rollback()
        raise

    return place

class PlaceCategoriesNotFound(Exception):
    pass


class PlaceAttributesNotFound(Exception):
    pass

class PlaceNotFound(Exception):
    pass

class PlacePermissionDenied(Exception):
    pass