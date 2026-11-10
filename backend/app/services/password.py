from argon2 import PasswordHasher
from argon2.exceptions import (
    InvalidHashError,
    VerificationError,
    VerifyMismatchError,
)


# Configuração do algoritmo Argon2id.
password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """Gera um hash seguro para a senha."""

    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Verifica se a senha corresponde ao hash armazenado."""

    try:
        return password_hasher.verify(password_hash, password)

    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False