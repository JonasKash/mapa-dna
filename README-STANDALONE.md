# 🚀 Deploy Standalone - lp.mapadnafinanceiro.com

Este guia mostra como fazer o deploy do projeto Mapa da Grana em modo standalone, usando as portas padrão (80/443) sem conflitos.

**Domínio:** lp.mapadnafinanceiro.com  
**Portas:** 80 (HTTP) e 443 (HTTPS)

## 🎯 Solução para o Problema

- ✅ **Sem conflitos de porta** - Usa portas padrão liberadas
- ✅ **Domínio específico** - Configurado para lp.mapadnafinanceiro.com
- ✅ **SSL automático** - Certificados Let's Encrypt
- ✅ **Deploy simples** - Um comando apenas

## 🚀 Deploy Rápido

### 1. Clone o Repositório
```bash
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna
```

### 2. Configure o Ambiente
```bash
# Copiar configurações standalone
cp env.standalone .env

# Editar com suas configurações
nano .env
```

### 3. Deploy Automático
```bash
# Dar permissão de execução
chmod +x deploy-standalone.sh

# Executar deploy
sudo ./deploy-standalone.sh
```

## 📋 Configurações

| Serviço | Porta | Acesso |
|---------|-------|---------|
| **HTTP** | 80 | http://lp.mapadnafinanceiro.com |
| **HTTPS** | 443 | https://lp.mapadnafinanceiro.com |
| **Backend** | 3002 | http://localhost:3002 |

## 🔧 Configuração Manual

### 1. Arquivo .env
```env
# URLs para domínio standalone
FRONTEND_URL=https://lp.mapadnafinanceiro.com
VITE_BACKEND_URL=https://lp.mapadnafinanceiro.com
CORS_ORIGIN=https://lp.mapadnafinanceiro.com
```

### 2. Deploy com Docker
```bash
# Usar o compose standalone
docker-compose -f docker-compose.standalone.yml up -d --build

# Verificar status
docker-compose -f docker-compose.standalone.yml ps
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
docker-compose -f docker-compose.standalone.yml ps

# Health checks
curl http://lp.mapadnafinanceiro.com/health
curl https://lp.mapadnafinanceiro.com/health
curl https://lp.mapadnafinanceiro.com/api/health
```

### Logs
```bash
# Todos os logs
docker-compose -f docker-compose.standalone.yml logs -f

# Logs específicos
docker-compose -f docker-compose.standalone.yml logs -f backend
docker-compose -f docker-compose.standalone.yml logs -f frontend
```

### Atualizações
```bash
# Atualizar código
git pull origin main

# Rebuild e restart
docker-compose -f docker-compose.standalone.yml up -d --build
```

## 🔧 Configuração do Firewall

```bash
# Permitir portas padrão
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3002/tcp

# Verificar status
sudo ufw status
```

## 🌐 Acesso à Aplicação

Após o deploy, a aplicação estará disponível em:

- **Frontend HTTP**: http://lp.mapadnafinanceiro.com
- **Frontend HTTPS**: https://lp.mapadnafinanceiro.com
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
docker-compose -f docker-compose.standalone.yml logs container-name

# Rebuild forçado
docker-compose -f docker-compose.standalone.yml up -d --build --force-recreate
```

### Problemas de SSL
```bash
# Verificar certificados
ls -la ssl/

# Testar SSL
openssl s_client -connect lp.mapadnafinanceiro.com:443 -servername lp.mapadnafinanceiro.com
```

### Erro 404 Not Found
```bash
# Verificar se o domínio está apontando para o IP correto
nslookup lp.mapadnafinanceiro.com

# Verificar se o container está rodando
docker-compose -f docker-compose.standalone.yml ps

# Verificar logs do nginx
docker-compose -f docker-compose.standalone.yml logs frontend
```

## 📈 Vantagens do Deploy Standalone

- ✅ **Portas padrão** - Sem problemas de firewall
- ✅ **Domínio específico** - lp.mapadnafinanceiro.com
- ✅ **SSL automático** - Certificados Let's Encrypt
- ✅ **Deploy simples** - Um comando apenas
- ✅ **Sem conflitos** - Configuração isolada

## 🔄 Migração de Outros Deploys

Se você já tem o projeto rodando em outras configurações:

```bash
# Parar containers atuais
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.alternative.yml down

# Iniciar com configuração standalone
docker-compose -f docker-compose.standalone.yml up -d --build
```

---

**🎉 Agora o projeto funcionará perfeitamente em lp.mapadnafinanceiro.com!**
