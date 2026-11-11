from __future__ import annotations

from datetime import datetime
from typing import Literal, TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    String,
    Text,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.place import Place

class PlaceAttribute(Base):
    __tablename__ = "place_attributes"

    __table_args__ = (
        CheckConstraint(
            '"group" IN (\'ambience\', \'activities\', \'music\', \'audience\')',
            name="ck_place_attributes_group",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
    )

    slug: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
        unique=True,
    )

    group: Mapped[Literal["ambience", "activities", "music", "audience"]] = mapped_column(
        String(30),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    places: Mapped[list[Place]] = relationship(
        secondary="place_attribute_links",
        back_populates="attributes",
    )