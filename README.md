# CRUD de Contatos com Arquitetura Dockerizada

Projeto full stack para gerenciamento de contatos com frontend em React, backend em ASP.NET Core e banco SQL Server, orquestrados com Docker Compose.

## Visao geral

Este projeto foi organizado para rodar de forma consistente em ambiente containerizado, com separacao clara entre:

- Frontend (interface web)
- Backend (API REST)
- Banco de dados (SQL Server)
- Gateway Nginx (proxy reverso)

O objetivo principal e oferecer um fluxo simples de CRUD (listar, criar, atualizar e remover contatos), com persistencia em banco relacional.

## Arquitetura

Fluxo principal de requisicoes:

1. Usuario acessa a aplicacao pelo navegador.
2. Frontend envia requisicoes para endpoints da API.
3. Nginx encaminha chamadas de API para o backend.
4. Backend processa regras de negocio e grava/le no SQL Server.
5. Resultado volta para o frontend e atualiza a tela.

Topologia de servicos no Docker:

- contatos_frontend: app React servida por Nginx interno
- contatos_backend: API ASP.NET Core
- contatos_sql: SQL Server 2022
- contatos_nginx: gateway/proxy da stack

## Tecnologias utilizadas

Frontend:

- React 18
- TypeScript
- Vite
- Material UI
- Axios

Backend:

- ASP.NET Core (.NET 10)
- Entity Framework Core (SQL Server)
- Swagger

Infraestrutura:

- Docker
- Docker Compose
- Nginx
- SQL Server 2022

## Estrutura do repositorio

- back/Crud: projeto backend ASP.NET Core
- back/Crud/Infrastructure/docker: orquestracao Docker da stack
- back/Crud/Infrastructure/docker/nginx/nginx.conf: configuracao do gateway Nginx
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
- API direta (backend): http://localhost:8080/Contatos/listartodos
- SQL Server: localhost,1433

Observacao: a porta 8082 e a porta oficial do gateway da stack.

## Configuracao de banco de dados

Credenciais do SQL Server no Compose:

- Usuario: sa
- Senha: P@ssw0rd123!Secure
- Banco esperado: ContatosDB

Persistencia:

- O SQL Server usa volume Docker nomeado sqldata.
- Mesmo reiniciando containers, os dados permanecem enquanto o volume existir.

## Dados iniciais

Atualmente o backend cria apenas o schema quando necessario (EnsureCreated), sem injetar dados fixos no Program.cs.

Se quiser popular dados de exemplo, use o script SQL de referencia ou insira registros pela API/interface.

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

## Troubleshooting

1. Frontend abre, mas sem dados

- Verifique se a API retorna dados em http://localhost:8082/api/Contatos/listartodos
- Se retornar [], o banco esta vazio.

2. Dados aparecem na API, mas nao no SQL que voce abriu

- Confira se voce conectou no SQL do container (localhost,1433, banco ContatosDB).
- Garanta que a tabela consultada seja Contato (singular).

3. Erro de conexao com SQL no startup

- Aguarde healthcheck do SQL concluir.
- Verifique logs com docker compose logs -f sql e docker compose logs -f backend.

4. Porta em conflito

- Feche processos locais que usem as mesmas portas.
- Ajuste mapeamentos no docker-compose.yml se necessario.

## Estado atual da configuracao Docker

- Gateway Nginx em 8082:80
- Frontend em 3000:80
- Backend em 8080:8080
- SQL Server em 1433:1433

Proxy no gateway:

- / encaminha para frontend
- /api/ encaminha para backend

## Proximos passos sugeridos

1. Adotar migrations do EF Core para evolucao controlada de schema em ambientes futuros.
2. Criar rotina oficial de seed em SQL (script versionado) para homologacao e demos.
3. Adicionar testes de integracao para validar CRUD + persistencia no pipeline.