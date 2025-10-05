# 🚀 Mapa da Grana - Deploy em Produção

## 🌐 Domínio: www.mapadnafinanceiro.com

Este guia mostra como fazer o deploy completo da aplicação Mapa da Grana em produção usando Docker.

## 📋 Pré-requisitos

- **VPS Ubuntu 20.04+** com acesso root
- **Domínio configurado** apontando para o IP do servidor
- **Docker e Docker Compose** instalados

## 🚀 Deploy Rápido (1 comando)

```bash
# Clone o repositório
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna

# Execute o script de deploy
sudo ./deploy-production.sh
```

## 📝 Configuração Manual

### 1. **Configurar Variáveis de Ambiente**

```bash
# Copiar arquivo de exemplo
cp env.production .env

# Editar configurações
nano .env
```

**Configurações importantes:**
```env
OPENAI_API_KEY=sk-proj-sua-chave-real
WEBHOOK_URL=https://n8n.mapadnafinanceiro.com/webhook/mapa-dna-financeiro
WEBHOOK_SECRET=sua-chave-secreta
```

### 2. **Configurar SSL (Let's Encrypt)**

```bash
# Instalar certbot
apt install certbot

# Obter certificado
certbot certonly --standalone -d www.mapadnafinanceiro.com

# Copiar certificados
cp /etc/letsencrypt/live/www.mapadnafinanceiro.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/www.mapadnafinanceiro.com/privkey.pem ssl/
```

### 3. **Deploy com Docker**

```bash
# Build e start
docker-compose -f docker-compose.production.yml up -d --build

# Verificar status
docker-compose -f docker-compose.production.yml ps

# Ver logs
docker-compose -f docker-compose.production.yml logs -f
```

## 🔧 Comandos de Manutenção

### **Verificar Status**
```bash
# Status dos containers
docker-compose -f docker-compose.production.yml ps

# Health checks
curl https://www.mapadnafinanceiro.com/health
curl https://www.mapadnafinanceiro.com/api/health
```

### **Logs**
```bash
# Todos os logs
docker-compose -f docker-compose.production.yml logs -f

# Logs específicos
docker-compose -f docker-compose.production.yml logs -f backend
docker-compose -f docker-compose.production.yml logs -f frontend
```

### **Atualizações**
```bash
# Atualizar código
git pull origin main

# Rebuild e restart
docker-compose -f docker-compose.production.yml up -d --build

# Ou usar o script
./deploy-production.sh
```

### **Backup**
```bash
# Backup dos volumes
docker run --rm -v mapadna_ssl_certs:/data -v $(pwd):/backup alpine tar czf /backup/backup-$(date +%Y%m%d).tar.gz -C /data .

# Backup do código
tar czf code-backup-$(date +%Y%m%d).tar.gz --exclude=node_modules --exclude=.git .
```

## 🔍 Monitoramento

### **Métricas de Performance**
```bash
# Uso de recursos
docker stats

# Espaço em disco
df -h

# Logs de acesso
tail -f logs/nginx/access.log
```

### **Alertas Automáticos**
O sistema inclui:
- ✅ Health checks automáticos
- ✅ Watchtower para atualizações
- ✅ Logs rotativos
- ✅ Rate limiting
- ✅ SSL automático

## 🛠️ Troubleshooting

### **Container não inicia**
```bash
# Ver logs detalhados
docker-compose -f docker-compose.production.yml logs container-name

# Rebuild forçado
docker-compose -f docker-compose.production.yml up -d --build --force-recreate
```

### **Problemas de SSL**
```bash
# Verificar certificados
ls -la ssl/

# Renovar certificados
certbot renew --dry-run
```

### **Problemas de memória**
```bash
# Limpar sistema Docker
docker system prune -a

# Verificar uso de memória
free -h
```

## 📊 Estrutura da Stack

```
www.mapadnafinanceiro.com
├── Frontend (Nginx + React)
│   ├── Porta 80/443
│   ├── SSL automático
│   └── Cache otimizado
├── Backend (Node.js + Express)
│   ├── Porta interna 3002
│   ├── Rate limiting
│   └── Health checks
└── Monitoramento
    ├── Watchtower
    ├── Logs centralizados
    └── Auto-updates
```

## 🔒 Segurança

### **Configurações Incluídas**
- ✅ SSL/TLS obrigatório
- ✅ Headers de segurança
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Firewall básico
- ✅ Logs de acesso

### **Recomendações Adicionais**
- 🔐 Configurar fail2ban
- 🔐 Atualizar sistema regularmente
- 🔐 Monitorar logs de acesso
- 🔐 Backup automático

## 📈 Escalabilidade

### **Para Alto Tráfego**
1. **Load Balancer**: Adicionar mais instâncias
2. **CDN**: Configurar CloudFlare
3. **Database**: Migrar para PostgreSQL
4. **Cache**: Implementar Redis
5. **Monitoring**: Prometheus + Grafana

## 🆘 Suporte

### **Comandos de Emergência**
```bash
# Parar tudo
docker-compose -f docker-compose.production.yml down

# Restart completo
docker-compose -f docker-compose.production.yml restart

# Reset total
docker-compose -f docker-compose.production.yml down -v
docker system prune -a
./deploy-production.sh
```

### **Contatos**
- **Issues**: GitHub Issues
- **Documentação**: README.md
- **Logs**: `docker-compose logs -f`

---

**🎉 Sua aplicação estará rodando em https://www.mapadnafinanceiro.com**
