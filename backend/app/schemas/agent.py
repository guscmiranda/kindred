from pydantic import BaseModel, Field


class PlaceSearchRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=1000,
        description="Solicitação de busca de lugares em linguagem natural.",
    )

class PlaceSearchResponse(BaseModel):
    response: str