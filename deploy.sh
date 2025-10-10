#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
DOMAIN="www.lp.mapadnafinanceiro.com"
CLOUDFLARE_TOKEN="fWAO2YEzMNdv8r3siQRddHvE_-Ocy1HA15eUanTa"
EMAIL="admin@mapadnafinanceiro.com"

echo -e "${BLUE}🚀 Iniciando deploy do Mapa da Grana...${NC}"

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependências
echo -e "${YELLOW}📋 Verificando dependências...${NC}"

if ! command_exists docker; then
    echo -e "${RED}❌ Docker não encontrado. Instalando...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
    rm get-docker.sh
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose não encontrado. Instalando...${NC}"
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Parar containers existentes
echo -e "${YELLOW}🛑 Parando containers existentes...${NC}"
docker-compose down 2>/dev/null || true

# Criar diretório SSL
echo -e "${YELLOW}🔐 Configurando SSL...${NC}"
mkdir -p ssl

# Gerar certificado SSL auto-assinado (temporário)
echo -e "${YELLOW}📜 Gerando certificado SSL temporário...${NC}"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/cert.key \
    -out ssl/cert.pem \
    -subj "/C=BR/ST=MG/L=Belo Horizonte/O=MapaDNA/OU=IT/CN=${DOMAIN}/emailAddress=${EMAIL}"

# Configurar firewall
echo -e "${YELLOW}🔥 Configurando firewall...${NC}"
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Criando arquivo .env...${NC}"
    cat > .env << EOF
# Backend
PORT=3002
NODE_ENV=production
OPENAI_API_KEY=
WEBHOOK_URL=https://wbn.araxa.app/webhook/mapa-dna-financeiro
CORS_ORIGIN=https://${DOMAIN}

# Frontend
VITE_API_URL=https://${DOMAIN}/api
EOF
fi

# Build e start dos containers
echo -e "${YELLOW}🏗️  Construindo e iniciando containers...${NC}"
docker-compose down 2>/dev/null || true
docker-compose build --no-cache
docker-compose up -d

# Aguardar containers iniciarem
echo -e "${YELLOW}⏳ Aguardando containers iniciarem...${NC}"
sleep 30

# Verificar status dos containers
echo -e "${YELLOW}🔍 Verificando status dos containers...${NC}"
docker-compose ps

# Testar conectividade
echo -e "${YELLOW}🌐 Testando conectividade...${NC}"
sleep 10

# Teste HTTP
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ HTTP funcionando${NC}"
else
    echo -e "${RED}❌ HTTP não está funcionando${NC}"
fi

# Teste HTTPS
if curl -s -k -o /dev/null -w "%{http_code}" https://localhost | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ HTTPS funcionando${NC}"
else
    echo -e "${RED}❌ HTTPS não está funcionando${NC}"
fi

# Mostrar logs se houver erro
if ! docker-compose ps | grep -q "Up"; then
    echo -e "${RED}❌ Alguns containers não estão rodando. Verificando logs...${NC}"
    docker-compose logs
fi

echo -e "${GREEN}🎉 Deploy concluído!${NC}"
echo -e "${BLUE}📱 Acesse: https://${DOMAIN}${NC}"
echo -e "${YELLOW}📊 Status dos containers:${NC}"
docker-compose ps

echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo -e "1. Configure o DNS do domínio para apontar para este servidor"
echo -e "2. Configure SSL real com Let's Encrypt ou Cloudflare"
echo -e "3. Configure a chave OPENAI_API_KEY no arquivo .env se necessário"
echo -e "4. Monitore os logs com: docker-compose logs -f"
