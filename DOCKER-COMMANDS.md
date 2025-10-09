# 🐳 Comandos Docker para Deploy - Mapa da Grana

## 📋 **Comandos Essenciais**

### **1. Preparação do Ambiente**

```bash
# Criar rede proxy (se não existir)
docker network create proxy

# Verificar se o Traefik está rodando
docker ps | grep traefik

# Se não estiver rodando, iniciar o Traefik
docker stack deploy -c traefik.yaml traefik
```

### **2. Deploy da Aplicação**

```bash
# Navegar para o diretório do projeto
cd /home/mapa-dna

# Atualizar código
git pull origin master

# Criar arquivo .env
cp env.traefik .env
nano .env  # Editar com suas configurações

# Deploy completo
chmod +x deploy-complete.sh
sudo ./deploy-complete.sh
```

### **3. Comandos Docker Compose**

```bash
# Build e start
docker-compose -f docker-compose.traefik.yml up -d --build

# Build forçado
docker-compose -f docker-compose.traefik.yml up -d --build --force-recreate

# Parar containers
docker-compose -f docker-compose.traefik.yml down

# Reiniciar containers
docker-compose -f docker-compose.traefik.yml restart

# Ver status
docker-compose -f docker-compose.traefik.yml ps

# Ver logs
docker-compose -f docker-compose.traefik.yml logs -f

# Ver logs específicos
docker-compose -f docker-compose.traefik.yml logs -f frontend
docker-compose -f docker-compose.traefik.yml logs -f backend
```

### **4. Comandos Docker Básicos**

```bash
# Listar containers
docker ps -a

# Listar imagens
docker images

# Listar redes
docker network ls

# Listar volumes
docker volume ls

# Limpar containers parados
docker container prune -f

# Limpar imagens não utilizadas
docker image prune -f

# Limpeza completa
docker system prune -f
```

### **5. Debugging e Troubleshooting**

```bash
# Entrar no container
docker exec -it mapadna-frontend-traefik /bin/sh
docker exec -it mapadna-backend-traefik /bin/sh

# Ver logs do Traefik
docker logs $(docker ps -qf "name=traefik_traefik") -f

# Testar conectividade
curl http://localhost:3002/health
curl http://localhost

# Verificar rede
docker network inspect proxy

# Verificar se containers estão na rede
docker inspect mapadna-frontend-traefik | grep -A 10 "Networks"
docker inspect mapadna-backend-traefik | grep -A 10 "Networks"
```

### **6. Comandos de Stack (Docker Swarm)**

```bash
# Deploy como stack
docker stack deploy -c docker-compose.traefik.yml mapadna

# Ver stacks
docker stack ls

# Ver serviços da stack
docker stack services mapadna

# Remover stack
docker stack rm mapadna
```

### **7. Monitoramento**

```bash
# Ver uso de recursos
docker stats

# Ver logs em tempo real
docker-compose -f docker-compose.traefik.yml logs -f

# Verificar health checks
docker-compose -f docker-compose.traefik.yml ps

# Testar endpoints
curl https://lp.mapadnafinanceiro.com/health
curl https://lp.mapadnafinanceiro.com/api/health
```

### **8. Backup e Restore**

```bash
# Backup das imagens
docker save mapa-dna_frontend:latest | gzip > frontend-backup.tar.gz
docker save mapa-dna_backend:latest | gzip > backend-backup.tar.gz

# Restore das imagens
docker load < frontend-backup.tar.gz
docker load < backend-backup.tar.gz
```

### **9. Atualização da Aplicação**

```bash
# Atualizar código
git pull origin master

# Rebuild e restart
docker-compose -f docker-compose.traefik.yml up -d --build

# Ou usar o script de deploy
./deploy-complete.sh
```

### **10. Comandos de Emergência**

```bash
# Parar tudo
docker-compose -f docker-compose.traefik.yml down

# Remover tudo (CUIDADO!)
docker-compose -f docker-compose.traefik.yml down -v --remove-orphans

# Rebuild completo
docker-compose -f docker-compose.traefik.yml up -d --build --force-recreate

# Reset completo (CUIDADO!)
docker system prune -a -f
```

## 🚨 **Troubleshooting**

### **Problema: Container não inicia**
```bash
# Ver logs
docker-compose -f docker-compose.traefik.yml logs container-name

# Rebuild forçado
docker-compose -f docker-compose.traefik.yml up -d --build --force-recreate
```

### **Problema: Porta já em uso**
```bash
# Verificar o que está usando a porta
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Parar serviços conflitantes
sudo systemctl stop nginx
sudo systemctl stop apache2
```

### **Problema: Rede não existe**
```bash
# Criar rede
docker network create proxy

# Verificar redes
docker network ls
```

### **Problema: SSL não funciona**
```bash
# Ver logs do Traefik
docker logs $(docker ps -qf "name=traefik_traefik") | grep -i acme

# Verificar certificados
docker exec -it $(docker ps -qf "name=traefik_traefik") ls -la /etc/traefik/letsencrypt/
```

## 📊 **Status Check**

```bash
# Verificar se tudo está funcionando
echo "=== DOCKER STATUS ==="
docker ps
echo ""
echo "=== COMPOSE STATUS ==="
docker-compose -f docker-compose.traefik.yml ps
echo ""
echo "=== NETWORK STATUS ==="
docker network ls | grep proxy
echo ""
echo "=== TRAEFIK STATUS ==="
docker ps | grep traefik
echo ""
echo "=== TEST ENDPOINTS ==="
curl -s https://lp.mapadnafinanceiro.com/health || echo "Frontend não responde"
curl -s https://lp.mapadnafinanceiro.com/api/health || echo "Backend não responde"
```
