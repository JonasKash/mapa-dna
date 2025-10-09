#!/bin/bash

# 🚀 Instalador Automático - Mapa da Grana
# Script para instalação completa na VPS

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
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

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                    🚀 MAPA DA GRANA                          ║
║              Instalador Automático VPS                       ║
║                                                              ║
║  Este script irá instalar automaticamente:                  ║
║  • Docker e Docker Compose                                  ║
║  • Aplicação Mapa da Grana                                  ║
║  • Certificados SSL                                         ║
║  • Configuração Nginx                                       ║
║  • Firewall                                                 ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Verificar se é root
if [[ $EUID -ne 0 ]]; then
   error "Este script deve ser executado como root (use sudo)"
fi

# Verificar sistema operacional
if [[ ! -f /etc/os-release ]]; then
    error "Sistema operacional não suportado"
fi

source /etc/os-release
if [[ "$ID" != "ubuntu" ]]; then
    warning "Este script foi testado no Ubuntu. Continuando mesmo assim..."
fi

log "Iniciando instalação do Mapa da Grana..."

# Passo 1: Atualizar sistema
log "Passo 1/11: Atualizando sistema..."
apt update && apt upgrade -y

# Passo 2: Instalar dependências
log "Passo 2/11: Instalando dependências básicas..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Passo 3: Instalar Docker
log "Passo 3/11: Instalando Docker..."

# Remover versões antigas
apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Adicionar repositório oficial
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Iniciar e habilitar Docker
systemctl start docker
systemctl enable docker

# Verificar instalação do Docker
if ! docker --version > /dev/null 2>&1; then
    error "Falha na instalação do Docker"
fi

log "Docker instalado com sucesso: $(docker --version)"

# Passo 4: Instalar Docker Compose
log "Passo 4/11: Instalando Docker Compose..."

# Baixar versão mais recente
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)

curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Tornar executável
chmod +x /usr/local/bin/docker-compose

# Verificar instalação
if ! docker-compose --version > /dev/null 2>&1; then
    error "Falha na instalação do Docker Compose"
fi

log "Docker Compose instalado com sucesso: $(docker-compose --version)"

# Passo 5: Configurar domínio
log "Passo 5/11: Configurando domínio..."

# Configurar domínio fixo
DOMAIN="www.lp.mapadnafinanceiro.com"
log "Domínio configurado: $DOMAIN"

# Passo 6: Clonar projeto
log "Passo 6/11: Clonando projeto..."

cd /home

# Remover diretório existente se houver
if [[ -d "mapa-dna" ]]; then
    warning "Diretório mapa-dna já existe. Removendo..."
    rm -rf mapa-dna
fi

git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna

if [[ ! -f "docker-compose.simple.yml" ]]; then
    error "Falha ao clonar o projeto"
fi

log "Projeto clonado com sucesso"

# Passo 7: Configurar SSL
log "Passo 7/11: Configurando certificados SSL..."

mkdir -p ssl

# Gerar certificados autoassinados
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/cert.key \
  -out ssl/cert.pem \
  -subj "/C=BR/ST=MG/L=Belo Horizonte/O=MapaDNA/OU=IT/CN=$DOMAIN/emailAddress=admin@$DOMAIN"

if [[ ! -f "ssl/cert.pem" ]] || [[ ! -f "ssl/cert.key" ]]; then
    error "Falha na geração dos certificados SSL"
fi

log "Certificados SSL gerados com sucesso"

# Passo 8: Configurar variáveis de ambiente
log "Passo 8/11: Configurando variáveis de ambiente..."

# Criar arquivo .env
cat > .env << EOF
# Backend
PORT=3002
NODE_ENV=production
OPENAI_API_KEY=sua_chave_openai_aqui
WEBHOOK_URL=https://wbn.araxa.app/webhook/mapa-dna-financeiro
WEBHOOK_SECRET=seu_secret_webhook_aqui
CORS_ORIGIN=https://$DOMAIN

# Frontend
VITE_API_URL=https://$DOMAIN/api
EOF

log "Variáveis de ambiente configuradas"

# Passo 9: Configurar firewall
log "Passo 9/11: Configurando firewall..."

# Habilitar UFW se não estiver ativo
if ! ufw status | grep -q "Status: active"; then
    ufw --force enable
fi

# Permitir portas necessárias
ufw allow ssh
ufw allow 80
ufw allow 443

log "Firewall configurado"

# Passo 10: Build e deploy
log "Passo 10/11: Fazendo build e deploy..."

# Parar containers existentes
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

