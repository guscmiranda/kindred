# Kindred

Plataforma de descoberta de pessoas, lugares e interesses, utilizando inteligência artificial e integrações com plataformas externas para proporcionar conexões mais relevantes.

## Tecnologias

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic

### Banco de dados
- PostgreSQL
- Alembic

### Inteligência artificial
- Ollama
- Qwen3 1.7B

## Estrutura do projeto

```text
kindred/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── tools/
│   └── tests/
├── database/
│   └── migrations/
├── docs/
├── frontend/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── lib/
│       ├── services/
│       └── types/
├── docker-compose.yml
└── .env
```

## Funcionalidades implementadas

### Autenticação e usuários
- Cadastro de usuários.
- Login e logout.
- Autenticação baseada em cookies.
- Recuperação dos dados do usuário autenticado.
- Proteção de rotas que exigem autenticação.

### Perfis
- Visualização e gerenciamento do perfil.
- Informações públicas do usuário, como nome de exibição, nome de usuário e biografia.

### Interesses
- Consulta e gerenciamento dos interesses do usuário.
- Organização dos interesses por categorias.

### Lugares
- Cadastro de estabelecimentos por seus responsáveis.
- Associação automática do responsável ao estabelecimento.
- Consulta e busca de lugares.
- Filtros por nome e categoria.
- Visualização dos detalhes dos estabelecimentos.
- Edição dos lugares gerenciados pelo usuário.

### Agente de inteligência artificial
- Busca de lugares por meio de linguagem natural.
- Interpretação de características desejadas, como ambiente, atividades, música e público.
- Utilização de ferramentas (*tool calling*) para consultar os serviços existentes do backend.
- Integração com modelo local por meio do Ollama.

## Requisitos

- Git
- Python 3.11+
- Node.js 20.9+
- npm
- Docker e Docker Compose
- Ollama

## Configuração do ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/guscmiranda/kindred.git
cd kindred
```

### 2. Configurar as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto com as configurações necessárias para o backend e o banco de dados.

No frontend, crie o arquivo `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Iniciar o banco de dados

Na raiz do projeto, execute:

```bash
docker compose up -d
```

### 4. Configurar o backend

Acesse a pasta do backend:

```bash
cd backend
```

Crie e ative o ambiente virtual:

**Windows (PowerShell):**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute as migrações:

```bash
alembic -c alembic.ini upgrade head
```

Inicie o servidor:

```bash
uvicorn app.main:app --reload
```

A API estará disponível em:

- API: http://localhost:8000
- Documentação interativa: http://localhost:8000/docs

### 5. Configurar o Ollama

Instale o [Ollama](https://ollama.com/) e baixe o modelo utilizado pelo agente:

```bash
ollama pull qwen3:1.7b
```

Mantenha o Ollama em execução para que o backend consiga acessar o modelo local.

### 6. Configurar o frontend

Em outro terminal, acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em:

http://localhost:3000

## Testes e verificações

### Backend

```bash
cd backend
python -m pytest -v
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

## Status do projeto

O Kindred possui uma aplicação frontend integrada à API backend, com autenticação, perfis, interesses, gerenciamento de lugares e um agente de inteligência artificial para busca de estabelecimentos por linguagem natural.