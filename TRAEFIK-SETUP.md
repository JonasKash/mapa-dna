# 🚀 Guia Completo - Setup Traefik + Deploy

## 📋 **Passo a Passo no Servidor**

### **1. Conectar no Servidor**
```bash
ssh root@seu-servidor-ip
# ou
ssh usuario@seu-servidor-ip
```

### **2. Verificar Status Atual**
```bash
# Verificar se Docker está rodando
docker ps

# Verificar se Traefik está rodando
docker ps | grep traefik

# Verificar redes Docker
docker network ls
```

### **3. Iniciar o Traefik (se não estiver rodando)**

#### **Opção A: Se você tem o arquivo traefik.yaml**
```bash
# Navegar para o diretório onde está o traefik.yaml
cd /root  # ou onde estiver o arquivo

# Verificar se o arquivo existe
ls -la traefik.yaml

# Deploy do Traefik
docker stack deploy -c traefik.yaml traefik

# Verificar se iniciou
docker ps | grep traefik
```

#### **Opção B: Se não tem o arquivo traefik.yaml**
```bash
# Criar o arquivo traefik.yaml
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

# Criar volumes necessários
docker volume create volume_swarm_shared
docker volume create volume_swarm_certificates

# Criar rede proxy
docker network create proxy

# Deploy do Traefik
docker stack deploy -c traefik.yaml traefik
```

### **4. Verificar se Traefik Iniciou**
```bash
# Ver containers do Traefik
docker ps | grep traefik

# Ver logs do Traefik
docker logs $(docker ps -qf "name=traefik_traefik") --tail 20

# Verificar se está escutando nas portas
netstat -tlnp | grep :80
netstat -tlnp | grep :443
```

### **5. Deploy da Aplicação**
```bash
# Navegar para o diretório do projeto
cd /home/mapa-dna

# Atualizar código
git pull origin master

# Criar .env
cp env.traefik .env
nano .env  # Editar com suas configurações

# Deploy da aplicação
sudo ./deploy-complete.sh
```

## 🔧 **Comandos de Troubleshooting**

### **Se Traefik não iniciar:**
```bash
# Ver logs de erro
docker logs $(docker ps -qf "name=traefik_traefik") 2>&1 | tail -50

# Verificar se as portas estão livres
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Parar serviços que podem estar usando as portas
sudo systemctl stop nginx
sudo systemctl stop apache2

# Tentar novamente
docker stack deploy -c traefik.yaml traefik
```

### **Se a rede proxy não existir:**
```bash
# Criar rede
docker network create proxy

# Verificar se foi criada
docker network ls | grep proxy
```

### **Se os volumes não existirem:**
```bash
# Criar volumes
docker volume create volume_swarm_shared
docker volume create volume_swarm_certificates

# Verificar volumes
docker volume ls
```

## 📊 **Verificação Final**

```bash
# Status completo
echo "=== DOCKER STATUS ==="
docker ps

echo ""
echo "=== TRAEFIK STATUS ==="
docker ps | grep traefik

echo ""
echo "=== NETWORK STATUS ==="
docker network ls | grep proxy

echo ""
echo "=== VOLUME STATUS ==="
docker volume ls | grep volume_swarm

echo ""
echo "=== PORT STATUS ==="
netstat -tlnp | grep -E ":(80|443)"

echo ""
echo "=== TRAEFIK LOGS ==="
docker logs $(docker ps -qf "name=traefik_traefik") --tail 10
```

## 🚨 **Problemas Comuns**

### **1. Porta 80/443 já em uso**
```bash
# Ver o que está usando
sudo lsof -i :80
sudo lsof -i :443

# Parar serviços conflitantes
sudo systemctl stop nginx
sudo systemctl stop apache2
sudo pkill -f nginx
sudo pkill -f apache2
```

### **2. Traefik não consegue acessar Docker socket**
```bash
# Verificar permissões
ls -la /var/run/docker.sock

# Corrigir permissões se necessário
sudo chmod 666 /var/run/docker.sock
```

### **3. Rede proxy não existe**
```bash
# Criar rede
docker network create proxy

# Verificar se foi criada
docker network inspect proxy
```

## ✅ **Checklist Final**

- [ ] Docker está rodando
- [ ] Traefik está rodando (docker ps | grep traefik)
- [ ] Rede 'proxy' existe (docker network ls | grep proxy)
- [ ] Volumes existem (docker volume ls | grep volume_swarm)
- [ ] Portas 80/443 estão livres
- [ ] Arquivo .env está configurado
- [ ] Aplicação foi deployada

## 🎯 **Comando Rápido para Deploy**

```bash
# Execute este comando completo no servidor:
cd /home/mapa-dna && \
git pull origin master && \
cp env.traefik .env && \
echo "Edite o .env com suas configurações!" && \
nano .env && \
sudo ./deploy-complete.sh
```
