#!/bin/bash

# Script de backup do sistema
# Uso: ./backup.sh

set -e

echo "💾 Iniciando backup do Matrix Mind Path..."

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

# Configurações
BACKUP_DIR="/opt/backups/matrix-mind-path"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="matrix-mind-path-backup-$DATE.tar.gz"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Parar containers
log "Parando containers..."
docker-compose -f docker-compose.prod.yml down

# Fazer backup dos volumes
log "Fazendo backup dos volumes..."
docker run --rm -v matrix-mind-path_ssl_certs:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/ssl-certs-$DATE.tar.gz -C /data .

# Fazer backup do código
log "Fazendo backup do código..."
tar czf $BACKUP_DIR/$BACKUP_FILE \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=dist \
    --exclude=build \
    --exclude=*.log \
    .

# Fazer backup das configurações do sistema
log "Fazendo backup das configurações..."
cp /etc/nginx/sites-available/matrix-mind-path $BACKUP_DIR/nginx-config-$DATE.conf
cp .env.production $BACKUP_DIR/env-production-$DATE.env

# Fazer backup do banco de dados (se houver)
if docker volume ls | grep -q matrix-mind-path_db; then
    log "Fazendo backup do banco de dados..."
    docker run --rm -v matrix-mind-path_db:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/database-$DATE.tar.gz -C /data .
fi

# Reiniciar containers
log "Reiniciando containers..."
docker-compose -f docker-compose.prod.yml up -d

# Limpar backups antigos (manter apenas últimos 7 dias)
log "Limpando backups antigos..."
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.conf" -mtime +7 -delete
find $BACKUP_DIR -name "*.env" -mtime +7 -delete

# Mostrar informações do backup
log "Backup concluído!"
log "Arquivo: $BACKUP_DIR/$BACKUP_FILE"
log "Tamanho: $(du -h $BACKUP_DIR/$BACKUP_FILE | cut -f1)"

# Listar arquivos de backup
log "Arquivos de backup disponíveis:"
ls -la $BACKUP_DIR/
