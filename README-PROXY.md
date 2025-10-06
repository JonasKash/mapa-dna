# 🔄 Deploy com Proxy Reverso - lp.mapadnafinanceiro.com

Este guia mostra como fazer o deploy do projeto Mapa da Grana usando **proxy reverso** para resolver conflitos de porta.

**Domínio:** lp.mapadnafinanceiro.com  
**Portas externas:** 80 (HTTP) e 443 (HTTPS)  
**Portas internas:** 8080/8443 (sem conflitos)

## 🎯 Solução para Conflitos de Porta

- ✅ **Proxy reverso** - Nginx externo nas portas 80/443
- ✅ **Frontend interno** - Rodando nas portas 8080/8443
- ✅ **Sem conflitos** - Docker não compete pelas portas padrão
- ✅ **Domínio limpo** - lp.mapadnafinanceiro.com sem porta

## 🏗️ Arquitetura

```
Internet → Nginx Proxy (80/443) → Frontend (8080/8443) → Backend (3002)
```

## 🚀 Deploy Rápido

### 1. Clone o Repositório
```bash
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna
```

### 2. Configure o Ambiente
```bash
# Copiar configurações
cp env.standalone .env

# Editar com suas configurações
nano .env
```

### 3. Deploy Automático
```bash
# Dar permissão de execução
chmod +x deploy-proxy.sh

# Executar deploy
sudo ./deploy-proxy.sh
```

## 📋 Configurações

| Serviço | Porta Externa | Porta Interna | Acesso |
|---------|---------------|---------------|---------|
| **Proxy** | 80/443 | - | lp.mapadnafinanceiro.com |
| **Frontend** | - | 8080/8443 | localhost:8080 |
| **Backend** | - | 3002 | localhost:3002 |

## 🔧 Configuração Manual

### 1. Arquivo .env
```env
# URLs para domínio
FRONTEND_URL=https://lp.mapadnafinanceiro.com
VITE_BACKEND_URL=https://lp.mapadnafinanceiro.com
CORS_ORIGIN=https://lp.mapadnafinanceiro.com
```

### 2. Deploy com Docker
```bash
# Usar o compose com proxy
docker-compose -f docker-compose.proxy.yml up -d --build

# Verificar status
docker-compose -f docker-compose.proxy.yml ps
```

## 🔒 Configuração SSL

### 1. Obter Certificado
```bash
# Instalar certbot
sudo apt install certbot

# Obter certificado
certbot certonly --standalone -d lp.mapadnafinanceiro.com
```

### 2. Copiar Certificados
```bash
mkdir -p ssl
sudo cp /etc/letsencrypt/live/lp.mapadnafinanceiro.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/lp.mapadnafinanceiro.com/privkey.pem ssl/
```

## 📊 Comandos de Manutenção

### Verificar Status
```bash
# Status dos containers
docker-compose -f docker-compose.proxy.yml ps

# Health checks
curl http://lp.mapadnafinanceiro.com/health
curl https://lp.mapadnafinanceiro.com/health
curl https://lp.mapadnafinanceiro.com/api/health
```

### Logs
```bash
# Todos os logs
docker-compose -f docker-compose.proxy.yml logs -f

# Logs específicos
docker-compose -f docker-compose.proxy.yml logs -f backend
docker-compose -f docker-compose.proxy.yml logs -f frontend
docker-compose -f docker-compose.proxy.yml logs -f proxy
```

### Atualizações
```bash
# Atualizar código
git pull origin main

# Rebuild e restart
docker-compose -f docker-compose.proxy.yml up -d --build
```

## 🔧 Configuração do Firewall

```bash
# Permitir portas necessárias
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 8443/tcp
sudo ufw allow 3002/tcp

# Verificar status
sudo ufw status
```

## 🌐 Acesso à Aplicação

Após o deploy, a aplicação estará disponível em:

- **Frontend**: https://lp.mapadnafinanceiro.com
- **API**: https://lp.mapadnafinanceiro.com/api/
- **Health Check**: https://lp.mapadnafinanceiro.com/health

## 🚨 Troubleshooting

### Porta já em uso
```bash
# Verificar processos nas portas
sudo lsof -i :80
sudo lsof -i :443

# Matar processo se necessário
sudo kill -9 PID_DO_PROCESSO
```

### Container não inicia
```bash
# Ver logs detalhados
docker-compose -f docker-compose.proxy.yml logs container-name

# Rebuild forçado
docker-compose -f docker-compose.proxy.yml up -d --build --force-recreate
```

### Problemas de SSL
```bash
# Verificar certificados
ls -la ssl/

# Testar SSL
openssl s_client -connect lp.mapadnafinanceiro.com:443 -servername lp.mapadnafinanceiro.com
```

### Erro 502 Bad Gateway
```bash
# Verificar se o frontend interno está rodando
curl http://localhost:8080

# Verificar logs do proxy
docker-compose -f docker-compose.proxy.yml logs proxy

# Verificar logs do frontend
docker-compose -f docker-compose.proxy.yml logs frontend
```

## 📈 Vantagens do Proxy Reverso

- ✅ **Sem conflitos** - Portas internas diferentes
- ✅ **Domínio limpo** - lp.mapadnafinanceiro.com sem porta
- ✅ **SSL centralizado** - Certificados no proxy
- ✅ **Load balancing** - Fácil escalar frontend
- ✅ **Isolamento** - Serviços separados

## 🔄 Migração de Outros Deploys

Se você já tem o projeto rodando em outras configurações:

```bash
# Parar containers atuais
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.standalone.yml down
docker-compose -f docker-compose.alternative.yml down

# Iniciar com proxy reverso
docker-compose -f docker-compose.proxy.yml up -d --build
```

---

**🎉 Agora o projeto funcionará perfeitamente em lp.mapadnafinanceiro.com sem conflitos de porta!**
