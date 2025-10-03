# 🚀 Deploy do Matrix Mind Path na VPS

Este guia explica como fazer o deploy do projeto Matrix Mind Path em uma VPS usando Docker.

## 📋 Pré-requisitos

- VPS com Ubuntu 20.04+ ou Debian 11+
- Acesso root ou sudo
- Domínio configurado (opcional, para SSL)

## 🔧 Instalação Rápida

### 1. Instalar Dependências do Sistema

```bash
# Fazer download dos scripts
wget https://raw.githubusercontent.com/seu-usuario/matrix-mind-path/main/install-dependencies.sh
chmod +x install-dependencies.sh

# Executar como root
sudo ./install-dependencies.sh
```

### 2. Configurar o Projeto

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/matrix-mind-path.git
cd matrix-mind-path

# Configurar variáveis de ambiente
cp env.production.example .env.production
nano .env.production
```

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env.production`:

```bash
# Production Environment Variables
NODE_ENV=production

# Domain Configuration
DOMAIN=seu-dominio.com

# OpenAI Configuration
OPENAI_API_KEY=sua_chave_openai_aqui

# Backend Configuration
PORT=3002
FRONTEND_URL=https://seu-dominio.com

# Security
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=86400000

# SSL Configuration
SSL_EMAIL=seu-email@exemplo.com
```

### 4. Fazer Deploy

```bash
# Tornar scripts executáveis
chmod +x *.sh

# Fazer deploy
./deploy.sh
```

### 5. Configurar SSL (Opcional)

```bash
# Configurar SSL com Let's Encrypt
sudo ./setup-ssl.sh seu-dominio.com
```

## 📊 Monitoramento

```bash
# Executar monitoramento
./monitor.sh
```

## 🔧 Comandos Úteis

### Gerenciar Containers

```bash
# Ver status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar containers
docker-compose -f docker-compose.prod.yml down

# Reiniciar containers
docker-compose -f docker-compose.prod.yml restart

# Atualizar aplicação
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Verificar Saúde da Aplicação

```bash
# Backend
curl http://localhost:3002/api/health

# Frontend
curl http://localhost/

# Rate Limiting
curl http://localhost:3002/api/rate-limit/status
```

### Logs

```bash
# Logs do backend
docker-compose -f docker-compose.prod.yml logs backend

# Logs do frontend
docker-compose -f docker-compose.prod.yml logs frontend

# Logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔒 Segurança

### Firewall

```bash
# Verificar status
ufw status

# Configurar regras
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
```

### SSL

```bash
# Verificar certificados
certbot certificates

# Renovar certificados
certbot renew

# Testar renovação
certbot renew --dry-run
```

## 📈 Monitoramento de Recursos

```bash
# Uso de CPU e memória
docker stats

# Uso de disco
df -h

# Processos
htop
```

## 🚨 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose -f docker-compose.prod.yml logs

# Verificar configuração
docker-compose -f docker-compose.prod.yml config
```

### Problemas de SSL

```bash
# Verificar certificados
certbot certificates

# Testar configuração do Nginx
nginx -t

# Recarregar Nginx
systemctl reload nginx
```

### Problemas de Rate Limiting

```bash
# Verificar status
curl http://localhost:3002/api/rate-limit/status

# Limpar cache (se necessário)
docker-compose -f docker-compose.prod.yml restart backend
```

## 📝 Estrutura de Arquivos

```
matrix-mind-path/
├── server/                 # Backend API
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── src/                    # Frontend React
├── docker-compose.prod.yml # Configuração de produção
├── deploy.sh              # Script de deploy
├── install-dependencies.sh # Instalação de dependências
├── setup-ssl.sh           # Configuração de SSL
├── monitor.sh             # Monitoramento
└── README-DEPLOY.md       # Este arquivo
```

## 🔄 Atualizações

```bash
# Atualizar código
git pull origin main

# Rebuild e restart
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs: `./monitor.sh`
2. Verifique o status dos containers: `docker-compose -f docker-compose.prod.yml ps`
3. Verifique os health checks: `curl http://localhost:3002/api/health`

## 🎯 URLs Importantes

- **Frontend**: `http://localhost` ou `https://seu-dominio.com`
- **Backend API**: `http://localhost:3002` ou `https://seu-dominio.com/api`
- **Health Check**: `http://localhost:3002/api/health`
- **Rate Limiting Status**: `http://localhost:3002/api/rate-limit/status`
