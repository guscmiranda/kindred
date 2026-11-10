
from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, SecretStr

from app.models.user import User


class RegisterRequest(BaseModel):
    """Dados necessários para cadastrar um usuário."""

    email: EmailStr
    password: SecretStr = Field(min_length=8, max_length=128)
    date_of_birth: date

    username: str = Field(min_length=3, max_length=50)
    display_name: str = Field(min_length=1, max_length=100)
    bio: str | None = None


class RegisterResponse(BaseModel):
    """Dados públicos retornados após o cadastro."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    username: str
    display_name: str
    bio: str | None


class LoginRequest(BaseModel):
    """Dados necessários para autenticar um usuário."""

    email: EmailStr
    password: SecretStr = Field(min_length=1, max_length=128)

class LoginResponse(BaseModel):
    """Dados retornados após uma autenticação bem-sucedida."""

    access_token: str
    token_type: str = "bearer"