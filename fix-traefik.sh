#!/bin/bash

# Script para corrigir e iniciar o Traefik
# Execute no servidor: sudo ./fix-traefik.sh

set -e

echo "🔧 Corrigindo Traefik - Mapa da Grana"
echo "====================================="

# Verificar se está como root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Execute como root: sudo ./fix-traefik.sh"
    exit 1
fi

# Verificar se Docker está rodando
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado"
    exit 1
fi

echo "📊 Status atual:"
echo "Docker containers:"
docker ps | grep traefik || echo "  Nenhum container Traefik rodando"

echo ""
echo "Redes Docker:"
docker network ls | grep proxy || echo "  Rede 'proxy' não encontrada"

echo ""
echo "Volumes Docker:"
docker volume ls | grep volume_swarm || echo "  Volumes não encontrados"

echo ""
echo "Portas em uso:"
netstat -tlnp | grep -E ":(80|443)" || echo "  Portas 80/443 livres"

echo ""
echo "🔧 Iniciando correções..."

# Parar containers Traefik existentes
echo "🛑 Parando containers Traefik existentes..."
docker ps -q --filter "name=traefik" | xargs -r docker stop
docker ps -aq --filter "name=traefik" | xargs -r docker rm

# Parar stacks Traefik existentes
echo "🛑 Parando stacks Traefik existentes..."
docker stack rm traefik 2>/dev/null || true
sleep 5

# Parar serviços que podem estar usando as portas
echo "🛑 Liberando portas 80/443..."
systemctl stop nginx 2>/dev/null || true
systemctl stop apache2 2>/dev/null || true
pkill -f nginx 2>/dev/null || true
pkill -f apache2 2>/dev/null || true

# Criar volumes se não existirem
echo "📦 Criando volumes necessários..."
docker volume create volume_swarm_shared 2>/dev/null || true
docker volume create volume_swarm_certificates 2>/dev/null || true

# Criar rede proxy se não existir
echo "🌐 Criando rede proxy..."
docker network create proxy 2>/dev/null || true

# Criar arquivo traefik.yaml
echo "📝 Criando arquivo traefik.yaml..."
cat > traefik.yaml << 'EOF'
version: "3.7"
services:
  traefik:
    image: traefik:v3.4.0
    command:
      - "--api.dashboard=true"
      - "--providers.swarm=true"
      - "--providers.docker.endpoint=unix:///var/run/docker.sock"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=proxy"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--entrypoints.web.http.redirections.entrypoint.permanent=true"
      - "--entrypoints.websecure.address=:443"
      - "--entrypoints.web.transport.respondingTimeouts.idleTimeout=3600"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencryptresolver.acme.storage=/etc/traefik/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencryptresolver.acme.email=contato@mapadnafinanceiro.com"
      - "--log.level=DEBUG"
      - "--log.format=common"
      - "--log.filePath=/var/log/traefik/traefik.log"
      - "--accesslog=true"
      - "--accesslog.filepath=/var/log/traefik/access-log"
    volumes:
      - "vol_certificates:/etc/traefik/letsencrypt"
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
    networks:
      - proxy
    ports:
      - target: 80
        published: 80
        mode: host
      - target: 443
        published: 443
        mode: host
    deploy:
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.middlewares.redirect-https.redirectscheme.scheme=https"
        - "traefik.http.middlewares.redirect-https.redirectscheme.permanent=true"
        - "traefik.http.routers.http-catchall.rule=Host(`{host:.+}`)"
        - "traefik.http.routers.http-catchall.entrypoints=web"
        - "traefik.http.routers.http-catchall.middlewares=redirect-https@docker"
        - "traefik.http.routers.http-catchall.priority=1"

volumes:
  vol_shared:
    external: true
    name: volume_swarm_shared
  vol_certificates:
    external: true
    name: volume_swarm_certificates

networks:
  proxy:
    external: true
    attachable: true
    name: proxy
EOF

# Deploy do Traefik
echo "🚀 Iniciando Traefik..."
docker stack deploy -c traefik.yaml traefik

# Aguardar Traefik iniciar
echo "⏳ Aguardando Traefik iniciar..."
sleep 10

# Verificar status
echo "📊 Verificando status do Traefik..."
if docker ps | grep -q traefik; then
    echo "✅ Traefik está rodando!"
    docker ps | grep traefik
else
    echo "❌ Traefik não iniciou. Verificando logs..."
    docker logs $(docker ps -aq --filter "name=traefik" | head -1) 2>/dev/null || echo "Nenhum log encontrado"
fi

echo ""
echo "🌐 Verificando portas..."
netstat -tlnp | grep -E ":(80|443)" || echo "Portas não estão sendo escutadas"

echo ""
echo "📋 Próximos passos:"
echo "1. Verifique se o Traefik está rodando: docker ps | grep traefik"
echo "2. Se estiver rodando, execute o deploy da aplicação:"
echo "   cd /home/mapa-dna && sudo ./deploy-complete.sh"
echo "3. Se não estiver rodando, verifique os logs:"
echo "   docker logs \$(docker ps -aq --filter 'name=traefik' | head -1)"

echo ""
echo "🔍 Comandos úteis:"
echo "   Ver logs: docker logs \$(docker ps -qf 'name=traefik_traefik') -f"
echo "   Ver status: docker ps | grep traefik"
echo "   Parar: docker stack rm traefik"
echo "   Reiniciar: docker stack deploy -c traefik.yaml traefik"
