#!/bin/bash

# Mapa da Grana - Script de Instalação
# Este script automatiza a instalação do projeto em VPS

set -e

echo "🔮 Mapa da Grana - Instalação Automatizada"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
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

# Verificar se é root
if [ "$EUID" -eq 0 ]; then
    print_warning "Executando como root - algumas operações podem precisar de ajustes"
    # Continuar com root, mas avisar sobre possíveis problemas
fi

# Verificar sistema operacional
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    print_error "Este script é apenas para sistemas Linux"
    exit 1
fi

print_status "Verificando dependências..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    print_status "Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    if [ "$EUID" -ne 0 ]; then
        sudo usermod -aG docker $USER
        print_warning "Você precisa fazer logout e login novamente para usar Docker sem sudo"
    fi
    print_success "Docker instalado com sucesso"
else
    print_success "Docker já está instalado"
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_status "Instalando Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose instalado com sucesso"
else
    print_success "Docker Compose já está instalado"
fi

# Verificar Git
if ! command -v git &> /dev/null; then
    print_status "Instalando Git..."
    apt update
    apt install -y git
    print_success "Git instalado com sucesso"
else
    print_success "Git já está instalado"
fi

# Verificar se o projeto já existe
if [ -d "mapa-dna" ]; then
    print_warning "Diretório 'mapa-dna' já existe"
    read -p "Deseja remover e reinstalar? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf mapa-dna
        print_success "Diretório removido"
    else
        print_status "Continuando com instalação no diretório existente..."
        cd mapa-dna
    fi
else
    print_status "Clonando repositório..."
    git clone https://github.com/JonasKash/mapa-dna.git
    cd mapa-dna
    print_success "Repositório clonado com sucesso"
fi

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    print_status "Criando arquivo .env..."
    cp env.example .env
    print_success "Arquivo .env criado"
    print_warning "Edite o arquivo .env com suas configurações antes de continuar"
    read -p "Pressione Enter para continuar após editar o .env..."
else
    print_success "Arquivo .env já existe"
fi

# Verificar se Docker está rodando
if ! docker info &> /dev/null; then
    print_error "Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Build e start dos containers
print_status "Construindo e iniciando containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Aguardar containers iniciarem
print_status "Aguardando containers iniciarem..."
sleep 10

# Verificar status dos containers
print_status "Verificando status dos containers..."
docker-compose -f docker-compose.prod.yml ps

# Verificar se os serviços estão rodando
print_status "Verificando se os serviços estão acessíveis..."

# Verificar backend
if curl -f http://localhost:3002/api/health &> /dev/null; then
    print_success "Backend está rodando em http://localhost:3002"
else
    print_error "Backend não está respondendo"
fi

# Verificar frontend
if curl -f http://localhost:3000 &> /dev/null; then
    print_success "Frontend está rodando em http://localhost:3000"
else
    print_error "Frontend não está respondendo"
fi

print_success "Instalação concluída!"
echo
echo "🎉 Mapa da Grana está rodando!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3002"
echo
echo "📋 Comandos úteis:"
echo "  Ver logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Parar: docker-compose -f docker-compose.prod.yml down"
echo "  Reiniciar: docker-compose -f docker-compose.prod.yml restart"
echo
echo "📖 Para mais informações, consulte o README.md"
