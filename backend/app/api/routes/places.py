from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Literal
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import User
from app.schemas.place import (
    PlaceCreateRequest,
    PlaceListResponse,
    PlaceResponse,
    PlaceUpdateRequest,
)

from app.services.place import (
    PlaceAttributesNotFound,
    PlaceCategoriesNotFound,
    PlaceNotFound,
    PlacePermissionDenied,
    create_place,
    get_place_by_id,
    list_managed_places,
    list_place_attributes,
    list_place_categories,
    list_places,
    update_place,
    activate_place,
    deactivate_place,
)

router = APIRouter(prefix="/places", tags=["Places"])


@router.get(
    "",
    response_model=PlaceListResponse,
)
def get_places(
    name: str | None = Query(default=None, min_length=1),
    category: str | None = Query(default=None, min_length=1),
    attribute: list[str] | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    attributes = None

    if attribute:
        attributes = {}

        for item in attribute:
            try:
                group, slug = item.split(":", maxsplit=1)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Características devem seguir o formato grupo:slug.",
                )

            if group not in (
                "ambience",
                "activities",
                "music",
                "audience",
            ):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Grupo de característica inválido: {group}.",
                )

            if not slug:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="O identificador da característica não pode ser vazio.",
                )

            attributes.setdefault(group, []).append(slug)

    return list_places(
        db=db,
        name=name,
        category=category,
        attributes=attributes,
        limit=limit,
        offset=offset,
    )


@router.post(
    "/{place_id}/activate",
    response_model=PlaceResponse,
    status_code=status.HTTP_200_OK,
)
def activate_place_endpoint(
    place_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return activate_place(db, current_user, place_id)

    except PlaceNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estabelecimento não encontrado ou sem acesso.",
        )

    except PlacePermissionDenied:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para reativar este estabelecimento.",
        )

@router.delete(
    "/{place_id}",
    response_model=PlaceResponse,
    status_code=status.HTTP_200_OK,
)
def delete_place(
    place_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return deactivate_place(db, current_user, place_id)

    except PlaceNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estabelecimento não encontrado ou sem acesso.",
        )

    except PlacePermissionDenied:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para desativar este estabelecimento.",
        )

@router.get("/categories")
def get_place_categories(
    db: Session = Depends(get_db),
):
    return list_place_categories(db)

@router.get("/attributes")
def get_place_attributes(
    group: Literal[
        "ambience",
        "activities",
        "music",
        "audience",
    ] | None = None,
    db: Session = Depends(get_db),
):
    return list_place_attributes(db, group)

@router.get("/managed")
def get_managed_places(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_managed_places(db, current_user)

@router.get(
    "/{place_id}",
    response_model=PlaceResponse,
)
def get_place(
    place_id: UUID,
    db: Session = Depends(get_db),
):
    try:
        return get_place_by_id(db, place_id)

    except PlaceNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estabelecimento não encontrado.",
        )

@router.put(
    "/{place_id}",
    response_model=PlaceResponse,
)
def update_my_place(
    place_id: UUID,
    data: PlaceUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return update_place(db, current_user, place_id, data)

    except PlaceNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estabelecimento não encontrado ou sem acesso.",
        )

    except PlacePermissionDenied:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para editar este estabelecimento.",
        )

    except PlaceCategoriesNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Uma ou mais categorias não foram encontradas.",
        )

    except PlaceAttributesNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Uma ou mais características não foram encontradas ou estão inativas.",
        )

@router.post(
    "",
    response_model=PlaceResponse,
    status_code=status.HTTP_201_CREATED,
)

def create_my_place(
    data: PlaceCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_place(db, current_user, data)

    except PlaceCategoriesNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Uma ou mais categorias não foram encontradas.",
        )

    except PlaceAttributesNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Uma ou mais características não foram encontradas ou estão inativas.",
        )
