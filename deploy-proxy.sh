#!/bin/bash

# Mapa da Grana - Deploy com Proxy Reverso
# Domínio: lp.mapadnafinanceiro.com (portas padrão 80/443)
# Solução para conflitos de porta usando proxy reverso

set -e

echo "🔮 Mapa da Grana - Deploy com Proxy Reverso"
echo "============================================="
echo "Domínio: lp.mapadnafinanceiro.com"
echo "HTTP: Porta 80 (proxy)"
echo "HTTPS: Porta 443 (proxy)"
echo "Frontend interno: Porta 8080/8443"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    print_error "Execute este script como root ou com sudo"
    exit 1
fi

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker não está instalado. Execute primeiro: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose não está instalado. Execute primeiro: curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose"
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    print_warning "Arquivo .env não encontrado. Criando a partir do exemplo..."
    cp env.standalone .env
    print_warning "IMPORTANTE: Edite o arquivo .env com suas configurações antes de continuar!"
    print_warning "Especialmente: OPENAI_API_KEY, WEBHOOK_URL, WEBHOOK_SECRET"
    read -p "Pressione Enter após editar o .env..."
fi

# Criar diretórios necessários
print_status "Criando diretórios necessários..."
mkdir -p ssl
mkdir -p logs/nginx
mkdir -p logs/proxy
chmod 755 ssl
chmod 755 logs/nginx
chmod 755 logs/proxy

# Verificar se certificados SSL existem
if [ ! -f "ssl/fullchain.pem" ] || [ ! -f "ssl/privkey.pem" ]; then
    print_warning "Certificados SSL não encontrados em ssl/"
    print_warning "Para obter certificados SSL gratuitos:"
    print_warning "1. Instale certbot: apt install certbot"
    print_warning "2. Obtenha certificado: certbot certonly --standalone -d lp.mapadnafinanceiro.com"
    print_warning "3. Copie certificados: cp /etc/letsencrypt/live/lp.mapadnafinanceiro.com/* ssl/"
    print_warning ""
    read -p "Deseja continuar sem SSL? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deploy cancelado. Configure SSL primeiro."
        exit 1
    fi
fi

# Parar containers existentes
print_status "Parando containers existentes..."
docker-compose -f docker-compose.proxy.yml down 2>/dev/null || true

# Remover imagens antigas (opcional)
read -p "Deseja remover imagens antigas para economizar espaço? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Removendo imagens antigas..."
    docker system prune -f
fi

# Build e start dos containers
print_status "Construindo e iniciando containers..."
docker-compose -f docker-compose.proxy.yml up -d --build

# Aguardar containers iniciarem
print_status "Aguardando containers iniciarem..."
sleep 20

# Verificar status dos containers
print_status "Verificando status dos containers..."
docker-compose -f docker-compose.proxy.yml ps

# Verificar se os serviços estão rodando
print_status "Verificando se os serviços estão acessíveis..."

# Verificar backend
if curl -f http://localhost:3002/api/health &> /dev/null; then
    print_success "✅ Backend está rodando em http://localhost:3002"
else
    print_error "❌ Backend não está respondendo"
    print_status "Verificando logs do backend..."
    docker-compose -f docker-compose.proxy.yml logs backend
fi

# Verificar frontend interno
if curl -f http://localhost:8080 &> /dev/null; then
    print_success "✅ Frontend interno está rodando em http://localhost:8080"
else
    print_error "❌ Frontend interno não está respondendo"
    print_status "Verificando logs do frontend..."
    docker-compose -f docker-compose.proxy.yml logs frontend
fi

# Verificar proxy externo
if curl -f http://localhost &> /dev/null; then
    print_success "✅ Proxy externo está rodando em http://localhost"
else
    print_error "❌ Proxy externo não está respondendo"
    print_status "Verificando logs do proxy..."
    docker-compose -f docker-compose.proxy.yml logs proxy
fi

# Configurar firewall
print_status "Configurando firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8080/tcp
ufw allow 8443/tcp
ufw --force enable

# Configurar renovação automática de SSL (se certificados existem)
if [ -f "ssl/fullchain.pem" ]; then
    print_status "Configurando renovação automática de SSL..."
    (crontab -l 2>/dev/null; echo "0 12 * * * cd $(pwd) && docker-compose -f docker-compose.proxy.yml restart proxy") | crontab -
fi

print_success "🎉 Deploy concluído com sucesso!"
echo ""
echo "🌐 Aplicação disponível em:"
echo "   HTTP:  http://lp.mapadnafinanceiro.com"
echo "   HTTPS: https://lp.mapadnafinanceiro.com"
echo ""
echo "🔧 Serviços internos:"
echo "   Frontend: http://localhost:8080"
echo "   Frontend HTTPS: https://localhost:8443"
echo "   Backend: http://localhost:3002"
echo ""
echo "📋 Comandos úteis:"
echo "   Ver logs: docker-compose -f docker-compose.proxy.yml logs -f"
echo "   Parar: docker-compose -f docker-compose.proxy.yml down"
echo "   Reiniciar: docker-compose -f docker-compose.proxy.yml restart"
echo "   Atualizar: ./deploy-proxy.sh"
echo ""
echo "🔍 Monitoramento:"
echo "   Health check: curl https://lp.mapadnafinanceiro.com/health"
echo "   API health: curl https://lp.mapadnafinanceiro.com/api/health"
echo ""
echo "📊 Logs em tempo real:"
echo "   docker-compose -f docker-compose.proxy.yml logs -f"
