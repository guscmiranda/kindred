
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import SessionLocal
from app.models import Interest, InterestCategory


CATEGORIES = {
    "tecnologia": {
        "name": "Tecnologia",
        "description": "Tecnologias, inovação e computação.",
    },
    "arte-cultura": {
        "name": "Arte e cultura",
        "description": "Expressões artísticas, conhecimento e cultura.",
    },
    "musica": {
        "name": "Música",
        "description": "Estilos musicais e atividades relacionadas à música.",
    },
    "jogos": {
        "name": "Jogos",
        "description": "Jogos digitais, analógicos e competitivos.",
    },
    "esportes": {
        "name": "Esportes",
        "description": "Atividades esportivas e físicas.",
    },
    "gastronomia": {
        "name": "Gastronomia",
        "description": "Culinária, alimentos e bebidas.",
    },
    "natureza-viagens": {
        "name": "Natureza e viagens",
        "description": "Atividades ao ar livre, natureza e turismo.",
    },
}


# Cada interesse possui um único registro, mesmo quando
# está associado a mais de uma categoria.
INTERESTS = {
    "programacao": {
        "name": "Programação",
        "description": "Desenvolvimento de software e programação.",
        "categories": ["tecnologia"],
    },
    "inteligencia-artificial": {
        "name": "Inteligência Artificial",
        "description": "Estudo e aplicação de sistemas inteligentes.",
        "categories": ["tecnologia"],
    },
    "robotica": {
        "name": "Robótica",
        "description": "Construção e programação de robôs.",
        "categories": ["tecnologia"],
    },
    "ciberseguranca": {
        "name": "Cibersegurança",
        "description": "Proteção de sistemas e informações digitais.",
        "categories": ["tecnologia"],
    },
    "desenvolvimento-de-jogos": {
        "name": "Desenvolvimento de jogos",
        "description": "Criação e programação de jogos.",
        "categories": ["tecnologia", "jogos"],
    },
    "fotografia": {
        "name": "Fotografia",
        "description": "Captura e composição de imagens.",
        "categories": [
            "arte-cultura",
            "tecnologia",
            "natureza-viagens",
        ],
    },
    "cinema": {
        "name": "Cinema",
        "description": "Filmes, produções cinematográficas e audiovisual.",
        "categories": ["arte-cultura"],
    },
    "literatura": {
        "name": "Literatura",
        "description": "Livros, leitura e escrita literária.",
        "categories": ["arte-cultura"],
    },
    "desenho": {
        "name": "Desenho",
        "description": "Desenho artístico e ilustração.",
        "categories": ["arte-cultura"],
    },
    "pintura": {
        "name": "Pintura",
        "description": "Pintura artística e técnicas de expressão visual.",
        "categories": ["arte-cultura"],
    },
    "historia": {
        "name": "História",
        "description": "Estudo de acontecimentos e sociedades.",
        "categories": ["arte-cultura"],
    },
    "rock": {
        "name": "Rock",
        "description": "Música e cultura do rock.",
        "categories": ["musica"],
    },
    "jazz": {
        "name": "Jazz",
        "description": "Música e cultura do jazz.",
        "categories": ["musica"],
    },
    "musica-eletronica": {
        "name": "Música eletrônica",
        "description": "Estilos e produções de música eletrônica.",
        "categories": ["musica", "tecnologia"],
    },
    "producao-musical": {
        "name": "Produção musical",
        "description": "Gravação, edição e produção de músicas.",
        "categories": ["musica", "tecnologia"],
    },
    "canto": {
        "name": "Canto",
        "description": "Técnicas vocais e expressão musical.",
        "categories": ["musica"],
    },
    "instrumentos-musicais": {
        "name": "Instrumentos musicais",
        "description": "Prática e estudo de instrumentos musicais.",
        "categories": ["musica"],
    },
    "jogos-digitais": {
        "name": "Jogos digitais",
        "description": "Jogos eletrônicos em diferentes plataformas.",
        "categories": ["jogos"],
    },
    "jogos-de-tabuleiro": {
        "name": "Jogos de tabuleiro",
        "description": "Jogos analógicos de estratégia e interação.",
        "categories": ["jogos"],
    },
    "rpg": {
        "name": "RPG",
        "description": "Jogos de interpretação de personagens.",
        "categories": ["jogos", "arte-cultura"],
    },
    "esports": {
        "name": "E-sports",
        "description": "Competições organizadas de jogos digitais.",
        "categories": ["jogos"],
    },
    "jogos-de-cartas": {
        "name": "Jogos de cartas",
        "description": "Jogos recreativos e estratégicos com cartas.",
        "categories": ["jogos"],
    },
    "futebol": {
        "name": "Futebol",
        "description": "Prática e acompanhamento do futebol.",
        "categories": ["esportes"],
    },
    "corrida": {
        "name": "Corrida",
        "description": "Corrida de rua e outras modalidades.",
        "categories": ["esportes"],
    },
    "musculacao": {
        "name": "Musculação",
        "description": "Treinamento de força e condicionamento físico.",
        "categories": ["esportes"],
    },
    "ciclismo": {
        "name": "Ciclismo",
        "description": "Prática esportiva e recreativa de bicicleta.",
        "categories": ["esportes", "natureza-viagens"],
    },
    "escalada": {
        "name": "Escalada",
        "description": "Escalada esportiva e atividades em rocha.",
        "categories": ["esportes", "natureza-viagens"],
    },
    "culinaria": {
        "name": "Culinária",
        "description": "Preparação de pratos e técnicas culinárias.",
        "categories": ["gastronomia", "arte-cultura"],
    },
    "confeitaria": {
        "name": "Confeitaria",
        "description": "Preparação de doces, bolos e sobremesas.",
        "categories": ["gastronomia"],
    },
    "cafes-especiais": {
        "name": "Cafés especiais",
        "description": "Métodos de preparo e apreciação de cafés.",
        "categories": ["gastronomia"],
    },
    "panificacao": {
        "name": "Panificação",
        "description": "Preparação artesanal de pães.",
        "categories": ["gastronomia"],
    },
    "gastronomia-vegetariana": {
        "name": "Gastronomia vegetariana",
        "description": "Preparação de alimentos sem carne.",
        "categories": ["gastronomia"],
    },
    "trilhas": {
        "name": "Trilhas",
        "description": "Caminhadas e exploração de trilhas naturais.",
        "categories": ["natureza-viagens"],
    },
    "camping": {
        "name": "Camping",
        "description": "Acampamentos e atividades ao ar livre.",
        "categories": ["natureza-viagens"],
    },
    "ecoturismo": {
        "name": "Ecoturismo",
        "description": "Turismo em ambientes naturais.",
        "categories": ["natureza-viagens"],
    },
    "observacao-de-aves": {
        "name": "Observação de aves",
        "description": "Observação e identificação de aves na natureza.",
        "categories": ["natureza-viagens"],
    },
}


def seed_interests():
    with SessionLocal() as db:
        with db.begin():
            categories = {
                category.slug: category
                for category in db.scalars(
                    select(InterestCategory)
                ).all()
            }

            # Cria somente as categorias que ainda não existem.
            for slug, data in CATEGORIES.items():
                if slug not in categories:
                    category = InterestCategory(
                        slug=slug,
                        name=data["name"],
                        description=data["description"],
                    )
                    db.add(category)
                    categories[slug] = category

            db.flush()

            interests = {
                interest.slug: interest
                for interest in db.scalars(
                    select(Interest).options(
                        selectinload(Interest.categories)
                    )
                ).all()
            }

            # Cria os interesses e suas associações.
            for slug, data in INTERESTS.items():
                if slug not in interests:
                    interest = Interest(
                        slug=slug,
                        name=data["name"],
                        description=data["description"],
                    )
                    db.add(interest)
                    interests[slug] = interest

                interest = interests[slug]

                for category_slug in data["categories"]:
                    category = categories[category_slug]

                    if category not in interest.categories:
                        interest.categories.append(category)

        print(f"Categorias cadastradas: {len(categories)}")
        print(f"Interesses cadastrados: {len(interests)}")


if __name__ == "__main__":
    seed_interests()
