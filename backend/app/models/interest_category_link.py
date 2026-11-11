
from sqlalchemy import Column, ForeignKey, Table

from app.models.base import Base


interest_category_links = Table(
    "interest_category_links",
    Base.metadata,

    Column(
        "interest_id",
        ForeignKey("interests.id", ondelete="CASCADE"),
        primary_key=True,
    ),

    Column(
        "category_id",
        ForeignKey("interest_categories.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)
