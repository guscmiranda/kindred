
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Profile, User
from app.schemas.auth import RegisterRequest
from app.services.password import hash_password
from app.services.password import verify_password

class EmailAlreadyExists(Exception):
    """Indica que o e-mail já está cadastrado."""


class UsernameAlreadyExists(Exception):
    """Indica que o username já está cadastrado."""


def register_user(
    db: Session,
    data: RegisterRequest,
) -> tuple[User, Profile]:
    """Cadastra um usuário e seu perfil em uma única transação."""

    user = User(
        email=str(data.email),
        password_hash=hash_password(data.password.get_secret_value()),
        date_of_birth=data.date_of_birth,
    )

    try:
        db.add(user)
        db.flush()

        profile = Profile(
            user_id=user.id,
            username=data.username,
            display_name=data.display_name,
            bio=data.bio,
        )

        db.add(profile)
        db.commit()

        db.refresh(user)
        db.refresh(profile)

        return user, profile

    except IntegrityError as error:
        db.rollback()

        # Identifica qual constraint de unicidade foi violada.
        diagnostic = getattr(error.orig, "diag", None)
        constraint = getattr(diagnostic, "constraint_name", None)

        if constraint == "users_email_key":
            raise EmailAlreadyExists from error

        if constraint == "profiles_username_key":
            raise UsernameAlreadyExists from error

        raise




class InvalidCredentials(Exception):
    """Indica que as credenciais informadas são inválidas."""


def login_user(
    db: Session,
    email: str,
    password: str,
) -> User:
    """Autentica um usuário utilizando e-mail e senha."""

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None or not user.is_active:
        raise InvalidCredentials

    if not verify_password(password, user.password_hash):
        raise InvalidCredentials

    return user