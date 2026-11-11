from pydantic import BaseModel, Field, model_validator
from uuid import UUID
from typing import Literal
from pydantic import BaseModel, ConfigDict

class ProfileUpdateRequest(BaseModel):
    """Campos que podem ser atualizados no perfil."""

    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=50,
    )
    display_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )
    bio: str | None = None
    pfp_url: str | None = None
    banner_url: str | None = None
    location: str | None = None
    visibility: Literal["public", "private"] | None = None

    @model_validator(mode="after")
    def validate_required_fields(self):
        for field in ("username", "display_name", "visibility"):
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(f"{field} não pode ser nulo.")

        return self

class ProfileResponse(BaseModel):
    """Dados públicos retornados pela API sobre um perfil."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    username: str
    display_name: str
    bio: str | None
    pfp_url: str | None
    banner_url: str | None
    location: str | None
    visibility: str