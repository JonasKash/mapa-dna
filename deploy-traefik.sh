#!/bin/bash

# Mapa da Grana - Deploy com Traefik
# Domínio: lp.mapadnafinanceiro.com
# Usa o Traefik existente no servidor

set -e

echo "🔮 Mapa da Grana - Deploy com Traefik"
echo "======================================"
echo "Domínio: lp.mapadnafinanceiro.com"
echo "Proxy: Traefik (portas 80/443)"
echo "SSL: Let's Encrypt automático"
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

# Verificar se o Traefik está rodando
print_status "Verificando se o Traefik está rodando..."
if ! docker ps | grep -q traefik; then
    print_warning "Traefik não está rodando. Certifique-se de que o Traefik está ativo."
    print_warning "Execute: docker stack deploy -c traefik.yaml traefik"
    read -p "Deseja continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deploy cancelado. Inicie o Traefik primeiro."
        exit 1
    fi
else
    print_success "✅ Traefik está rodando"
fi

# Verificar se a rede 'proxy' existe
print_status "Verificando se a rede 'proxy' existe..."
if ! docker network ls | grep -q proxy; then
    print_error "Rede 'proxy' não encontrada. Crie a rede primeiro:"
    print_error "docker network create proxy"
    exit 1
else
    print_success "✅ Rede 'proxy' encontrada"
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
mkdir -p logs/nginx
chmod 755 logs/nginx

# Parar containers existentes
print_status "Parando containers existentes..."
docker-compose -f docker-compose.traefik.yml down 2>/dev/null || true

# Remover imagens antigas (opcional)
read -p "Deseja remover imagens antigas para economizar espaço? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Removendo imagens antigas..."
    docker system prune -f
fi

# Build e start dos containers
print_status "Construindo e iniciando containers..."
docker-compose -f docker-compose.traefik.yml up -d --build --remove-orphans

# Aguardar containers iniciarem
print_status "Aguardando containers iniciarem..."
sleep 15

# Verificar status dos containers
print_status "Verificando status dos containers..."
docker-compose -f docker-compose.traefik.yml ps

# Verificar se os serviços estão rodando
print_status "Verificando se os serviços estão acessíveis..."

# Verificar backend
if curl -f http://localhost:3002/health &> /dev/null; then
    print_success "✅ Backend está rodando em http://localhost:3002"
else
    print_error "❌ Backend não está respondendo"
    print_status "Verificando logs do backend..."
    docker-compose -f docker-compose.traefik.yml logs backend
fi

# Verificar frontend
if curl -f http://localhost &> /dev/null; then
    print_success "✅ Frontend está rodando"
else
    print_error "❌ Frontend não está respondendo"
    print_status "Verificando logs do frontend..."
    docker-compose -f docker-compose.traefik.yml logs frontend
fi

print_success "🎉 Deploy concluído com sucesso!"
echo ""
echo "🌐 Aplicação disponível em:"
echo "   HTTP:  http://lp.mapadnafinanceiro.com"
echo "   HTTPS: https://lp.mapadnafinanceiro.com"
echo ""
echo "🔧 Serviços internos:"
echo "   Frontend: http://localhost"
echo "   Backend: http://localhost:3002"
echo ""
echo "📋 Comandos úteis:"
echo "   Ver logs: docker-compose -f docker-compose.traefik.yml logs -f"
echo "   Parar: docker-compose -f docker-compose.traefik.yml down"
echo "   Reiniciar: docker-compose -f docker-compose.traefik.yml restart"
echo "   Atualizar: ./deploy-traefik.sh"
echo ""
echo "🔍 Monitoramento:"
echo "   Health check: curl https://lp.mapadnafinanceiro.com/health"
echo "   API health: curl https://lp.mapadnafinanceiro.com/api/health"
echo "   Traefik dashboard: http://seu-ip:8080 (se habilitado)"
echo ""
echo "📊 Logs em tempo real:"
echo "   docker-compose -f docker-compose.traefik.yml logs -f"
echo ""
echo "🔒 SSL será configurado automaticamente pelo Traefik com Let's Encrypt"
