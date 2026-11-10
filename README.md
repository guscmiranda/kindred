# Kindred

Plataforma web para descoberta de pessoas, interesses e comunidades por meio de recursos de inteligência artificial e integração com redes sociais.

## Tecnologias

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Python
- FastAPI
- Pydantic

## Estrutura do projeto

```text
kindred/
├── backend/
│   ├── app/
│   ├── tests/
│   └── requirements.txt
├── database/
│   └── migrations/
├── docs/
└── frontend/
    ├── public/
    └── src/
```

## Requisitos

- Node.js 20.9 ou superior
- npm
- Python 3.11 ou superior
- Git

## Configuração

Clone o repositório:

```bash
git clone https://github.com/guscmiranda/kindred.git
cd kindred
```

### Backend

Acesse a pasta do backend:

```powershell
cd backend
```

Crie e ative o ambiente virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Instale as dependências:

```powershell
python -m pip install -r requirements.txt
```

Inicie o servidor:

```powershell
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`.

Documentação interativa: `http://localhost:8000/docs`.

### Frontend

Em outro terminal, acesse a pasta do frontend:

```powershell
cd frontend
```

Instale as dependências:

```powershell
npm install
```

Crie o arquivo de configuração local a partir do modelo:

```powershell
Copy-Item .env.example .env.local
```

Inicie o servidor de desenvolvimento:

```powershell
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Testes

Para executar os testes do backend, acesse a pasta `backend`, ative o ambiente virtual e execute:

```powershell
python -m pytest -v
```

Para verificar o frontend:

```powershell
npm run lint
npm run build
```

## Status do desenvolvimento

Projeto em desenvolvimento. Atualmente, a fundação do frontend e do backend está implementada, incluindo a comunicação entre as duas aplicações e os testes iniciais da API.