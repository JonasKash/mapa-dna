#!/bin/bash

# Script de Deploy para VPS
# Uso: ./deploy.sh

set -e

echo "🚀 Iniciando deploy do Matrix Mind Path..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log
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

# Verificar se está rodando como root
if [ "$EUID" -eq 0 ]; then
    error "Não execute este script como root! Use um usuário com sudo."
fi

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado. Instale o Docker primeiro."
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose não está instalado. Instale o Docker Compose primeiro."
fi

# Verificar se o arquivo .env.production existe
if [ ! -f ".env.production" ]; then
    warning "Arquivo .env.production não encontrado. Copiando do exemplo..."
    cp env.production.example .env.production
    error "Configure o arquivo .env.production com suas variáveis antes de continuar."
fi

# Parar containers existentes
log "Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down || true

# Remover imagens antigas (opcional)
log "Removendo imagens antigas..."
docker image prune -f || true

# Build das imagens
log "Fazendo build das imagens..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar containers
log "Iniciando containers..."
docker-compose -f docker-compose.prod.yml up -d

# Aguardar containers ficarem prontos
log "Aguardando containers ficarem prontos..."
sleep 30

# Verificar status dos containers
log "Verificando status dos containers..."
docker-compose -f docker-compose.prod.yml ps

# Verificar health checks
log "Verificando health checks..."
if curl -f http://localhost:3002/api/health > /dev/null 2>&1; then
    log "✅ Backend está funcionando!"
else
    error "❌ Backend não está respondendo"
fi

if curl -f http://localhost/ > /dev/null 2>&1; then
    log "✅ Frontend está funcionando!"
else
    error "❌ Frontend não está respondendo"
fi

log "🎉 Deploy concluído com sucesso!"
log "Frontend: http://localhost"
log "Backend: http://localhost:3002"
log "Health Check: http://localhost:3002/api/health"

# Mostrar logs dos containers
log "Mostrando logs dos containers (Ctrl+C para sair):"
docker-compose -f docker-compose.prod.yml logs -f
