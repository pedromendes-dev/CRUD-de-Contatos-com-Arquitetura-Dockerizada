# Pipeline de CI - Gerenciamento de Contatos

Este documento explica a pipeline definida em [.github/workflows/deploy.yml](/d:/Opus127/CRUD-de-Contatos-com-Arquitetura-Dockerizada/.github/workflows/deploy.yml:1).

Pipeline de `CI` (Continuous Integration). O objetivo dela e validar se o projeto esta saudavel para seguir evoluindo. Ela nao publica nada em producao e nao faz deploy automatico.

## Objetivo da pipeline

Essa pipeline existe para verificar automaticamente se o repositorio continua consistente depois de um `push` ou de um `pull request`.

Ela valida:

- checkout do codigo;
- restauracao e build do backend em .NET;
- instalacao e build do frontend em Node.js/Vite;
- construcao das imagens Docker do backend, frontend e nginx.

Se qualquer uma dessas etapas quebrar, o workflow falha.

## Quando ela roda

A pipeline roda nos seguintes eventos:

- `push` na branch `main`;
- `pull_request` direcionado para `main`;
- `workflow_dispatch`, que permite execucao manual pela aba `Actions` do GitHub.

## Estrutura geral do workflow

O workflow possui um unico job chamado `build-validate`.

Esse job roda em `ubuntu-latest`, ou seja, em uma maquina virtual Linux fornecida pelo GitHub Actions.

## O que cada etapa faz

### 1. Checkout do codigo

```yml
- name: Checkout codigo
  uses: actions/checkout@v4
```

Baixa o conteudo do repositorio para dentro da maquina do GitHub Actions. Sem isso, nenhuma outra etapa conseguiria acessar seus arquivos.

### 2. Configuracao do .NET

```yml
- name: Configurar .NET 10
  uses: actions/setup-dotnet@v4
  with:
    dotnet-version: 10.0.x
```

Instala o SDK do .NET 10 para combinar com o `TargetFramework` do backend, que hoje esta em `net10.0`.

Arquivo relacionado:

- [back/Crud/CrudContatos.csproj](/d:/Opus127/CRUD-de-Contatos-com-Arquitetura-Dockerizada/back/Crud/CrudContatos.csproj:1)

### 3. Restore do backend

```yml
- name: Restaurar dependencias do backend
  run: dotnet restore back/Crud/CrudContatos.csproj
```

Baixa e resolve os pacotes NuGet do projeto backend.

Se houver erro de dependencias, versoes invalidas ou problema no arquivo `.csproj`, a pipeline para aqui.

### 4. Build do backend

```yml
- name: Build do backend
  run: dotnet build back/Crud/CrudContatos.csproj --configuration Release --no-restore
```

Compila o backend em modo `Release`.

Se houver erro de compilacao em C#, referencias faltando ou codigo invalido, a pipeline falha.

### 5. Configuracao do Node.js

```yml
- name: Configurar Node.js 20
  uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
    cache-dependency-path: Presetation/Project/package-lock.json
```

Instala o Node.js 20 e ativa cache do `npm`, o que acelera execucoes futuras.

### 6. Instalacao das dependencias do frontend

```yml
- name: Instalar dependencias do frontend
  run: npm ci
  working-directory: Presetation/Project
```

Instala as dependencias exatamente como estao travadas no `package-lock.json`.

O uso de `npm ci` e melhor para CI porque deixa a instalacao mais previsivel e reprodutivel.

### 7. Build do frontend

```yml
- name: Build do frontend
  run: npm run build
  working-directory: Presetation/Project
```

Executa o build do frontend com Vite.

Se houver erro de TypeScript, import quebrado, configuracao ruim ou problema de bundling, a pipeline falha.

Arquivo relacionado:

- [Presetation/Project/package.json](/d:/Opus127/CRUD-de-Contatos-com-Arquitetura-Dockerizada/Presetation/Project/package.json:1)

### 8. Build da imagem Docker do backend

```yml
- name: Build da imagem Docker do backend
  run: docker build -t gerenciamento-contatos-backend:ci -f back/Crud/Infrastructure/docker/backend/Dockerfile.backend back/Crud
```

Testa se a imagem Docker do backend realmente consegue ser montada.

Isso ajuda a detectar:

