
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from typing import Literal

class PlaceCreateRequest(BaseModel):
    """Dados necessários para cadastrar um estabelecimento."""

    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=150)
    description: str | None = None
    address: str = Field(min_length=1, max_length=255)

    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)

    category_ids: list[UUID] = Field(min_length=1)
    attribute_ids: list[UUID] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_fields(self):
        if (self.latitude is None) != (self.longitude is None):
            raise ValueError(
                "Latitude e longitude devem ser informadas juntas."
            )

        if len(self.category_ids) != len(set(self.category_ids)):
            raise ValueError("Não informe categorias duplicadas.")

        if len(self.attribute_ids) != len(set(self.attribute_ids)):
            raise ValueError("Não informe características duplicadas.")

        return self


class PlaceUpdateRequest(BaseModel):
    """Dados para atualizar um estabelecimento."""

    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=150)
    description: str | None = None
    address: str = Field(min_length=1, max_length=255)

    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)

    category_ids: list[UUID] = Field(min_length=1)
    attribute_ids: list[UUID] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_fields(self):
        if (self.latitude is None) != (self.longitude is None):
            raise ValueError(
                "Latitude e longitude devem ser informadas juntas."
            )

        if len(self.category_ids) != len(set(self.category_ids)):
            raise ValueError("Não informe categorias duplicadas.")

        if len(self.attribute_ids) != len(set(self.attribute_ids)):
            raise ValueError("Não informe características duplicadas.")

        return self

class PlaceCategoryResponse(BaseModel):
    """Dados de uma categoria de estabelecimento."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    description: str | None


class PlaceAttributeResponse(BaseModel):
    """Dados de uma característica de estabelecimento."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    group: str
    description: str | None


class PlaceResponse(BaseModel):
    """Dados de um estabelecimento."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    description: str | None
    address: str
    latitude: float | None
    longitude: float | None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    categories: list[PlaceCategoryResponse]
    attributes: list[PlaceAttributeResponse]

class PlaceListResponse(BaseModel):
    """Resultado paginado da listagem de estabelecimentos."""

    items: list[PlaceResponse]
    total: int
    limit: int
    offset: int

class ManagedPlaceResponse(BaseModel):
    """Estabelecimento associado ao usuário e seu papel de gerenciamento."""

    place: PlaceResponse
    role: Literal["owner", "admin", "editor"]