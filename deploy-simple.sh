#!/bin/bash

# Deploy Simples - Mapa da Grana
# Sem Traefik, usando Nginx direto

set -e

echo "🚀 Deploy Simples - Mapa da Grana"
echo "================================="
echo "Domínio: lp.mapadnafinanceiro.com"
echo "Portas: 80/443 (Nginx) + 8080 (Frontend) + 3002 (Backend)"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Verificar se está como root
if [ "$EUID" -ne 0 ]; then
    print_error "Execute como root: sudo ./deploy-simple.sh"
    exit 1
fi

# Parar containers existentes
print_status "Parando containers existentes..."
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

# Parar serviços que podem estar usando as portas
print_status "Liberando portas 80/443..."
systemctl stop nginx 2>/dev/null || true
systemctl stop apache2 2>/dev/null || true
pkill -f nginx 2>/dev/null || true
pkill -f apache2 2>/dev/null || true

# Criar diretório SSL
print_status "Criando diretório SSL..."
mkdir -p ssl

# Criar certificados auto-assinados (temporários)
if [ ! -f "ssl/cert.pem" ]; then
    print_status "Criando certificados SSL temporários..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=BR/ST=SP/L=SaoPaulo/O=MapaDNA/CN=lp.mapadnafinanceiro.com"
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    print_warning "Arquivo .env não encontrado. Criando..."
    cp env.traefik .env
    print_warning "IMPORTANTE: Edite o arquivo .env com suas configurações!"
    print_warning "Especialmente: OPENAI_API_KEY, WEBHOOK_URL"
    read -p "Pressione Enter após editar o .env..."
fi

# Build e start
print_status "Construindo e iniciando containers..."
docker-compose -f docker-compose.simple.yml up -d --build

# Aguardar containers iniciarem
print_status "Aguardando containers iniciarem..."
sleep 30

# Verificar status
print_status "Verificando status dos containers..."
docker-compose -f docker-compose.simple.yml ps

# Testar endpoints
print_status "Testando endpoints..."

# Testar backend
if curl -f http://localhost:3002/health &> /dev/null; then
    print_success "✅ Backend está rodando em http://localhost:3002"
else
    print_warning "⚠️ Backend não está respondendo"
fi

# Testar frontend
if curl -f http://localhost:8080 &> /dev/null; then
    print_success "✅ Frontend está rodando em http://localhost:8080"
else
    print_warning "⚠️ Frontend não está respondendo"
fi

# Testar Nginx
if curl -f http://localhost &> /dev/null; then
    print_success "✅ Nginx está rodando em http://localhost"
else
    print_warning "⚠️ Nginx não está respondendo"
fi

print_success "🎉 Deploy concluído!"
echo ""
echo "🌐 Aplicação disponível em:"
echo "   HTTP:  http://lp.mapadnafinanceiro.com (redireciona para HTTPS)"
echo "   HTTPS: https://lp.mapadnafinanceiro.com"
echo "   Frontend direto: http://localhost:8080"
echo "   Backend direto: http://localhost:3002"
echo ""
echo "📋 Comandos úteis:"
echo "   Ver logs: docker-compose -f docker-compose.simple.yml logs -f"
echo "   Parar: docker-compose -f docker-compose.simple.yml down"
echo "   Reiniciar: docker-compose -f docker-compose.simple.yml restart"
echo ""
echo "🔍 Testar:"
echo "   curl https://lp.mapadnafinanceiro.com/health"
echo "   curl https://lp.mapadnafinanceiro.com/api/health"
echo ""
echo "⚠️ IMPORTANTE: Configure certificados SSL reais para produção!"
