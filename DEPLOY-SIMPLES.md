# 🚀 Deploy Simples - Mapa da Grana

## ⚡ **COMANDOS RÁPIDOS (Execute no servidor)**

### **1. Preparar o servidor:**
```bash
# Conectar no servidor
ssh root@seu-servidor

# Parar Traefik (se estiver rodando)
docker stack rm traefik 2>/dev/null || true

# Parar serviços que usam portas 80/443
systemctl stop nginx apache2 2>/dev/null || true
pkill -f nginx apache2 2>/dev/null || true
```

### **2. Deploy da aplicação:**
```bash
# Navegar para o projeto
cd /home/mapa-dna

# Atualizar código
git pull origin master

# Criar .env
cp env.traefik .env
nano .env  # Editar com suas configurações

# Deploy simples
chmod +x deploy-simple.sh
sudo ./deploy-simple.sh
```

### **3. Verificar se funcionou:**
```bash
# Ver containers rodando
docker ps

# Testar site
curl https://lp.mapadnafinanceiro.com/health
curl https://lp.mapadnafinanceiro.com/api/health

# Ver logs
docker-compose -f docker-compose.simple.yml logs -f
```

## 🎯 **COMANDO ÚNICO (Tudo em um)**

```bash
cd /home/mapa-dna && \
git pull origin master && \
cp env.traefik .env && \
echo "Edite o .env com suas configurações!" && \
nano .env && \
chmod +x deploy-simple.sh && \
sudo ./deploy-simple.sh
```

## 📊 **O que este deploy faz:**

1. **Para Traefik** (que estava dando problema)
2. **Usa Nginx direto** (mais simples e confiável)
3. **Cria certificados SSL temporários** (funciona imediatamente)
4. **Deploy em 3 containers:**
   - Frontend (porta 8080)
   - Backend (porta 3002)
   - Nginx (portas 80/443)

## 🔧 **Configurações do .env:**

```env
# URLs para domínio
FRONTEND_URL=https://www.lp.mapadnafinanceiro.com
VITE_BACKEND_URL=https://www.lp.mapadnafinanceiro.com
CORS_ORIGIN=https://www.lp.mapadnafinanceiro.com

# OpenAI API Key (substitua pela sua chave real)
OPENAI_API_KEY=sk-proj-sua-chave-aqui

# Webhook
WEBHOOK_URL=https://wbn.araxa.app/webhook/mapa-dna-financeiro
WEBHOOK_SECRET=seu-secret-aqui

# Node.js
NODE_ENV=production
PORT=3002
```

## 🚨 **Se der erro:**

### **Erro de porta ocupada:**
```bash
# Ver o que está usando a porta
sudo lsof -i :80
sudo lsof -i :443

# Parar serviços
sudo systemctl stop nginx apache2
sudo pkill -f nginx apache2
```

### **Erro de permissão:**
```bash
# Executar como root
sudo su
./deploy-simple.sh
```

### **Erro de Docker:**
```bash
# Reiniciar Docker
systemctl restart docker
```

## ✅ **Verificação final:**

```bash
# Status dos containers
docker ps

# Testar endpoints
curl http://localhost:8080  # Frontend
curl http://localhost:3002/health  # Backend
curl http://localhost  # Nginx

# Testar domínio
curl https://lp.mapadnafinanceiro.com/health
```

## 🔄 **Comandos de manutenção:**

```bash
# Ver logs
docker-compose -f docker-compose.simple.yml logs -f

# Parar aplicação
docker-compose -f docker-compose.simple.yml down

# Reiniciar aplicação
docker-compose -f docker-compose.simple.yml restart

# Atualizar aplicação
git pull origin master
docker-compose -f docker-compose.simple.yml up -d --build
```

## 🎉 **Resultado esperado:**

- ✅ Site funcionando em: `https://lp.mapadnafinanceiro.com`
- ✅ API funcionando em: `https://lp.mapadnafinanceiro.com/api`
- ✅ Health check: `https://lp.mapadnafinanceiro.com/health`
- ✅ SSL funcionando (certificado temporário)
- ✅ Sem conflitos de porta
- ✅ Deploy em menos de 5 minutos
