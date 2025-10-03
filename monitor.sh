#!/bin/bash

# Script de monitoramento do sistema
# Uso: ./monitor.sh

set -e

echo "📊 Monitoramento do Matrix Mind Path..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar status dos containers
check_containers() {
    log "Verificando status dos containers..."
    docker-compose -f docker-compose.prod.yml ps
}

# Verificar health checks
check_health() {
    log "Verificando health checks..."
    
    # Backend
    if curl -f http://localhost:3002/api/health > /dev/null 2>&1; then
        log "✅ Backend está funcionando!"
    else
        error "❌ Backend não está respondendo"
    fi
    
    # Frontend
    if curl -f http://localhost/ > /dev/null 2>&1; then
        log "✅ Frontend está funcionando!"
    else
        error "❌ Frontend não está respondendo"
    fi
}

# Verificar uso de recursos
check_resources() {
    log "Verificando uso de recursos..."
    
    echo "=== CPU e Memória ==="
    docker stats --no-stream
    
    echo "=== Uso de Disco ==="
    df -h
    
    echo "=== Uso de Memória ==="
    free -h
}

# Verificar logs
check_logs() {
    log "Verificando logs recentes..."
    
    echo "=== Logs do Backend (últimas 20 linhas) ==="
    docker-compose -f docker-compose.prod.yml logs --tail=20 backend
    
    echo "=== Logs do Frontend (últimas 20 linhas) ==="
    docker-compose -f docker-compose.prod.yml logs --tail=20 frontend
}

# Verificar rate limiting
check_rate_limiting() {
    log "Verificando status do rate limiting..."
    
    if curl -f http://localhost:3002/api/rate-limit/status > /dev/null 2>&1; then
        echo "=== Status do Rate Limiting ==="
        curl -s http://localhost:3002/api/rate-limit/status | jq .
    else
        warning "Não foi possível verificar o rate limiting"
    fi
}

# Verificar certificados SSL
check_ssl() {
    log "Verificando certificados SSL..."
    
    if [ -d "/etc/letsencrypt/live" ]; then
        echo "=== Certificados SSL ==="
        certbot certificates
    else
        warning "Nenhum certificado SSL encontrado"
    fi
}

# Menu principal
show_menu() {
    echo ""
    echo "=== Menu de Monitoramento ==="
    echo "1. Verificar containers"
    echo "2. Verificar health checks"
    echo "3. Verificar recursos"
    echo "4. Verificar logs"
    echo "5. Verificar rate limiting"
    echo "6. Verificar SSL"
    echo "7. Monitoramento completo"
    echo "8. Sair"
    echo ""
    read -p "Escolha uma opção: " choice
    
    case $choice in
        1) check_containers ;;
        2) check_health ;;
        3) check_resources ;;
        4) check_logs ;;
        5) check_rate_limiting ;;
        6) check_ssl ;;
        7) 
            check_containers
            check_health
            check_resources
            check_logs
            check_rate_limiting
            check_ssl
            ;;
        8) exit 0 ;;
        *) error "Opção inválida" ;;
    esac
}

# Verificar se jq está instalado
if ! command -v jq &> /dev/null; then
    warning "jq não está instalado. Instalando..."
    apt update && apt install -y jq
fi

# Loop principal
while true; do
    show_menu
    echo ""
    read -p "Pressione Enter para continuar..."
done
