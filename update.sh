#!/bin/bash

# Script de atualização do sistema
# Uso: ./update.sh

set -e

echo "🔄 Atualizando Matrix Mind Path..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Fazer backup antes da atualização
log "Fazendo backup antes da atualização..."
./backup.sh

# Atualizar código
log "Atualizando código..."
git pull origin main

# Verificar se há mudanças
if git diff --quiet HEAD~1 HEAD; then
    log "Nenhuma atualização disponível"
    exit 0
fi

# Parar containers
log "Parando containers..."
docker-compose -f docker-compose.prod.yml down

# Remover imagens antigas
log "Removendo imagens antigas..."
docker image prune -f

# Rebuild das imagens
log "Reconstruindo imagens..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar containers
log "Iniciando containers..."
docker-compose -f docker-compose.prod.yml up -d

# Aguardar containers ficarem prontos
log "Aguardando containers ficarem prontos..."
sleep 30

# Verificar se está funcionando
log "Verificando se a aplicação está funcionando..."
if curl -f http://localhost:3002/api/health > /dev/null 2>&1; then
    log "✅ Backend atualizado com sucesso!"
else
    error "❌ Erro ao atualizar backend"
fi

if curl -f http://localhost/ > /dev/null 2>&1; then
    log "✅ Frontend atualizado com sucesso!"
else
    error "❌ Erro ao atualizar frontend"
fi

# Mostrar logs
log "Mostrando logs recentes..."
docker-compose -f docker-compose.prod.yml logs --tail=20

log "🎉 Atualização concluída com sucesso!"
