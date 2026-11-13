from uuid import UUID

from pydantic import BaseModel, Field


class PlaceSearchRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=1000,
        description="Solicitação de busca de lugares em linguagem natural.",
    )


class AgentPlaceCategoryResponse(BaseModel):
    name: str
    slug: str


class AgentPlaceAttributeResponse(BaseModel):
    group: str
    name: str
    slug: str


class AgentPlaceResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    address: str
    categories: list[AgentPlaceCategoryResponse]
    attributes: list[AgentPlaceAttributeResponse]


class PlaceSearchResponse(BaseModel):
    response: str
    places: list[AgentPlaceResponse]
    total: int