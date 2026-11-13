
import json
import unicodedata
from unittest import result

from sqlalchemy.orm import Session

from app.core.ollama import chat
from app.tools.places import (
    ATTRIBUTE_GROUPS,
    SEARCH_PLACES_TOOL,
    get_place_catalog,
    search_places,
)


SYSTEM_PROMPT = """
Você é o agente especializado em descoberta de lugares do Kindred.

Sua responsabilidade é ajudar usuários a encontrar estabelecimentos
que correspondam às suas descrições e preferências.

Instruções:
- Responda sempre em português do Brasil.
- Utilize search_places quando precisar descobrir lugares.
- Não invente estabelecimentos nem características.
- Utilize somente os slugs existentes no catálogo.
- Passe características usando os parâmetros ambience, activities,
  music e audience.
- Só utilize category quando o usuário especificar uma categoria.
- Não deduza categorias a partir do ambiente ou das atividades.
- Não invente informações que não estejam nos resultados da ferramenta.
- Apresente os resultados de maneira natural e objetiva.
- Utilize a palavra estabelecimento ou lugar ao se referir aos
  resultados, sem presumir que pertencem a uma única categoria.
- Não afirme que um estabelecimento é ideal ou garante determinada
  experiência. Explique apenas quais características correspondem
  ao que o usuário procura.
- Se nenhum estabelecimento for encontrado, informe isso claramente.
"""


MAX_TOOL_ROUNDS = 3

def normalize_text(value: str) -> str:
    """Normalizes text for case-insensitive and accent-insensitive comparison."""
    normalized = unicodedata.normalize("NFKD", value.lower())
    return "".join(
        char for char in normalized
        if not unicodedata.combining(char)
    )

def execute_tool(
    db: Session,
    tool_name: str,
    tool_args: dict,
    user_message: str,
) -> dict:
    """Executes a tool available to the agent."""

    if tool_name != "search_places":
        raise ValueError(f"Unknown tool: {tool_name}")

    if not isinstance(tool_args, dict):
        raise ValueError("Tool arguments must be an object.")

    allowed_arguments = {
        "name",
        "category",
        "ambience",
        "activities",
        "music",
        "audience",
        "limit",
    }

    unexpected_arguments = set(tool_args) - allowed_arguments

    if unexpected_arguments:
        raise ValueError(
            f"Unexpected arguments: {unexpected_arguments}"
        )

    normalized_message = normalize_text(user_message)
    catalog = get_place_catalog(db)

    attributes_catalog = {
        group: [
            attribute
            for attribute in catalog["attributes"]
            if attribute["group"] == group
        ]
        for group in ATTRIBUTE_GROUPS
    }

    attributes = {}

    for group, available_attributes in attributes_catalog.items():
        requested_values = tool_args.get(group, [])

        if isinstance(requested_values, str):
            requested_values = [requested_values]

        if not isinstance(requested_values, list):
            continue

        valid_slugs = []

        for requested_value in requested_values:
            if not isinstance(requested_value, str):
                continue

            for attribute in available_attributes:
                slug = normalize_text(attribute["slug"])
                name = normalize_text(attribute["name"])

                if (
                    normalize_text(requested_value) in {slug, name}
                    and (slug in normalized_message or name in normalized_message)
                ):
                    valid_slugs.append(attribute["slug"])
                    break

        if valid_slugs:
            attributes[group] = list(dict.fromkeys(valid_slugs))

    category = tool_args.get("category")

    if isinstance(category, str):
        category = next(
            (
                item["slug"]
                for item in catalog["categories"]
                if normalize_text(category) in {
                    normalize_text(item["slug"]),
                    normalize_text(item["name"]),
                }
                and (
                    normalize_text(item["slug"]) in normalized_message
                    or normalize_text(item["name"]) in normalized_message
                )
            ),
            None,
        )
    else:
        category = None

    name = tool_args.get("name")

    if isinstance(name, str):
        name = name.strip()
        generic_names = {
            "lugar",
            "local",
            "estabelecimento",
            "espaco",
        }

        if (
            not name
            or normalize_text(name) in generic_names
            or normalize_text(name) not in normalized_message
        ):
            name = None
    else:
        name = None

    result = search_places(
        db=db,
        name=name,
        category=category,
        attributes=attributes or None,
        limit=tool_args.get("limit", 10),
    )

    if attributes:
        for item in result["items"]:
            item["attributes"] = [
                attribute
                for attribute in item["attributes"]
                if attribute["group"] in attributes
                and attribute["slug"] in attributes[attribute["group"]]
            ]

    return result


async def run_place_agent(
    db: Session,
    user_message: str,
) -> str:
    """
    Executa o agente de descoberta de lugares.

    Recebe uma solicitação, coordena o modelo e as ferramentas
    disponíveis e retorna uma resposta em linguagem natural.
    """

    if not user_message.strip():
        raise ValueError("A mensagem do usuário não pode estar vazia.")

    catalog = get_place_catalog(db)

    catalog_context = json.dumps(
        catalog,
        ensure_ascii=False,
        indent=2,
    )

    messages = [
        {
            "role": "system",
            "content": (
                f"{SYSTEM_PROMPT}\n\n"
                "CATÁLOGO DISPONÍVEL:\n"
                f"{catalog_context}\n\n"
                "REGRAS PARA OS FILTROS:\n"
                "- Utilize somente categorias e slugs presentes no catálogo.\n"
                "- Nunca traduza, invente ou adapte slugs.\n"
                "- Características devem ficar dentro de 'attributes'.\n"
                "- Utilize somente grupos de características relevantes "
                "para o pedido do usuário.\n"
                "- Não adicione filtros que o usuário não solicitou "
                "ou que não sejam necessários para interpretar seu pedido.\n"
                "- Se o usuário não especificar uma categoria, "
                "não envie o parâmetro 'category'.\n"
                "- Se o usuário não mencionar o nome de um estabelecimento, "
                "não envie o parâmetro 'name'.\n"
                "- Se não houver uma característica correspondente no catálogo, "
                "não invente uma alternativa."
            ),
        },
        {
            "role": "user",
            "content": user_message,
        },
    ]

    for _ in range(MAX_TOOL_ROUNDS):
        response = await chat(
            messages=messages,
            tools=[SEARCH_PLACES_TOOL],
        )

        assistant_message = response["message"]

        tool_calls = assistant_message.get("tool_calls", [])

        if not tool_calls:
            return assistant_message.get("content", "")

        messages.append(assistant_message)

        for tool_call in tool_calls:
            function = tool_call["function"]
            tool_name = function["name"]
            tool_args = function["arguments"]

            if isinstance(tool_args, str):
                tool_args = json.loads(tool_args)

            try:
                tool_result = execute_tool(
                    db=db,
                    tool_name=tool_name,
                    tool_args=tool_args,
                    user_message=user_message,
                )
            except (ValueError, TypeError) as error:
                tool_result = {
                    "error": str(error),
                }

            messages.append(
                {
                    "role": "tool",
                    "tool_name": tool_name,
                    "content": json.dumps(
                        tool_result,
                        ensure_ascii=False,
                    ),
                }
            )

    raise RuntimeError(
        "O agente excedeu o limite de chamadas de ferramentas."
    )
