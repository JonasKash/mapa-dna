#!/bin/bash

# Script para configurar SSL com Let's Encrypt
# Uso: ./setup-ssl.sh seu-dominio.com

set -e

if [ -z "$1" ]; then
    echo "❌ Uso: ./setup-ssl.sh seu-dominio.com"
    exit 1
fi

DOMAIN=$1
EMAIL="admin@$DOMAIN"

echo "🔒 Configurando SSL para $DOMAIN..."

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

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    error "Execute este script como root ou com sudo"
fi

# Parar Nginx temporariamente
log "Parando Nginx..."
systemctl stop nginx

# Obter certificado SSL
log "Obtendo certificado SSL..."
certbot certonly --standalone -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

# Criar configuração do Nginx
log "Criando configuração do Nginx..."
cat > /etc/nginx/sites-available/matrix-mind-path << EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Habilitar site
log "Habilitando site..."
ln -sf /etc/nginx/sites-available/matrix-mind-path /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
log "Testando configuração do Nginx..."
nginx -t

# Iniciar Nginx
log "Iniciando Nginx..."
systemctl start nginx
systemctl enable nginx

# Configurar renovação automática do SSL
log "Configurando renovação automática do SSL..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

log "🎉 SSL configurado com sucesso!"
log "Seu site está disponível em: https://$DOMAIN"
log "API está disponível em: https://$DOMAIN/api/"
