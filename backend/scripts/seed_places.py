
from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import PlaceAttribute, PlaceCategory


CATEGORIES = {
    "restaurantes": {
        "name": "Restaurantes",
        "description": "Estabelecimentos especializados em refeições.",
    },
    "bares": {
        "name": "Bares",
        "description": "Estabelecimentos voltados a bebidas, convivência e socialização.",
    },
    "cafes": {
        "name": "Cafés",
        "description": "Cafeterias e estabelecimentos especializados em cafés e acompanhamentos.",
    },
    "parques": {
        "name": "Parques",
        "description": "Espaços públicos ou privados de lazer e contato com a natureza.",
    },
    "museus": {
        "name": "Museus",
        "description": "Espaços dedicados à preservação e exposição cultural e histórica.",
    },
    "cinemas": {
        "name": "Cinemas",
        "description": "Estabelecimentos destinados à exibição de filmes.",
    },
    "livrarias": {
        "name": "Livrarias",
        "description": "Estabelecimentos dedicados à venda de livros e publicações.",
    },
    "casas-de-shows": {
        "name": "Casas de shows",
        "description": "Espaços destinados a apresentações musicais e eventos artísticos.",
    },
}


ATTRIBUTES = {
    # Ambiente
    "tranquilo": {
        "name": "Tranquilo",
        "group": "ambience",
        "description": "Ambiente calmo, com pouco ruído e movimentação.",
    },
    "movimentado": {
        "name": "Movimentado",
        "group": "ambience",
        "description": "Ambiente com grande circulação de pessoas.",
    },
    "aconchegante": {
        "name": "Aconchegante",
        "group": "ambience",
        "description": "Ambiente confortável e acolhedor.",
    },
    "ao-ar-livre": {
        "name": "Ao ar livre",
        "group": "ambience",
        "description": "Espaço com áreas abertas e contato com o ambiente externo.",
    },
    "intimista": {
        "name": "Intimista",
        "group": "ambience",
        "description": "Ambiente reservado e com atmosfera mais pessoal.",
    },

    # Atividades
    "conversar": {
        "name": "Conversar",
        "group": "activities",
        "description": "Ambiente adequado para conversas e interação social.",
    },
    "conhecer-pessoas": {
        "name": "Conhecer pessoas",
        "group": "activities",
        "description": "Espaço favorável à socialização e a novas conexões.",
    },
    "estudar": {
        "name": "Estudar",
        "group": "activities",
        "description": "Espaço adequado para estudos e concentração.",
    },
    "trabalhar": {
        "name": "Trabalhar",
        "group": "activities",
        "description": "Espaço adequado para trabalho individual ou remoto.",
    },
    "dancar": {
        "name": "Dançar",
        "group": "activities",
        "description": "Espaço que permite atividades de dança.",
    },
    "praticar-esportes": {
        "name": "Praticar esportes",
        "group": "activities",
        "description": "Espaço destinado à prática de atividades esportivas.",
    },

    # Música
    "alternativa": {
        "name": "Alternativa",
        "group": "music",
        "description": "Música de estilos alternativos e independentes.",
    },
    "rock": {
        "name": "Rock",
        "group": "music",
        "description": "Música dos diferentes estilos de rock.",
    },
    "pop": {
        "name": "Pop",
        "group": "music",
        "description": "Música popular e seus diferentes estilos.",
    },
    "eletronica": {
        "name": "Eletrônica",
        "group": "music",
        "description": "Música eletrônica e suas vertentes.",
    },
    "sertanejo": {
        "name": "Sertanejo",
        "group": "music",
        "description": "Música sertaneja e suas vertentes.",
    },
    "jazz": {
        "name": "Jazz",
        "group": "music",
        "description": "Música e estilos relacionados ao jazz.",
    },
    "musica-ao-vivo": {
        "name": "Música ao vivo",
        "group": "music",
        "description": "Apresentações musicais realizadas no próprio estabelecimento.",
    },

    # Público
    "universitario": {
        "name": "Universitário",
        "group": "audience",
        "description": "Frequentado principalmente por estudantes universitários.",
    },
    "familiar": {
        "name": "Familiar",
        "group": "audience",
        "description": "Adequado para frequentadores de diferentes faixas etárias e famílias.",
    },
    "jovem": {
        "name": "Jovem",
        "group": "audience",
        "description": "Frequentado principalmente por um público jovem.",
    },
    "diverso": {
        "name": "Diverso",
        "group": "audience",
        "description": "Frequentado por pessoas com diferentes perfis e interesses.",
    },
    "adulto": {
        "name": "Adulto",
        "group": "audience",
        "description": "Voltado principalmente ao público adulto.",
    },
}


def seed_places():
    with SessionLocal() as db:
        with db.begin():
            categories = {
                category.slug: category
                for category in db.scalars(
                    select(PlaceCategory)
                ).all()
            }

            # Cria somente as categorias que ainda não existem.
            for slug, data in CATEGORIES.items():
                if slug not in categories:
                    category = PlaceCategory(
                        slug=slug,
                        name=data["name"],
                        description=data["description"],
                    )
                    db.add(category)
                    categories[slug] = category

            attributes = {
                attribute.slug: attribute
                for attribute in db.scalars(
                    select(PlaceAttribute)
                ).all()
            }

            # Cria somente as características que ainda não existem.
            for slug, data in ATTRIBUTES.items():
                if slug not in attributes:
                    attribute = PlaceAttribute(
                        slug=slug,
                        name=data["name"],
                        group=data["group"],
                        description=data["description"],
                    )
                    db.add(attribute)
                    attributes[slug] = attribute

        print(f"Categorias cadastradas: {len(categories)}")
        print(f"Características cadastradas: {len(attributes)}")


if __name__ == "__main__":
    seed_places()