- `COPY` apontando para caminho errado;
- erro no `Dockerfile`;
- arquivo ausente no contexto de build;
- falha no `dotnet restore` dentro da imagem;
- falha no `dotnet build` dentro da imagem.

### 9. Build da imagem Docker do frontend

```yml
- name: Build da imagem Docker do frontend
  run: docker build -t gerenciamento-contatos-frontend:ci -f back/Crud/Infrastructure/docker/frontend/Dockerfile Presetation/Project
```

Valida a imagem Docker do frontend usando o contexto correto do projeto React.

Essa etapa tambem valida a fase de build com Node e a fase final com Nginx.

### 10. Build da imagem Docker do nginx

```yml
- name: Build da imagem Docker do nginx
  run: docker build -t gerenciamento-contatos-nginx:ci -f back/Crud/Infrastructure/docker/nginx/Dockerfile back/Crud/Infrastructure/docker/nginx
```

Garante que a imagem responsavel pelo Nginx tambem pode ser criada sem problemas.

## O que significa falhar

Essa pipeline foi desenhada para falhar rapidamente quando alguma parte essencial do projeto estiver quebrada.

Ela falha, por exemplo, se acontecer qualquer uma destas situacoes:

- o backend nao compilar;
- o frontend nao compilar;
- o `package-lock.json` estiver inconsistente;
- algum `Dockerfile` estiver incorreto;
- algum arquivo esperado no contexto de build nao existir;
- houver erro de sintaxe ou dependencias invalidas.

Em outras palavras, ela funciona como uma barreira automatica de qualidade.

## O que ela ainda nao faz

Essa pipeline nao executa deploy.

Ela tambem nao faz, pelo menos por enquanto:

- publicacao de imagens em registry;
- deploy no Render;
- execucao de testes automatizados;
- validacao com `docker compose`;
- analise de seguranca;
- lint do frontend.

## Diferenca entre CI e deploy

Hoje este workflow esta no grupo de `CI`.

- `CI`: verifica se o projeto continua compilando e podendo ser empacotado.
- `CD`: entrega ou publica o projeto em algum ambiente.

Como esta, o seu arquivo `deploy.yml` esta com nome de deploy, mas comportamento de CI.

Se quiser, no futuro voce pode:

1. manter esse arquivo como pipeline de validacao;
2. criar outro workflow separado so para deploy;
3. renomear este arquivo para algo como `ci.yml`.

## Caminhos usados pela pipeline

Os principais caminhos considerados no workflow sao:

- backend: [back/Crud/CrudContatos.csproj](/d:/Opus127/CRUD-de-Contatos-com-Arquitetura-Dockerizada/back/Crud/CrudContatos.csproj:1)
- frontend: [Presetation/Project/package.json](/d:/Opus127/CRUD-de-Contatos-com-Arquitetura-Dockerizada/Presetation/Project/package.json:1)
- Docker backend: [back/Crud/Infrastructure/docker/backend/Dockerfile.backend](/d:/Opus127/CRUD-de-Contatos-com-Arquitetura-Dockerizada/back/Crud/Infrastructure/docker/backend/Dockerfile.backend:1)
- Docker frontend: [back/Crud/Infrastructure/docker/frontend/Dockerfile](/d:/Opus127/CRUD-de-Contatos-com-Arquitetura-Dockerizada/back/Crud/Infrastructure/docker/frontend/Dockerfile:1)
- Docker nginx: [back/Crud/Infrastructure/docker/nginx/Dockerfile](/d:/Opus127/CRUD-de-Contatos-com-Arquitetura-Dockerizada/back/Crud/Infrastructure/docker/nginx/Dockerfile:1)

## Fluxo resumido

O comportamento da pipeline pode ser resumido assim:

1. baixa o repositorio;
2. prepara o ambiente .NET;
3. restaura e compila o backend;
4. prepara o ambiente Node.js;
5. instala e compila o frontend;
6. monta as imagens Docker;
7. falha se qualquer etapa der erro.

## Como expandir depois

Quando voce quiser evoluir essa pipeline, os proximos passos mais naturais sao:

1. adicionar testes do backend;
2. adicionar `npm test` no frontend;
3. validar `docker compose config` ou `docker compose build`;
4. publicar imagens Docker;
5. fazer deploy em ambiente remoto.
