# CRUD de Contatos com Arquitetura Dockerizada

Aplicação full stack para gerenciamento de contatos com operações de CRUD (Create, Read, Update, Delete), utilizando React com Tailwind no front-end, ASP.NET Core com Entity Framework no back-end, SQL Server como banco de dados e Docker para orquestração dos serviços.

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Front-end | React + Vite + Tailwind CSS |
| Back-end | ASP.NET Core 8 Web API |
| ORM | Entity Framework Core |
| Banco de dados | SQL Server 2022 |
| Orquestração | Docker + Docker Compose |

## Estrutura do Projeto

```
.
├── backend/          # ASP.NET Core Web API
│   ├── Controllers/  # ContactsController (CRUD)
│   ├── Data/         # ApplicationDbContext
│   ├── Migrations/   # EF Core migrations
│   ├── Models/       # Contact model
│   ├── Dockerfile
│   └── ...
├── frontend/         # React + Tailwind CSS
│   ├── src/
│   │   ├── App.jsx   # Interface principal
│   │   └── api.js    # Serviço de comunicação com a API
│   ├── nginx.conf
│   ├── Dockerfile
│   └── ...
└── docker-compose.yml
```

## Como Executar

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Iniciar a aplicação

```bash
docker compose up --build
```

Aguarde todos os serviços iniciarem (o banco de dados pode levar cerca de 30 segundos na primeira execução).

### Acessar a aplicação

| Serviço | URL |
|---------|-----|
| Front-end | http://localhost:3000 |
| API (Swagger) | http://localhost:5000/swagger |
| SQL Server | localhost:1433 |

## Desenvolvimento Local

### Back-end

```bash
cd backend
dotnet run
# API disponível em http://localhost:5000
```

### Front-end

```bash
cd frontend
npm install
npm run dev
# App disponível em http://localhost:5173
```

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/contacts | Lista todos os contatos |
| GET | /api/contacts/{id} | Retorna um contato |
| POST | /api/contacts | Cria um novo contato |
| PUT | /api/contacts/{id} | Atualiza um contato |
| DELETE | /api/contacts/{id} | Remove um contato |

### Exemplo de payload

```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "(11) 99999-9999",
  "address": "Rua das Flores, 123, São Paulo"
}
```