#!/bin/bash

set -e

echo "🚀 Iniciando aplicação de Gerenciamento de Contatos"
echo ""

# Validar estrutura de diretórios
echo "✓ Verificando estrutura de diretórios..."
required_dirs=("./frontend" "./backend" "./sql" "./nginx")
for dir in "${required_dirs[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "❌ Diretório não encontrado: $dir"
        exit 1
    fi
done

echo "✓ Estrutura validada"
echo ""

# Build e up dos serviços
echo "📦 Construindo e iniciando containers..."
docker compose up --build -d

echo ""
echo "⏳ Aguardando inicialização do SQL Server (30s)..."
sleep 30

echo ""
echo "✅ Aplicação iniciada com sucesso!"
echo ""
echo "📍 Acessos:"
echo "   Frontend:  http://localhost"
echo "   API:       http://localhost/api"
echo "   SQL Server: localhost:1433"
echo ""
echo "📊 Credenciais SQL Server:"
echo "   User: sa"
echo "   Password: P@ssw0rd123!Secure"
echo ""
echo "💡 Comandos úteis:"
echo "   Ver logs:     docker compose logs -f"
echo "   Parar:        docker compose down"
echo "   Limpar:       docker compose down -v"
echo ""
