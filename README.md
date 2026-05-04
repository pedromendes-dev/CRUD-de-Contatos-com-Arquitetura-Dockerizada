# CRUD de Contatos — SmartReg

Monorepo com backend ASP.NET Core, frontend React e infraestrutura Docker para gerenciamento de contatos.

---

## Nome e identidade visual — SmartReg

O nome **SmartReg** vem da combinação de dois conceitos:

- **Smart** (inteligente): vai além de um CRUD simples — centraliza dados com contagem em tempo real, cache de sessão e interface pensada em usabilidade.
- **Reg** (de *Registration* / Registro): o núcleo é o registro e gerenciamento de contatos — criar, listar, editar, remover.

### Logo

A identidade visual foi projetada no **Figma** antes de ser implementada. O ícone representa uma rede de contatos interligados: círculo externo (o sistema), nó central conectado a quatro nós (clientes), linhas de conexão (relacionamentos) e elementos nos pontos cardeais (campos de formulário).

O logo é implementado como dois componentes React reutilizáveis:

| Componente | Variante | Uso |
|---|---|---|
| `LogoExeterna.tsx` | Azul (#2563eb) / dark | Dialogs, página 404, standalone |
| `LogoInterna.tsx` | White | Sidebar (fundo escuro) |

---

## Arquitetura do projeto

### Visão macro

- Frontend — React + Vite + TypeScript
- Backend — ASP.NET Core Web API (solução multi-projeto)
- Banco de dados — SQL Server (local, fora do container)
- Gateway reverso — Nginx

### Backend: solução multi-projeto (`Server/`)

O backend evoluiu de um monolito único para uma **solução em camadas com projetos separados**, cada um com responsabilidade bem definida:

```
Server/
├── CrudContatos.Api             # Entrada HTTP: controllers, middlewares, Program.cs
├── CrudContatos.Core            # Contratos compartilhados: DTOs e IContatoService
├── CrudContatos.Domain.Entity   # Entidade de domínio: Contato
├── CrudContatos.Domain.Service  # Lógica de negócio: ContatoService, BaseService
├── CrudContatos.Infra.Data      # Persistência: AppDbContext, Entity Config, docker
└── CrudContatos.Tests           # Testes do backend (xUnit)
```

#### Camadas

| Camada | Projeto | Responsabilidade |
|---|---|---|
| API | `CrudContatos.Api` | Rotas HTTP, status codes, contrato de entrada/saída, middleware de erros |
| Contratos | `CrudContatos.Core` | DTOs e interface `IContatoService` — desacopla API do serviço |
| Domínio | `CrudContatos.Domain.Entity` + `.Domain.Service` | Entidade `Contato`, casos de uso de CRUD, mapeamento DTO ↔ entidade |
| Infra | `CrudContatos.Infra.Data` | `AppDbContext` (EF Core), configuração de entidade, docker compose |

#### ExceptionMiddleware

Middleware global de tratamento de erros em `CrudContatos.Api/Middlewares/ExceptionMiddleware.cs`. Captura exceções não tratadas e devolve JSON padronizado com `StatusCode`, `Message`, `Details` e `Timestamp`. Mapeamento:

| Exceção | HTTP |
|---|---|
| `ArgumentNullException` / `ArgumentException` | 400 |
| `KeyNotFoundException` | 404 |
| `InvalidOperationException` | 422 |
| Qualquer outra | 500 |

### Fluxo de requisição (runtime)

1. Frontend chama `/api/Contatos/...`
2. Nginx encaminha para o backend ASP.NET Core
3. Controller recebe e delega ao `ContatoService` (via `IContatoService`)
4. `ContatoService` consulta/atualiza o `AppDbContext`
5. EF Core persiste/lê no SQL Server
6. API devolve JSON com status HTTP apropriado

---

## Estrutura de pastas

```text
.
├── Server/
│   ├── CrudContatos.Api/            # Controllers, Middlewares, Program.cs
│   ├── CrudContatos.Core/           # DTOs, IContatoService
│   ├── CrudContatos.Domain.Entity/  # Entidade Contato
│   ├── CrudContatos.Domain.Service/ # ContatoService, BaseService, Interfaces
│   ├── CrudContatos.Infra.Data/     # Context, EntityConfig, docker/
│   ├── CrudContatos.Tests/          # Testes do backend
│   └── CrudContatos.slnx
├── Presetation/
│   └── Project/
│       ├── __tests__/unitarios/     # Testes unitários do frontend (Vitest)
│       └── src/
│           ├── components/          # Componentes reutilizáveis de UI
│           ├── pages/               # Páginas da aplicação
│           ├── services/axios/      # Cliente HTTP para a API
│           ├── hooks/               # Hooks customizados
│           └── utils/               # Tipos e utilitários
├── Documentos/sql/init.sql          # Script SQL de referência com dados de exemplo
├── render.yaml                      # Configuração de deploy (Render.com — comentado)
└── README.md
```

---

## Páginas do frontend

| Página | Rota | Descrição |
|---|---|---|
| `HomePage` | `/home` | Boas-vindas, total de contatos e acesso rápido à lista |
| `ContatosPage` | `/contatos` | Tabela interativa com filtro, criação, edição e remoção |
| `AnalyticsPage` | `/analytics` | Painel de análises — **em construção** |
| `NotFoundPage` | `*` | Página 404 |

Todas as rotas usam `React.lazy` + `Suspense` para carregamento sob demanda.

---

## Testes

### Frontend (Vitest)

Localizados em `Presetation/Project/__tests__/unitarios/`:

| Arquivo | O que testa |
|---|---|
| `contatoMapper.test.ts` | Função `mapContato` — mapeamento PascalCase (backend) → camelCase (frontend), prioridade de campos, campos ausentes e nulos |
| `contatoService.test.ts` | Serviço Axios (`contatosAxios`) — todos os endpoints (`GET`, `POST`, `PUT`, `DELETE`), `API_URL`, propagação de erros de rede |
| `utils.test.ts` | Utilitários compartilhados |

Executar:

```bash
npm run test          # roda uma vez
npm run test:watch    # modo watch
```

### Backend (xUnit)

Localizados em `Server/CrudContatos.Tests/`:

| Arquivo | O que testa |
|---|---|
| `ContatosControllerTests.cs` | Endpoints do `ContatoController` |
| `ExceptionMiddlewareTests.cs` | Comportamento do `ExceptionMiddleware` para cada tipo de exceção |

Executar:

```bash
dotnet test
```

---

## Como executar com Docker (recomendado)

**Pré-requisitos:**

1. Docker Desktop em execução
2. Portas livres: 3000, 8080, 8082 e 1433

**Passos:**

```bash
cd Server/CrudContatos.Infra.Data/docker
docker compose up --build -d
docker compose ps
```

---

## Endereços da aplicação

| Serviço | URL |
|---|---|
| Frontend direto | http://localhost:3000 |
| Gateway (Nginx) | http://localhost:8082 |
| API pelo gateway | http://localhost:8082/api/Contatos/BuscarTodos |
| API direta + Swagger | http://localhost:8080 |
| SQL Server | localhost,1433 |

---

## Configuração do banco de dados

O banco **não roda em container** — o backend conecta ao SQL Server instalado localmente.

Credenciais (`appsettings.Docker.json`):

- Servidor: `host.docker.internal,1433`
- Usuário: `sa`
- Senha: `root`
- Banco: `ContatosDB`

Pré-requisitos no SQL Server local:
- Autenticação mista (SQL Server + Windows) habilitada
- Usuário `sa` habilitado com a senha configurada
- Porta 1433 acessível

---

## Credenciais de teste (Login)

Todos os usuários na tabela `[user].[usuario]` podem fazer login. Credenciais padrão inseridas pelo `init.sql`:

| Email | Senha | Tipo |
|---|---|---|
| `admin@smartreg.com` | `senha123` | Administrador (também em `[admin].[administrador]`) |
| `pedro@exemplo.com` | `senha123` | Usuário regular |

Autenticação:
- POST `/Auth/Login` — recebe `{ email, senha }` e retorna JWT
- Token válido por 8 horas (configurável em `appsettings.json` → `Jwt.ExpiresInHours`)
- Senhas armazenadas com hash BCrypt — nunca em texto plano

---

## Comandos Docker úteis

```bash
docker compose up --build -d      # build e sobe
docker compose down               # para
docker compose down -v            # para e remove volumes (zera banco)
docker compose logs -f            # logs de todos os serviços
docker compose logs -f backend    # logs só do backend
docker compose logs -f frontend   # logs só do frontend
docker compose logs -f nginx      # logs só do nginx
```

---

## Executar frontend fora do Docker

```bash
cd Presetation/Project
npm install
npm run dev
npm run typecheck
npm run test
```

---

## Proxy (Nginx)

| Prefixo | Destino |
|---|---|
| `/` | Frontend |
| `/api/` | Backend |

---

## Qualidade de código — Oxlint + Oxfmt

O projeto usa **oxc** no lugar de ESLint + Prettier (escritos em Rust — drasticamente mais rápidos):

| Etapa | ESLint + Prettier | Oxlint + Oxfmt | Ganho |
|---|---|---|---|
| Lint | ~10.6s | ~347ms | 30× |
| Format | ~1.76s | ~396ms | 4.4× |
| Pipeline total | ~12.4s | ~743ms | 17× |

```bash
npm run lint           # lint de todos os arquivos em src/
npm run lint:fix       # lint com correção automática
npm run format         # formata todos os arquivos em src/
npm run format:check   # verifica formatação sem alterar
npm run check          # pipeline completo: lint + typecheck + format:check
```

---

## Tecnologias principais

**Frontend:** React 18, TypeScript, Vite, Material UI, React Router, Axios, Vitest

**Backend:** ASP.NET Core 8, Entity Framework Core, C# 12

**Infra:** Docker, Docker Compose, Nginx, SQL Server
