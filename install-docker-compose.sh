#!/bin/bash

# Instalar Docker Compose
echo "🔧 Instalando Docker Compose..."

# Verificar se já está instalado
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose já está instalado: $(docker-compose --version)"
    exit 0
fi

if docker compose version &> /dev/null; then
    echo "✅ Docker Compose (plugin) já está instalado: $(docker compose version)"
    exit 0
fi

# Instalar docker-compose
echo "📥 Baixando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

echo "🔐 Configurando permissões..."
chmod +x /usr/local/bin/docker-compose

echo "✅ Docker Compose instalado com sucesso!"
echo "Versão: $(docker-compose --version)"

echo ""
echo "🚀 Agora você pode executar:"
echo "   sudo ./deploy-simple-fixed.sh"
