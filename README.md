
# CRUD de Contatos (Aplicação Interna)

Este repositório é um 'monorepo' contendo tanto o backend (ASP.NET Core) quanto o frontend (React), além de infraestrutura Docker e scripts auxiliares.

Projeto interno para gerenciamento de contatos, utilizando React no frontend, ASP.NET Core no backend e SQL Server como banco de dados, com orquestração Docker.

## Arquitetura do projeto

Visao macro:

- Frontend (React + Vite + TypeScript)
- Backend (ASP.NET Core Web API)
- Banco de dados (SQL Server)
- Gateway reverso (Nginx)

## Arquitetura de software (implementada hoje): Monolito em Camadas (Layered/N-Tier)

O backend segue uma arquitetura em camadas simples, com separacao por responsabilidade:

Nome da arquitetura adotada hoje:

- Monolito em Camadas (tambem chamada de Layered Architecture ou N-Tier)
- Com organizacao modular por pastas (API, Application, Domain, Infrastructure)

1. Camada de Apresentacao/API
- Controllers HTTP (rotas, status code e contrato de entrada/saida).
- DTOs usados para transporte de dados entre API e cliente.

2. Camada de Servico (Application Service local)
- `ContatoService` concentra os casos de uso de CRUD.
- Faz o mapeamento entre entidade de dominio e DTO.
- Centraliza regras operacionais (datas de criacao/atualizacao e persistencia).

3. Camada de Dominio/Persistencia
- Entidade `Contato` representa o modelo de negocio persistido.
- `AppDbContext` (Entity Framework Core) representa a unidade de acesso ao banco.

4. Infraestrutura
- SQL Server como banco relacional.
- Docker Compose para orquestracao local.
- Nginx como entrypoint para frontend + proxy da API.

### Fluxo de requisicao (runtime)

1. Frontend chama endpoint `/api/Contatos/...`.
2. Nginx encaminha para o backend ASP.NET Core.
3. Controller recebe a requisicao e delega ao `ContatoService`.
4. `ContatoService` consulta/atualiza o `AppDbContext`.
5. EF Core persiste/lê no SQL Server.
6. A API devolve JSON com o status HTTP apropriado.

### Padrao arquitetural atual

- Estilo: Monolito modular em camadas.
- API e servico estao no mesmo processo (sem microsservicos).
- Persistencia feita via EF Core com acesso direto por `DbContext`.
- O repositorio ainda nao foi abstraido em interface propria.

## Arquitetura de pastas

```text
.
|-- back/
|   `-- Crud/
|       |-- src/
|       |   |-- API/             # Controllers, DTOs e composicao HTTP
|       |   |-- Application/     # Casos de uso e servicos de aplicacao
|       |   `-- Domain/          # Entidades, contratos e regras de dominio
|       |-- Infrastructure/
|       |   `-- docker/          # Compose, Dockerfiles e nginx do ambiente
|       |-- Program.cs           # Bootstrap da aplicacao backend
|       `-- appsettings*.json    # Configuracoes por ambiente
|-- Presetation/
|   `-- Project/
|       |-- src/
|       |   |-- components/      # Componentes reutilizaveis de UI
|       |   |-- pages/           # Paginas da aplicacao
|       |   |-- services/axios/  # Cliente HTTP para API
|       |   |-- hooks/           # Hooks customizados
|       |   `-- utils/           # Tipos e utilitarios
|       `-- package.json
|-- Documentos/
|   `-- sql/init.sql             # Script de inicializacao/exemplo
`-- README.md
```

Tecnologias principais: React, TypeScript, Vite, Material UI, ASP.NET Core, Entity Framework Core, Docker, Nginx, SQL Server.

Estrutura do repositório (resumo):
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

Atalho mental no Docker Desktop:

- `Start`: so sobe os containers
- `Build`: recria as imagens
- `Compose up --build`: builda e sobe

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

