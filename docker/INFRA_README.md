# Infraestrutura - Gerenciamento de Contatos

## Estrutura de Arquivos

```
.
├── docker-compose.yml          # Orquestração de serviços
├── start.sh                    # Script de inicialização
├── frontend/
│   ├── Dockerfile              # Build multi-stage React + Nginx
│   └── .dockerignore
├── backend/
│   ├── Dockerfile              # Build multi-stage ASP.NET Core
│   └── .dockerignore
├── nginx/
│   └── nginx.conf              # Proxy reverso
└── sql/
    └── init.sql                # Inicialização do banco
```

## Componentes

### 1. Frontend (React + Tailwind)
- **Dockerfile**: Multi-stage build (builder → nginx)
- **Porta interna**: 3000 (container)


### 2. Backend (ASP.NET Core 10)
- **Dockerfile**: Multi-stage build (SDK → aspnet)
- **Porta**: 8080
- **Healthcheck**: Aguarda SQL Server estar pronto

### 3. SQL Server
- **Imagem**: mcr.microsoft.com/mssql/server:2022-latest
- **Porta**: 1433
- **Dados**: Persistidos em volume `sqldata`
- **Inicialização**: Script `init.sql` automático

### 4. Nginx
- **Porta externa**: 8081 → 80 (container)
- **Roteamento**:
  - `/` → Frontend
  - `/api/` → Backend

## Como Executar

### Opção 1: Script Automático
```bash
chmod +x start.sh
./start.sh
```

### Opção 2: Docker Compose Direto
```bash
cd docker
docker compose up --build -d
```

## Acessos

| Serviço    | URL                      |
|-----------|--------------------------|
| Frontend  | http://localhost:8081    |
| API       | http://localhost:8080/api|
| SQL Server| localhost:1433           |

## Credenciais SQL Server

```
User: sa
Password: P@ssw0rd123!Secure
```

## Variáveis de Ambiente

**Backend**:
- `ASPNETCORE_ENVIRONMENT`: Development
- `ASPNETCORE_URLS`: http://+:8080
- `ConnectionStrings__ContatosDb`: Configurada automaticamente

**SQL Server**:
- `ACCEPT_EULA`: Y
- `SA_PASSWORD`: P@ssw0rd123!Secure
- `MSSQL_PID`: Developer

## Dados Persistidos

- **Volume SQL**: `sqldata` (volume Docker gerenciado)
- **Volume Backend**: `./backend` (bind mount para desenvolvimento)

## Parar a Aplicação

```bash
docker compose down
```

## Remover Volumes (Limpar dados)

```bash
docker compose down -v
```

## Verificar Status

```bash
docker compose ps
docker compose logs -f
```

## Otimizações

1. **Multi-stage builds**: Reduz tamanho das imagens
2. **.dockerignore**: Exclui arquivos desnecessários do contexto de build
3. **Healthcheck**: Garante dependências entre serviços
4. **Network bridge**: Isolamento de rede entre containers
5. **Volume gerenciado**: Persistência automática do SQL Server