# Limpar sistema Docker
docker system prune -a -f

# Build das imagens
log "Fazendo build das imagens Docker..."
docker-compose -f docker-compose.simple.yml build --no-cache

# Iniciar serviços
log "Iniciando serviços..."
docker-compose -f docker-compose.simple.yml up -d

# Aguardar serviços iniciarem
log "Aguardando serviços iniciarem..."
sleep 30

# Verificar status
if ! docker-compose -f docker-compose.simple.yml ps | grep -q "Up"; then
    error "Falha ao iniciar os serviços"
fi

log "Serviços iniciados com sucesso"

# Passo 11: Verificação final
log "Passo 11/11: Verificação final..."

# Verificar containers
log "Status dos containers:"
docker-compose -f docker-compose.simple.yml ps

# Testar conectividade
log "Testando conectividade..."

# Aguardar um pouco mais para garantir que tudo está funcionando
sleep 10

# Testar backend
if curl -k -s -f "https://$DOMAIN/api/health" > /dev/null; then
    log "✅ Backend funcionando"
else
    warning "⚠️ Backend pode não estar respondendo ainda"
fi

# Testar frontend
if curl -k -s -f "https://$DOMAIN" > /dev/null; then
    log "✅ Frontend funcionando"
else
    warning "⚠️ Frontend pode não estar respondendo ainda"
fi

# Criar script de monitoramento
log "Criando script de monitoramento..."

cat > /home/monitor-mapa-dna.sh << 'EOF'
#!/bin/bash
echo "=== STATUS DOS CONTAINERS ==="
docker-compose -f /home/mapa-dna/docker-compose.simple.yml ps

echo -e "\n=== USO DE RECURSOS ==="
docker stats --no-stream

echo -e "\n=== ESPAÇO EM DISCO ==="
df -h

echo -e "\n=== MEMÓRIA ==="
free -h

echo -e "\n=== LOGS RECENTES ==="
docker-compose -f /home/mapa-dna/docker-compose.simple.yml logs --tail=10
EOF

chmod +x /home/monitor-mapa-dna.sh

# Criar script de atualização
log "Criando script de atualização..."

cat > /home/update-mapa-dna.sh << 'EOF'
#!/bin/bash
cd /home/mapa-dna
git pull origin master
docker-compose -f docker-compose.simple.yml down
docker-compose -f docker-compose.simple.yml up -d --build
echo "Aplicação atualizada com sucesso!"
EOF

chmod +x /home/update-mapa-dna.sh

# Finalização
echo -e "${GREEN}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                    🎉 INSTALAÇÃO CONCLUÍDA!                 ║
║                                                              ║
║  Sua aplicação Mapa da Grana está rodando!                  ║
║                                                              ║
║  📍 URLs de Acesso:                                         ║
║  • Frontend: https://SEU_DOMINIO                            ║
║  • API Health: https://SEU_DOMINIO/api/health               ║
║                                                              ║
║  🛠️ Comandos Úteis:                                         ║
║  • Monitorar: /home/monitor-mapa-dna.sh                     ║
║  • Atualizar: /home/update-mapa-dna.sh                      ║
║  • Logs: docker-compose -f /home/mapa-dna/docker-compose.simple.yml logs -f ║
║                                                              ║
║  ⚠️ IMPORTANTE:                                              ║
║  • Configure suas chaves OpenAI no arquivo .env             ║
║  • Os certificados SSL são autoassinados (apenas para teste)║
║  • Para produção, use certificados Let's Encrypt            ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Substituir SEU_DOMINIO pelo domínio real
sed -i "s/SEU_DOMINIO/$DOMAIN/g" /home/monitor-mapa-dna.sh 2>/dev/null || true

log "Instalação concluída com sucesso!"
log "Acesse: https://$DOMAIN"
log "Para monitorar: /home/monitor-mapa-dna.sh"
log "Para atualizar: /home/update-mapa-dna.sh"

# Mostrar informações finais
info "Informações da instalação:"
info "• Domínio: $DOMAIN"
info "• Diretório: /home/mapa-dna"
info "• Certificados: /home/mapa-dna/ssl/"
info "• Configuração: /home/mapa-dna/.env"

echo -e "${YELLOW}"
echo "⚠️ PRÓXIMOS PASSOS:"
echo "1. Configure sua chave OpenAI no arquivo .env"
echo "2. Teste a aplicação em https://$DOMAIN"
echo "3. Configure certificados Let's Encrypt para produção"
echo -e "${NC}"

log "Instalação finalizada! 🚀"
