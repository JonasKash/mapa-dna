#!/bin/bash

# Script para instalar dependências do sistema na VPS
# Uso: ./install-dependencies.sh

set -e

echo "🔧 Instalando dependências do sistema..."

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

# Atualizar sistema
log "Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências básicas
log "Instalando dependências básicas..."
apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Instalar Docker
log "Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl start docker
    systemctl enable docker
    log "✅ Docker instalado com sucesso!"
else
    log "✅ Docker já está instalado!"
fi

# Instalar Docker Compose
log "Instalando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log "✅ Docker Compose instalado com sucesso!"
else
    log "✅ Docker Compose já está instalado!"
fi

# Instalar Nginx (para proxy reverso e SSL)
log "Instalando Nginx..."
apt install -y nginx

# Instalar Certbot (para SSL)
log "Instalando Certbot..."
apt install -y certbot python3-certbot-nginx

# Configurar firewall
log "Configurando firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Criar usuário para a aplicação
log "Criando usuário para a aplicação..."
if ! id "matrixapp" &>/dev/null; then
    useradd -m -s /bin/bash matrixapp
    usermod -aG docker matrixapp
    log "✅ Usuário matrixapp criado!"
else
    log "✅ Usuário matrixapp já existe!"
fi

# Criar diretório da aplicação
log "Criando diretório da aplicação..."
mkdir -p /opt/matrix-mind-path
chown matrixapp:matrixapp /opt/matrix-mind-path

# Instalar Node.js (para desenvolvimento local)
log "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PM2 (para gerenciar processos)
log "Instalando PM2..."
npm install -g pm2

log "🎉 Todas as dependências foram instaladas com sucesso!"
log "Próximos passos:"
log "1. Clone o repositório em /opt/matrix-mind-path"
log "2. Configure o arquivo .env.production"
log "3. Execute ./deploy.sh"
