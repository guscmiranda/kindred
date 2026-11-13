
import httpx

from app.core.config import settings


async def chat(
    messages: list[dict],
    tools: list[dict] | None = None,
) -> dict:
    """
    Envia uma conversa ao modelo configurado no Ollama.

    Opcionalmente, disponibiliza ferramentas para o modelo.
    Retorna a resposta da API em formato de dicionário.
    """

    payload = {
        "model": settings.ollama_model,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0,
        }
    }

    if tools:
        payload["tools"] = tools

    async with httpx.AsyncClient(
        timeout=settings.ollama_timeout
    ) as client:
        response = await client.post(
            f"{settings.ollama_base_url}/api/chat",
            json=payload,
        )

        response.raise_for_status()

        return response.json()
