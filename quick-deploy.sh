#!/bin/bash

# Deploy Rápido - Mapa da Grana
# Para uso em produção

set -e

echo "🚀 Deploy Rápido - Mapa da Grana"
echo "================================"

# Verificar se está como root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Execute como root: sudo ./quick-deploy.sh"
    exit 1
fi

# Atualizar código
echo "📥 Atualizando código..."
git pull origin master

# Criar .env se não existir
if [ ! -f ".env" ]; then
    echo "📝 Criando .env..."
    cp env.traefik .env
    echo "⚠️  EDITE O ARQUIVO .env COM SUAS CONFIGURAÇÕES!"
    echo "   Especialmente: OPENAI_API_KEY, WEBHOOK_URL"
    read -p "Pressione Enter após editar o .env..."
fi

# Deploy
echo "🐳 Fazendo deploy..."
docker-compose -f docker-compose.traefik.yml down 2>/dev/null || true
docker-compose -f docker-compose.traefik.yml up -d --build --remove-orphans

# Aguardar
echo "⏳ Aguardando containers..."
sleep 20

# Status
echo "📊 Status dos containers:"
docker-compose -f docker-compose.traefik.yml ps

echo ""
echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://lp.mapadnafinanceiro.com"
echo "🔍 Logs: docker-compose -f docker-compose.traefik.yml logs -f"
