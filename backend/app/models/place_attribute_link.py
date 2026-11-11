from uuid import UUID

from sqlalchemy import ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class PlaceAttributeLink(Base):
    __tablename__ = "place_attribute_links"

    place_id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("places.id", ondelete="CASCADE"),
        primary_key=True,
    )

    attribute_id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("place_attributes.id", ondelete="CASCADE"),
        primary_key=True,
    )