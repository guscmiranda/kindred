
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class InterestCategoryResponse(BaseModel):
    """Dados de uma categoria do catálogo."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    description: str | None


class InterestResponse(BaseModel):
    """Dados de um interesse e suas categorias."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    description: str | None
    categories: list[InterestCategoryResponse]


class UserInterestCreateRequest(BaseModel):
    """Dados necessários para adicionar um interesse ao perfil."""

    interest_id: UUID
    interest_level: int = Field(ge=1, le=5)
    is_highlighted: bool = False


class UserInterestUpdateRequest(BaseModel):
    """Campos que podem ser atualizados em um interesse."""

    interest_level: int | None = Field(
        default=None,
        ge=1,
        le=5,
    )
    is_highlighted: bool | None = None

    @model_validator(mode="after")
    def validate_fields(self):
        if not self.model_fields_set:
            raise ValueError("Informe pelo menos um campo para atualizar.")

        for field in ("interest_level", "is_highlighted"):
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(f"{field} não pode ser nulo.")

        return self


class UserInterestResponse(BaseModel):
    """Interesse associado a um usuário."""

    model_config = ConfigDict(from_attributes=True)

    interest: InterestResponse
    interest_level: int
    is_highlighted: bool
    created_at: datetime