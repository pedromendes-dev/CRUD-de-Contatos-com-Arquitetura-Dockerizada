
# CRUD de Contatos (Aplicação Interna)

Este repositório é um 'monorepo' contendo tanto o backend (ASP.NET Core) quanto o frontend (React), além de infraestrutura Docker e scripts auxiliares.

Projeto interno para gerenciamento de contatos, utilizando React no frontend, ASP.NET Core no backend e SQL Server como banco de dados, com orquestração Docker.

Arquitetura:
- Frontend (React)
- Backend (ASP.NET Core)
- Banco de dados (SQL Server)
- Gateway Nginx

Tecnologias principais: React, TypeScript, Vite, Material UI, ASP.NET Core, Entity Framework Core, Docker, Nginx, SQL Server.

Estrutura do repositório:
- back/Crud: backend
- back/Crud/Infrastructure/docker: infraestrutura Docker
- back/Crud/Infrastructure/docker/nginx/nginx.conf: configuração do Nginx
- Presetation/Project: projeto frontend React
- Documentos/sql/init.sql: script SQL de referencia com dados de exemplo

## Como executar com Docker (recomendado)

Prerequisitos:

1. Docker Desktop em execucao
2. Portas livres: 3000, 8080, 8082 e 1433

Passos:

1. Acesse o diretorio de infraestrutura:

	cd back/Crud/Infrastructure/docker

2. Suba a stack:

	docker compose up --build -d

3. Verifique status:

	docker compose ps

## Enderecos da aplicacao

- Frontend direto: http://localhost:3000
- Gateway da aplicacao: http://localhost:8082
- API pelo gateway: http://localhost:8082/api/Contatos/listartodos
- API direta (backend): http://localhost:8080/Contatos/listartodos  - exibindo o swagger
- SQL Server: localhost,1433

## Configuracao de banco de dados

Credenciais do SQL Server no Compose:

- Usuario: sa
- Senha: P@ssw0rd123!Secure
- Banco esperado: ContatosDB

Persistencia:

- O SQL Server usa volume Docker nomeado sqldata.
- Mesmo reiniciando containers, os dados permanecem enquanto o volume existir.


## Comandos uteis

Subir stack:

- docker compose up --build -d

Parar stack:

- docker compose down

Parar e remover volumes (zera banco):

- docker compose down -v

Ver logs:

- docker compose logs -f

Ver logs de um servico:

- docker compose logs -f backend
- docker compose logs -f sql
- docker compose logs -f nginx
- docker compose logs -f frontend

## Executar frontend fora do Docker (opcional)

No diretorio Presetation/Project:

- npm install
- npm run dev
- npm run typecheck
- npm run test


## Proxy
Proxy no gateway:

- / encaminha para frontend
- /api/ encaminha para backend

