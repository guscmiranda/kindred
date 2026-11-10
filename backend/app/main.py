
from fastapi import FastAPI

app = FastAPI(
    title="Kindred API",
    description="API da plataforma Kindred.",
    version="0.1.0"
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
