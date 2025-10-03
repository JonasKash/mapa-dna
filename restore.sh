#!/bin/bash

# Script de restore do sistema
# Uso: ./restore.sh backup-file.tar.gz

set -e

if [ -z "$1" ]; then
    echo "❌ Uso: ./restore.sh backup-file.tar.gz"
    echo "Arquivos disponíveis:"
    ls -la /opt/backups/matrix-mind-path/*.tar.gz 2>/dev/null || echo "Nenhum backup encontrado"
    exit 1
fi

BACKUP_FILE=$1
BACKUP_DIR="/opt/backups/matrix-mind-path"

echo "🔄 Iniciando restore do Matrix Mind Path..."

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

# Verificar se o arquivo existe
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    error "Arquivo de backup não encontrado: $BACKUP_DIR/$BACKUP_FILE"
fi

# Confirmar restore
warning "⚠️  ATENÇÃO: Este processo irá substituir os dados atuais!"
read -p "Tem certeza que deseja continuar? (digite 'SIM' para confirmar): " confirm

if [ "$confirm" != "SIM" ]; then
    log "Restore cancelado pelo usuário"
    exit 0
fi

# Parar containers
log "Parando containers..."
docker-compose -f docker-compose.prod.yml down

# Fazer backup do estado atual
log "Fazendo backup do estado atual..."
CURRENT_BACKUP="current-state-$(date +%Y%m%d_%H%M%S).tar.gz"
tar czf $BACKUP_DIR/$CURRENT_BACKUP . --exclude=node_modules --exclude=.git --exclude=dist --exclude=build --exclude=*.log

# Extrair backup
log "Extraindo backup..."
tar xzf $BACKUP_DIR/$BACKUP_FILE

# Restaurar volumes (se existirem)
if [ -f "$BACKUP_DIR/ssl-certs-$(echo $BACKUP_FILE | grep -o '[0-9]\{8\}_[0-9]\{6\}').tar.gz" ]; then
    log "Restaurando certificados SSL..."
    docker run --rm -v matrix-mind-path_ssl_certs:/data -v $BACKUP_DIR:/backup alpine tar xzf /backup/ssl-certs-$(echo $BACKUP_FILE | grep -o '[0-9]\{8\}_[0-9]\{6\}').tar.gz -C /data
fi

# Restaurar banco de dados (se existir)
if [ -f "$BACKUP_DIR/database-$(echo $BACKUP_FILE | grep -o '[0-9]\{8\}_[0-9]\{6\}').tar.gz" ]; then
    log "Restaurando banco de dados..."
    docker run --rm -v matrix-mind-path_db:/data -v $BACKUP_DIR:/backup alpine tar xzf /backup/database-$(echo $BACKUP_FILE | grep -o '[0-9]\{8\}_[0-9]\{6\}').tar.gz -C /data
fi

# Rebuild e restart
log "Reconstruindo e reiniciando containers..."
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Aguardar containers ficarem prontos
log "Aguardando containers ficarem prontos..."
sleep 30

# Verificar se está funcionando
log "Verificando se a aplicação está funcionando..."
if curl -f http://localhost:3002/api/health > /dev/null 2>&1; then
    log "✅ Backend restaurado com sucesso!"
else
    error "❌ Erro ao restaurar backend"
fi

if curl -f http://localhost/ > /dev/null 2>&1; then
    log "✅ Frontend restaurado com sucesso!"
else
    error "❌ Erro ao restaurar frontend"
fi

log "🎉 Restore concluído com sucesso!"
log "Backup do estado anterior salvo em: $BACKUP_DIR/$CURRENT_BACKUP"
