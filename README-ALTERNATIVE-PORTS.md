# 🔧 Deploy em Portas Alternativas

Este guia mostra como fazer o deploy do projeto Mapa da Grana em portas alternativas para evitar conflitos com Docker e n8n.

**Domínio:** lp.mapadnafinanceiro.com

## 🚨 Problema Resolvido

- **Conflito com Docker**: Portas 80 e 443 já em uso
- **Conflito com n8n**: Portas padrão ocupadas
- **Solução**: Usar portas alternativas 8080 e 8443

## 🚀 Deploy Rápido

### 1. Clone o Repositório
```bash
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna
```

### 2. Configure o Ambiente
```bash
# Copiar configurações para portas alternativas
cp env.alternative .env

# Editar com suas configurações
nano .env
```

### 3. Deploy Automático
```bash
# Dar permissão de execução
chmod +x deploy-alternative.sh

# Executar deploy
sudo ./deploy-alternative.sh
```

## 📋 Configurações das Portas

| Serviço | Porta Original | Porta Alternativa | Acesso |
|---------|----------------|-------------------|---------|
| **HTTP** | 80 | 8080 | http://lp.mapadnafinanceiro.com:8080 |
| **HTTPS** | 443 | 8443 | https://lp.mapadnafinanceiro.com:8443 |
| **Backend** | 3002 | 3002 | http://lp.mapadnafinanceiro.com:3002 |

## 🔧 Configuração Manual

### 1. Arquivo .env
```env
# URLs para portas alternativas
FRONTEND_URL=https://lp.mapadnafinanceiro.com:8443
VITE_BACKEND_URL=https://lp.mapadnafinanceiro.com:8443
CORS_ORIGIN=https://lp.mapadnafinanceiro.com:8443
```

### 2. Deploy com Docker
```bash
# Usar o compose alternativo
docker-compose -f docker-compose.alternative.yml up -d --build

# Verificar status
docker-compose -f docker-compose.alternative.yml ps
```

## 🔒 Configuração SSL

### 1. Obter Certificado
```bash
# Instalar certbot
sudo apt install certbot

# Obter certificado (usar porta diferente se necessário)
certbot certonly --standalone -d lp.mapadnafinanceiro.com --http-01-port=8080
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
docker-compose -f docker-compose.alternative.yml ps

# Health checks
curl http://lp.mapadnafinanceiro.com:8080/health
curl https://lp.mapadnafinanceiro.com:8443/health
curl https://lp.mapadnafinanceiro.com:8443/api/health
```

### Logs
```bash
# Todos os logs
docker-compose -f docker-compose.alternative.yml logs -f

# Logs específicos
docker-compose -f docker-compose.alternative.yml logs -f backend
docker-compose -f docker-compose.alternative.yml logs -f frontend
```

### Atualizações
```bash
# Atualizar código
git pull origin main

# Rebuild e restart
docker-compose -f docker-compose.alternative.yml up -d --build
```

## 🔧 Configuração do Firewall

```bash
# Permitir portas alternativas
sudo ufw allow 8080/tcp
sudo ufw allow 8443/tcp
sudo ufw allow 3002/tcp

# Verificar status
sudo ufw status
```

## 🌐 Acesso à Aplicação

Após o deploy, a aplicação estará disponível em:

- **Frontend HTTP**: http://lp.mapadnafinanceiro.com:8080
- **Frontend HTTPS**: https://lp.mapadnafinanceiro.com:8443
- **API**: https://lp.mapadnafinanceiro.com:8443/api/
- **Health Check**: https://lp.mapadnafinanceiro.com:8443/health

## 🚨 Troubleshooting

### Porta já em uso
```bash
# Verificar processos nas portas
sudo lsof -i :8080
sudo lsof -i :8443

# Matar processo se necessário
sudo kill -9 PID_DO_PROCESSO
```

### Container não inicia
```bash
# Ver logs detalhados
docker-compose -f docker-compose.alternative.yml logs container-name

# Rebuild forçado
docker-compose -f docker-compose.alternative.yml up -d --build --force-recreate
```

### Problemas de SSL
```bash
# Verificar certificados
ls -la ssl/

# Testar SSL
openssl s_client -connect lp.mapadnafinanceiro.com:8443 -servername lp.mapadnafinanceiro.com
```

## 📈 Vantagens das Portas Alternativas

- ✅ **Sem conflitos** com Docker e n8n
- ✅ **Fácil configuração** de firewall
- ✅ **Compatibilidade** com outros serviços
- ✅ **Flexibilidade** para múltiplos projetos
- ✅ **Isolamento** de serviços

## 🔄 Migração das Portas Padrão

Se você já tem o projeto rodando nas portas padrão:

```bash
# Parar containers atuais
docker-compose -f docker-compose.production.yml down

# Iniciar com portas alternativas
docker-compose -f docker-compose.alternative.yml up -d --build
```

---

**🎉 Agora você pode rodar o projeto sem conflitos de porta!**
