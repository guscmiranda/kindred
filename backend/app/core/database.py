from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


# Classe-base para os modelos do banco.
class Base(DeclarativeBase):
    pass


# Mecanismo de conexão com o PostgreSQL.
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
)


# Fábrica de sessões do banco.
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


# Dependência para disponibilizar sessões nas rotas da API.
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()