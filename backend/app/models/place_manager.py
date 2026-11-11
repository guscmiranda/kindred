from __future__ import annotations

from datetime import datetime
from typing import Literal, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    String,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.place import Place


class PlaceManager(Base):
    __tablename__ = "place_managers"

    __table_args__ = (
        CheckConstraint(
            "role IN ('owner', 'admin', 'editor')",
            name="ck_place_managers_role",
        ),
    )

    user_id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )

    place_id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("places.id", ondelete="CASCADE"),
        primary_key=True,
    )

    role: Mapped[Literal["owner", "admin", "editor"]] = mapped_column(
        String(20),
        nullable=False,
        default="owner",
        server_default="owner",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    user: Mapped[User] = relationship(
        back_populates="managed_places",
    )

    place: Mapped[Place] = relationship(
        back_populates="managers",
    )