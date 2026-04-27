# CRUD de Contatos (Aplicação Interna)

Este repositório é um 'monorepo' contendo tanto o backend (ASP.NET Core) quanto o frontend (React), além de infraestrutura Docker e scripts auxiliares.

Projeto interno para gerenciamento de contatos, utilizando React no frontend, ASP.NET Core no backend e SQL Server como banco de dados, com orquestração Docker.

## Nome e identidade visual — SmartReg

### Por que SmartReg?

O nome **SmartReg** surgiu da combinação de dois conceitos que descrevem exatamente o que o sistema faz:

- **Smart** (inteligente): o sistema vai alem de um simples cadastro — organiza, centraliza e exibe os dados de clientes de forma clara, com contagem em tempo real, cache de sessao e uma interface pensada em usabilidade e produtividade.
- **Reg** (de *Registration* / Registro): o nucleo da aplicacao e o registro e gerenciamento de contatos/clientes — criar, listar, editar e remover.

Juntos formam **SmartReg**: um sistema inteligente de registro de clientes. O subtitulo "Sistema Inteligente" reforça essa proposta — nao e so um CRUD, e uma ferramenta de gestao.

### Identidade visual e logo

A identidade visual foi projetada no **Figma** (Figma Make) antes de ser implementada no codigo.

O logo do SmartReg e composto por:

- Um **circulo externo** representando o sistema como um todo — o ambiente que envolve e conecta os clientes.
- Um **no central** conectado a quatro nos nos cantos — cada no representa um cliente ou contato cadastrado.
- **Linhas de conexao** entre os nos — representam o relacionamento e a rede de clientes gerenciados pelo sistema.
- **Elementos nos pontos cardeais** (pequenos retangulos) — simbolizam campos de formulario e dados estruturados, referenciando o cadastro.

Esse icone comunica de forma visual a ideia de uma rede de clientes interligados e gerenciados por um sistema central — exatamente o que o SmartReg faz.

O logo foi implementado como componente React reutilizavel (`Logo.tsx`) com tres variantes:

