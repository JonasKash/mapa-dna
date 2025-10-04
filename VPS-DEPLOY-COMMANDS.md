# 🚀 Comandos para Deploy no VPS

## 📋 Sequência de Comandos Após `git pull`

### 1. **Conectar no VPS**
```bash
ssh root@seu-servidor-ip
```

### 2. **Navegar para o Diretório do Projeto**
```bash
cd /www/mapa-dna
```

### 3. **Atualizar do GitHub**
```bash
git pull origin master
```

### 4. **Criar/Atualizar Arquivo .env**
```bash
cat > .env << 'EOF'
NODE_ENV=production
PORT=3002
OPENAI_API_KEY=sk-proj-sua-chave-aqui
VITE_BACKEND_URL=https://api.mapadnafinanceiro.com
FRONTEND_URL=https://mapadnafinanceiro.com
WEBHOOK_URL=https://wbn.mapadnafinanceiro.com/webhook/mapa-dna-financeiro
WEBHOOK_SECRET=sua-chave-secreta-aqui
DOMAIN=mapadnafinanceiro.com
EOF
```

### 5. **Parar Containers Atuais**
```bash
docker-compose -f docker-compose.prod.yml down
```

### 6. **Rebuild das Imagens (se necessário)**
```bash
# Rebuild do backend
docker build -t mapadna/backend:latest ./server

# Rebuild do frontend
docker build -t mapadna/frontend:latest -f Dockerfile.frontend .
```

### 7. **Iniciar Containers**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 8. **Verificar Status dos Containers**
```bash
docker-compose -f docker-compose.prod.yml ps
```

### 9. **Verificar Logs (se necessário)**
```bash
# Logs do backend
docker-compose -f docker-compose.prod.yml logs backend

# Logs do frontend
docker-compose -f docker-compose.prod.yml logs frontend

# Logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f
```

### 10. **Testar Aplicação**
```bash
# Testar backend
curl https://api.mapadnafinanceiro.com/api/health

# Testar frontend
curl https://mapadnafinanceiro.com
```

## 🔧 Comandos de Manutenção

### **Reiniciar Apenas um Serviço**
```bash
# Reiniciar apenas backend
docker-compose -f docker-compose.prod.yml restart backend

# Reiniciar apenas frontend
docker-compose -f docker-compose.prod.yml restart frontend
```

### **Verificar Uso de Recursos**
```bash
docker stats
```

### **Limpar Containers/Imagens Antigas**
```bash
# Remover containers parados
docker container prune -f

# Remover imagens não utilizadas
docker image prune -f

# Remover volumes não utilizados
docker volume prune -f
```

### **Backup do Projeto**
```bash
# Criar backup
tar -czf backup-mapa-dna-$(date +%Y%m%d).tar.gz /www/mapa-dna

# Restaurar backup
tar -xzf backup-mapa-dna-YYYYMMDD.tar.gz -C /
```

## 🚨 Comandos de Emergência

### **Se algo der errado:**
```bash
# Parar tudo
docker-compose -f docker-compose.prod.yml down

# Voltar para versão anterior
git log --oneline -5
git reset --hard COMMIT_ANTERIOR

# Reiniciar
docker-compose -f docker-compose.prod.yml up -d
```

### **Verificar Espaço em Disco**
```bash
df -h
```

### **Verificar Memória**
```bash
free -h
```

## 📊 Monitoramento

### **Status dos Serviços**
```bash
# Status geral
docker-compose -f docker-compose.prod.yml ps

# Status detalhado
docker ps -a
```

### **Logs em Tempo Real**
```bash
# Todos os serviços
docker-compose -f docker-compose.prod.yml logs -f

# Apenas backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Apenas frontend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

## ✅ Checklist de Deploy

- [ ] Conectado no VPS
- [ ] Navegado para `/www/mapa-dna`
- [ ] Executado `git pull origin master`
- [ ] Criado/atualizado arquivo `.env`
- [ ] Parado containers com `docker-compose down`
- [ ] Iniciado containers com `docker-compose up -d`
- [ ] Verificado status com `docker-compose ps`
- [ ] Testado aplicação nos domínios
- [ ] Verificado logs se necessário

## 🎯 URLs de Teste

- **Frontend**: https://mapadnafinanceiro.com
- **Backend API**: https://api.mapadnafinanceiro.com/api/health
- **Webhook**: https://wbn.mapadnafinanceiro.com/webhook/mapa-dna-financeiro