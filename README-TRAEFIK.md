# 🔄 Deploy com Traefik - lp.mapadnafinanceiro.com

Este guia mostra como fazer o deploy do projeto Mapa da Grana usando o **Traefik** existente no servidor.

**Domínio:** lp.mapadnafinanceiro.com  
**Proxy:** Traefik (portas 80/443)  
**SSL:** Let's Encrypt automático

## 🎯 Solução com Traefik

- ✅ **Usa Traefik existente** - Sem conflitos de porta
- ✅ **SSL automático** - Let's Encrypt via Traefik
- ✅ **Domínio limpo** - lp.mapadnafinanceiro.com sem porta
- ✅ **Integração perfeita** - Labels do Traefik

## 🏗️ Arquitetura

```
Internet → Traefik (80/443) → Frontend (80) → Backend (3002)
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
chmod +x deploy-traefik.sh

# Executar deploy
sudo ./deploy-traefik.sh
```

## 📋 Configurações

| Serviço | Porta | Acesso |
|---------|-------|---------|
| **Traefik** | 80/443 | lp.mapadnafinanceiro.com |
| **Frontend** | 80 | localhost |
| **Backend** | 3002 | localhost:3002 |

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
# Usar o compose com Traefik
docker-compose -f docker-compose.traefik.yml up -d --build

# Verificar status
docker-compose -f docker-compose.traefik.yml ps
```

## 🔒 SSL Automático

O Traefik configurará automaticamente o SSL com Let's Encrypt:

- **Email**: contato@mapadnafinanceiro.com
- **Certificado**: Automático
- **Renovação**: Automática
- **Storage**: /etc/traefik/letsencrypt/acme.json

## 📊 Comandos de Manutenção

### Verificar Status
```bash
# Status dos containers
docker-compose -f docker-compose.traefik.yml ps

# Health checks
curl http://lp.mapadnafinanceiro.com/health
curl https://lp.mapadnafinanceiro.com/health
curl https://lp.mapadnafinanceiro.com/api/health
```

### Logs
```bash
# Todos os logs
docker-compose -f docker-compose.traefik.yml logs -f

# Logs específicos
docker-compose -f docker-compose.traefik.yml logs -f backend
docker-compose -f docker-compose.traefik.yml logs -f frontend
```

### Atualizações
```bash
# Atualizar código
git pull origin main

# Rebuild e restart
docker-compose -f docker-compose.traefik.yml up -d --build
```

## 🔧 Configuração do Traefik

### Labels Configuradas

```yaml
labels:
  # Habilitar Traefik
  - "traefik.enable=true"
  
  # Rede do Traefik
  - "traefik.docker.network=painel"
  
  # Frontend HTTP (redireciona para HTTPS)
  - "traefik.http.routers.mapadna-http.rule=Host(`lp.mapadnafinanceiro.com`)"
  - "traefik.http.routers.mapadna-http.entrypoints=web"
  - "traefik.http.routers.mapadna-http.middlewares=redirect-https"
  
  # Frontend HTTPS
  - "traefik.http.routers.mapadna-https.rule=Host(`lp.mapadnafinanceiro.com`)"
  - "traefik.http.routers.mapadna-https.entrypoints=websecure"
  - "traefik.http.routers.mapadna-https.tls.certresolver=letsencryptresolver"
  
  # API HTTPS
  - "traefik.http.routers.mapadna-api-https.rule=Host(`lp.mapadnafinanceiro.com`) && PathPrefix(`/api`)"
  - "traefik.http.routers.mapadna-api-https.entrypoints=websecure"
  - "traefik.http.routers.mapadna-api-https.tls.certresolver=letsencryptresolver"
```

## 🌐 Acesso à Aplicação

Após o deploy, a aplicação estará disponível em:

- **Frontend**: https://lp.mapadnafinanceiro.com
- **API**: https://lp.mapadnafinanceiro.com/api/
- **Health Check**: https://lp.mapadnafinanceiro.com/health

## 🚨 Troubleshooting

### Traefik não está rodando
```bash
# Verificar se o Traefik está ativo
docker ps | grep traefik

# Iniciar o Traefik se necessário
docker stack deploy -c traefik.yaml traefik
```

### Rede 'painel' não existe
```bash
# Criar a rede
docker network create painel
```

### Container não inicia
```bash
# Ver logs detalhados
docker-compose -f docker-compose.traefik.yml logs container-name

# Rebuild forçado
docker-compose -f docker-compose.traefik.yml up -d --build --force-recreate
```

### Problemas de SSL
```bash
# Verificar certificados no Traefik
docker exec -it traefik_traefik.1.xxx cat /etc/traefik/letsencrypt/acme.json

# Verificar logs do Traefik
docker logs traefik_traefik.1.xxx
```

### Erro 404 Not Found
```bash
# Verificar se o domínio está apontando para o IP correto
nslookup lp.mapadnafinanceiro.com

# Verificar se o container está rodando
docker-compose -f docker-compose.traefik.yml ps

# Verificar logs do Traefik
docker logs traefik_traefik.1.xxx
```

## 📈 Vantagens do Traefik

- ✅ **Sem conflitos** - Usa Traefik existente
- ✅ **SSL automático** - Let's Encrypt integrado
- ✅ **Domínio limpo** - lp.mapadnafinanceiro.com sem porta
- ✅ **Load balancing** - Fácil escalar serviços
- ✅ **Dashboard** - Monitoramento via Traefik

## 🔄 Migração de Outros Deploys

Se você já tem o projeto rodando em outras configurações:

```bash
# Parar containers atuais
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.proxy.yml down
docker-compose -f docker-compose.alternative.yml down

# Iniciar com Traefik
docker-compose -f docker-compose.traefik.yml up -d --build
```

---

**🎉 Agora o projeto funcionará perfeitamente em lp.mapadnafinanceiro.com usando o Traefik existente!**
