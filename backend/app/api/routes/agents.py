import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.agents.specialized.place_agent import run_place_agent
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import User
from app.schemas.agent import PlaceSearchRequest, PlaceSearchResponse


router = APIRouter(prefix="/agents", tags=["Agents"])


@router.post(
    "/places/search",
    response_model=PlaceSearchResponse,
)
async def search_places_with_agent(
    data: PlaceSearchRequest,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    try:
        result = await run_place_agent(db, data.message)
        return PlaceSearchResponse(**result)

    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="O serviço de inteligência artificial está indisponível.",
        )

    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="O serviço de inteligência artificial retornou um erro.",
        )