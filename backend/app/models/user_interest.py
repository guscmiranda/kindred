
from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    SmallInteger,
    Uuid,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.interest import Interest
    from app.models.user import User


class UserInterest(Base):
    __tablename__ = "user_interests"

    __table_args__ = (
        CheckConstraint(
            "interest_level BETWEEN 1 AND 5",
            name="ck_user_interests_interest_level",
        ),
    )

    user_id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )

    interest_id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("interests.id", ondelete="CASCADE"),
        primary_key=True,
    )

    interest_level: Mapped[int] = mapped_column(
        SmallInteger,
        nullable=False,
    )

    is_highlighted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=text("false"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    user: Mapped[User] = relationship(
        back_populates="interest_associations",
    )

    interest: Mapped[Interest] = relationship(
        back_populates="user_associations",
    )
