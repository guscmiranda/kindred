from uuid import UUID

from sqlalchemy import ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class PlaceCategoryLink(Base):
    __tablename__ = "place_category_links"

    place_id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("places.id", ondelete="CASCADE"),
        primary_key=True,
    )

    category_id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("place_categories.id", ondelete="CASCADE"),
        primary_key=True,
    )