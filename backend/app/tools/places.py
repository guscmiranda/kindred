
from sqlalchemy.orm import Session

from app.services.place import (
    list_place_attributes,
    list_place_categories,
    list_places,
)


ATTRIBUTE_GROUPS = {
    "ambience",
    "activities",
    "music",
    "audience",
}

SEARCH_PLACES_TOOL = {
    "type": "function",
    "function": {
        "name": "search_places",
        "description": (
            "Search for active establishments in the Kindred catalog. "
            "Use this tool when the user wants to discover places. "
            "You can filter by name, category and characteristics. "
            "IMPORTANT: Use 'name' only when the user explicitly "
            "mentions an establishment name. "
            "Never use descriptive words such as 'tranquilo', "
            "'aconchegante' or 'intimista' as a name. "
            "Category and characteristic values must use their exact "
            "catalog slugs. "
            "All characteristics must be inside the 'attributes' object. "
            "When multiple characteristic groups are provided, "
            "the place must match all groups."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": (
                        "Optional partial name of a specific establishment. "
                        "Use this ONLY when the user explicitly mentions "
                        "the name of a place or asks for a place by name. "
                        "Never put ambience, activities, music styles, "
                        "audience characteristics or general descriptive "
                        "words here. For example, 'tranquilo' is an ambience "
                        "characteristic, not a place name."
                    ),
                },
                "category": {
                    "type": "string",
                    "description": (
                    "Optional category slug. Use ONLY when the user "
                    "explicitly specifies a place category. "
                    "Never infer a category from ambience or activities."
                ),
                },
                "ambience": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Desired ambience characteristics. Use exact catalog slugs."
                },
                "activities": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Desired activities. Use exact catalog slugs."
                },
                "music": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Desired music styles. Use exact catalog slugs."
                },
                "audience": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Desired audience characteristics. Use exact catalog slugs."
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of establishments to return.",
                    "minimum": 1,
                    "maximum": 20,
                    "default": 10,
                },
            },
            "required": [],
            "additionalProperties": False,
        },
    },
}

def get_place_catalog(db: Session) -> dict:
    """Retorna as categorias e características disponíveis no catálogo."""

    categories = list_place_categories(db)
    attributes = list_place_attributes(db)

    return {
        "categories": [
            {
                "name": category.name,
                "slug": category.slug,
            }
            for category in categories
        ],
        "attributes": [
            {
                "group": attribute.group,
                "name": attribute.name,
                "slug": attribute.slug,
            }
            for attribute in attributes
        ],
    }

def search_places(
    db: Session,
    name: str | None = None,
    category: str | None = None,
    attributes: dict[str, list[str]] | None = None,
    limit: int = 10,
) -> dict:
    """
    Busca estabelecimentos no catálogo do Kindred.

    Recebe critérios estruturados e utiliza o serviço existente
    para consultar os estabelecimentos cadastrados.
    """

    if limit < 1 or limit > 20:
        raise ValueError("O limite deve estar entre 1 e 20.")

    if attributes:
        for group, slugs in attributes.items():
            if group not in ATTRIBUTE_GROUPS:
                raise ValueError(
                    f"Grupo de característica inválido: {group}."
                )

            if not slugs:
                raise ValueError(
                    f"O grupo {group} precisa ter ao menos uma característica."
                )

    result = list_places(
        db=db,
        name=name,
        category=category,
        attributes=attributes,
        limit=limit,
    )

    return {
        "total": result.total,
        "items": [
            {
                "id": str(place.id),
                "name": place.name,
                "description": place.description,
                "address": place.address,
                "categories": [
                    {
                        "name": category.name,
                        "slug": category.slug,
                    }
                    for category in place.categories
                ],
                "attributes": [
                    {
                        "group": attribute.group,
                        "name": attribute.name,
                        "slug": attribute.slug,
                    }
                    for attribute in place.attributes
                ],
            }
            for place in result.items
        ],
    }
