#!/bin/bash

# Script de correção rápida para o domínio
DOMAIN="www.lp.mapadnafinanceiro.com"

echo "Configurando domínio: $DOMAIN"

# Continuar a partir do passo 6
cd /home

# Remover diretório existente se houver
if [[ -d "mapa-dna" ]]; then
    echo "Removendo diretório existente..."
    rm -rf mapa-dna
fi

# Clonar projeto
echo "Clonando projeto..."
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna

# Criar diretório SSL
echo "Criando certificados SSL..."
mkdir -p ssl

# Gerar certificados
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/cert.key \
  -out ssl/cert.pem \
  -subj "/C=BR/ST=MG/L=Belo Horizonte/O=MapaDNA/OU=IT/CN=$DOMAIN/emailAddress=admin@$DOMAIN"

# Configurar .env
echo "Configurando variáveis de ambiente..."
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

# Configurar firewall
echo "Configurando firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443

# Build e deploy
echo "Fazendo build e deploy..."
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true
docker system prune -a -f
docker-compose -f docker-compose.simple.yml build --no-cache
docker-compose -f docker-compose.simple.yml up -d

echo "Aguardando serviços iniciarem..."
sleep 30

echo "Verificando status..."
docker-compose -f docker-compose.simple.yml ps

echo "Testando conectividade..."
curl -k https://$DOMAIN/api/health || echo "Backend ainda não está respondendo"
curl -k https://$DOMAIN || echo "Frontend ainda não está respondendo"

echo "Instalação concluída!"
echo "Acesse: https://$DOMAIN"