- `default` — azul (#2563eb), usado na pagina 404 e standalone
- `white` — branco, usado na sidebar (fundo escuro)
- `dark` — cinza escuro, usado na home (fundo claro)

O processo foi: design no Figma → exportacao do conceito → implementacao em SVG puro dentro do componente React → integracao em todas as paginas do sistema.

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

O banco de dados **nao roda em container** — o backend conecta ao SQL Server instalado localmente na maquina host.

Credenciais esperadas (appsettings.Docker.json):

- Servidor: host.docker.internal,1433
- Usuario: sa
- Senha: root
- Banco esperado: ContatosDB

Pre-requisitos no SQL Server local:

- Modo de autenticacao: SQL Server e Windows (Mixed Mode)
- Usuario sa habilitado com a senha configurada acima
- Porta 1433 acessivel


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
- docker compose logs -f frontend
- docker compose logs -f nginx

## Executar frontend fora do Docker (opcional)

No diretorio Presetation/Project:

- npm install
- npm run dev
- npm run typecheck
- npm run test

## Qualidade de codigo — Oxlint + Oxfmt (substituindo ESLint + Prettier)

O projeto adotou o ecossistema **oxc** no lugar do ESLint e Prettier.

### Por que a troca?

ESLint e Prettier sao as ferramentas tradicionais de lint e formatacao em projetos JavaScript/TypeScript, mas apresentam custo alto em projetos maiores:

- Pipeline completo (lint + format): ~12 segundos em projetos de ~300 arquivos
- Pre-commit hooks lentos quebram o fluxo de desenvolvimento
- CI demorado aumenta o tempo de feedback

**Oxlint** e **Oxfmt** sao escritos em Rust (parte do projeto oxc), o que os torna dramaticamente mais rapidos:

| Etapa          | ESLint + Prettier | Oxlint + Oxfmt | Ganho     |
|----------------|-------------------|----------------|-----------|
| Lint           | ~10.6s            | ~347ms         | 30x mais rapido |
| Format         | ~1.76s            | ~396ms         | 4.4x mais rapido |
| Pipeline total | ~12.4s            | ~743ms         | 17x mais rapido |

### Beneficios praticos

- Feedback do editor instantaneo
- Pre-commit hooks que nao travam o fluxo
- CI de lint em menos de 1 segundo

### O que cobre

Oxlint ja suporta as regras mais importantes: React Hooks, import sorting, padroes unicorn, naming conventions basicas. O ecossistema ainda e menor que o do ESLint, mas a velocidade de evolucao do projeto oxc e alta e os gaps estao diminuindo rapidamente.

### Comandos disponiveis

```bash
npm run lint           # lint de todos os arquivos em src/
npm run lint:fix       # lint com correcao automatica
npm run format         # formata todos os arquivos em src/
npm run format:check   # verifica formatacao sem alterar
npm run check          # pipeline completo: lint + typecheck + format:check
```


## Proxy
Proxy no gateway:

- / encaminha para frontend
- /api/ encaminha para backend

## Componentes do Frontend

### Páginas

- **HomePage**
  - Página inicial do sistema. Exibe mensagem de boas-vindas, quantidade total de contatos cadastrados e um botão para acessar a lista de contatos.

- **ContatosPage**
  - Página de gerenciamento de contatos. Mostra a tabela de contatos cadastrados e integra o menu lateral (Sidebar) para navegação.

### Componentes

- **ContatosTable**
  - Tabela interativa para listar, editar e remover contatos. Permite ações como adicionar, editar e excluir contatos diretamente na tabela.

- **ContatoForm**
  - Formulário para criação de um novo contato. Utilizado para inserir nome, e-mail e telefone de um contato.

- **Sidebar**
  - Menu lateral de navegação entre as páginas principais do sistema (Início e Contatos). Pode ser aberto ou fechado pelo usuário.

- **Button**
  - Componente de botão customizado, baseado no Material UI, utilizado para padronizar botões na aplicação.

### Sobre os componentes visuais (UI)

- Componentes importados de `@mui/material` são componentes prontos da biblioteca Material UI, amplamente utilizados para acelerar o desenvolvimento com design consistente e responsivo.
- Componentes do diretório `../ui` (como o Button customizado) são componentes próprios do projeto, criados para padronizar e facilitar a reutilização. Eles podem reaproveitar componentes do MUI por baixo, mas permitem customização e centralização de estilos e comportamentos específicos do sistema.

> Esta abordagem permite flexibilidade: você pode usar componentes prontos do MUI quando quiser rapidez e consistência, e pode criar componentes próprios para abstrair, customizar ou padronizar elementos visuais conforme a necessidade do projeto.

---

### Componentes MUI utilizados no projeto

Abaixo estao todos os componentes do Material UI (`@mui/material`) presentes no codigo, organizados por categoria, com uma explicacao do que cada um faz e onde e usado.

#### Layout e estrutura

| Componente | O que faz | Onde e usado |
|---|---|---|
| `Box` | Container generico com suporte total ao sistema `sx` do MUI. Equivalente a uma `div` com superpoderes — aceita qualquer propriedade CSS diretamente via prop `sx`. | Em praticamente todos os componentes para criar layouts, espaçamentos e wrappers |
| `Container` | Centraliza o conteudo horizontalmente e aplica largura maxima (`maxWidth`). Evita que o conteudo fique colado nas bordas em telas grandes. | `HomePage`, `ContatosPage` |
| `Stack` | Layout em coluna ou linha com espacamento (`gap`) entre filhos. Alternativa mais simples ao `Box` com `display: flex`. | `ContatoForm`, `ContatosTable` |

#### Superficie e elevacao

| Componente | O que faz | Onde e usado |
|---|---|---|
| `Paper` | Superficie elevada com sombra e borda arredondada. Usada para criar cards, formularios e areas de conteudo destacadas do fundo. | `HomePage`, `ContatosPage`, `NotFoundPage` |

#### Tipografia

| Componente | O que faz | Onde e usado |
|---|---|---|
| `Typography` | Renderiza texto com variantes semanticas: `h1`–`h6`, `body1`, `body2`, `overline`, `caption`, `subtitle1`. Garante consistencia de fonte, peso e tamanho em todo o projeto. | Em todas as paginas e componentes |

#### Formularios e entradas

| Componente | O que faz | Onde e usado |
|---|---|---|
| `TextField` | Campo de texto com label flutuante, bordas e estados (erro, foco, desabilitado). O componente de input mais completo do MUI. | `ContatoForm` |
| `Select` | Dropdown de selecao. Precisa ser usado dentro de `FormControl` para funcionar corretamente com label. | `ContatosTable` (filtro de campo) |
| `FormControl` | Wrapper que agrupa `InputLabel` + `Select` (ou outros inputs), gerenciando o estado visual entre eles (foco, erro, preenchido). | `ContatosTable` |
| `InputLabel` | Label flutuante para `Select` e outros inputs dentro de `FormControl`. Sobe visualmente quando o campo esta preenchido ou em foco. | `ContatosTable` |
| `MenuItem` | Item clicavel dentro de um `Select` ou menu. Equivalente ao `<option>` do HTML nativo, mas com suporte a icones e estilos. | `ContatosTable` |

#### Tabela de dados

| Componente | O que faz | Onde e usado |
|---|---|---|
| `Table` | Container semantico da tabela. Equivale ao `<table>` HTML mas integrado ao tema MUI. | `ContatosTable` |
| `TableHead` | Secao de cabecalho da tabela (`<thead>`). | `ContatosTable` |
| `TableBody` | Secao de dados da tabela (`<tbody>`). | `ContatosTable` |
| `TableRow` | Linha da tabela (`<tr>`). | `ContatosTable` |
| `TableCell` | Celula da tabela (`<td>` ou `<th>`). Aceita `align`, `padding` e estilos via `sx`. | `ContatosTable` |
| `TableContainer` | Wrapper com scroll horizontal automatico para tabelas que ultrapassam a largura da tela. | `ContatosTable` |

#### Dialogs e overlays

| Componente | O que faz | Onde e usado |
|---|---|---|
| `Dialog` | Modal com backdrop. Bloqueia a interacao com o restante da tela enquanto aberto. | `ContatosTable` (confirmacao de exclusao e formulario de edicao) |
| `DialogTitle` | Area de titulo dentro do `Dialog`, com tipografia e padding padronizados. | `ContatosTable` |
| `DialogContent` | Area de conteudo do `Dialog`. Tem scroll automatico se o conteudo for maior que a tela. | `ContatosTable` |
| `DialogActions` | Area de botoes no rodape do `Dialog`, com alinhamento automatico a direita. | `ContatosTable` |

#### Navegacao e listas

| Componente | O que faz | Onde e usado |
|---|---|---|
| `List` | Container vertical para itens de lista. Gerencia espacamento e divisores entre os filhos. | `Sidebar` |
| `ListItem` | Item dentro de um `List`. Suporta `component={Link}` para funcionar como link de navegacao. | `Sidebar` |
| `ListItemIcon` | Slot de icone a esquerda do `ListItem`, com alinhamento e cor automaticos. | `Sidebar` |
| `ListItemText` | Slot de texto no `ListItem` com suporte a texto primario e secundario. | `Sidebar` |
| `Divider` | Linha separadora horizontal (ou vertical). Usada para dividir secoes visuais. | `Sidebar` |

#### Botoes e acoes

| Componente | O que faz | Onde e usado |
|---|---|---|
| `Button` | Botao clicavel com variantes `contained`, `outlined` e `text`. O mais usado para acoes principais. | `HomePage`, `NotFoundPage`, `ContatosTable`, `ContatoForm` |
| `IconButton` | Botao circular que exibe apenas um icone, sem texto. Ideal para acoes compactas como editar, deletar e toggle. | `Sidebar` (toggle), `ContatosTable` (editar/excluir) |

#### Feedback e animacao

| Componente | O que faz | Onde e usado |
|---|---|---|
| `Alert` | Mensagem de feedback com quatro severidades: `success`, `error`, `warning`, `info`. Com icone e cor automaticos. | Componente `alert.tsx` (wrapper customizado) |
| `CircularProgress` | Spinner de carregamento circular. Indica que uma operacao assincrona esta em andamento. | `routes.tsx` (fallback do Suspense durante lazy loading) |
| `Collapse` | Anima a expansao e colapso de conteudo verticalmente. Util para filtros e secoes ocultaveis. | `ContatosTable` (painel de filtros) |

#### Tema e base global

| Componente | O que faz | Onde e usado |
|---|---|---|
| `ThemeProvider` | Injeta o tema MUI (cores, tipografia, bordas) em toda a arvore de componentes filhos. | `App.tsx` |
| `CssBaseline` | Aplica um reset de CSS consistente entre navegadores, alinhado ao tema MUI. Equivale ao `normalize.css`. | `App.tsx` |

#### Icones (`@mui/icons-material`)

| Icone | O que representa | Onde e usado |
|---|---|---|
| `Add` | Simbolo de adicionar (`+`) | `ContatosTable` (botao novo contato) |
| `Edit` | Lapis de edicao | `ContatosTable` (acao de editar linha) |
| `Delete` | Lixeira | `ContatosTable` (acao de excluir linha) |
| `HomeIcon` | Casa | `Sidebar`, `NotFoundPage` |
| `ContactsIcon` | Agenda de contatos | `Sidebar` |
| `ChevronLeftIcon` | Seta para esquerda | `Sidebar` (fechar menu) |
| `ChevronRightIcon` | Seta para direita | `Sidebar` (abrir menu colapsado) |

