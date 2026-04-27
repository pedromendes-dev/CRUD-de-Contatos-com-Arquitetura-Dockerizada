# ─── STAGE 1: BUILD ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS builder

WORKDIR /src

# Copia os .csproj de todos os projetos para aproveitar cache de camadas
COPY CrudContatos.Api/CrudContatos.Api.csproj                       CrudContatos.Api/
COPY CrudContatos.Core/CrudContatos.Core.csproj                     CrudContatos.Core/
COPY CrudContatos.Domain.Entity/CrudContatos.Domain.Entity.csproj   CrudContatos.Domain.Entity/
COPY CrudContatos.Domain.Service/CrudContatos.Domain.Service.csproj CrudContatos.Domain.Service/
COPY CrudContatos.Infra.Data/CrudContatos.Infra.Data.csproj         CrudContatos.Infra.Data/

RUN dotnet restore "CrudContatos.Api/CrudContatos.Api.csproj"

COPY . .

RUN dotnet build "CrudContatos.Api/CrudContatos.Api.csproj" -c Release -o /app/build

# ─── STAGE 2: RUNTIME ────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0

WORKDIR /app

COPY --from=builder /app/build .

EXPOSE 8080

ENTRYPOINT ["dotnet", "CrudContatos.Api.dll"]
