#!/bin/bash

echo "Parando containers..."
docker compose down -v

echo "Removendo volumes..."
docker volume rm contatos_sqldata 2>/dev/null || true

echo "Limpando imagens dangling..."
docker image prune -f

echo "✅ Ambiente limpo com sucesso"
