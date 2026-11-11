
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.auth import router as auth_router
from app.api.routes.profiles import router as profiles_router
from app.api.routes.interests import router as interests_router
from app.api.routes.places import router as places_router

app = FastAPI(
    title="Kindred API",
    description="API da plataforma Kindred.",
    version="0.1.0"
)

# Origens autorizadas a acessar a API.
origins = [
    "http://localhost:3000",
]

app.include_router(auth_router)
app.include_router(profiles_router)
app.include_router(interests_router)
app.include_router(places_router)
# Configuração do CORS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    return {
        "name": "Kindred API",
        "message": "Welcome to Kindred!"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "ok"
    }
