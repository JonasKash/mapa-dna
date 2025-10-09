# 🚀 Guia Completo: Instalação do Mapa da Grana na VPS

## 📋 Pré-requisitos

- **VPS Ubuntu 20.04+** com acesso root
- **Domínio configurado** apontando para o IP da VPS
- **Acesso SSH** à VPS

## 🔧 Passo 1: Preparação da VPS

### 1.1 Conectar via SSH
```bash
ssh root@SEU_IP_VPS
```

### 1.2 Atualizar o sistema
```bash
apt update && apt upgrade -y
```

### 1.3 Instalar dependências básicas
```bash
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

## 🐳 Passo 2: Instalar Docker e Docker Compose

### 2.1 Instalar Docker
```bash
# Remover versões antigas
apt remove -y docker docker-engine docker.io containerd runc

# Adicionar repositório oficial
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Iniciar e habilitar Docker
systemctl start docker
systemctl enable docker

# Adicionar usuário ao grupo docker (opcional)
usermod -aG docker $USER
```

### 2.2 Instalar Docker Compose (versão standalone)
```bash
# Baixar versão mais recente
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)

curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Tornar executável
chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker-compose --version
```

## 📁 Passo 3: Clonar o Projeto

### 3.1 Criar diretório e clonar
```bash
cd /home
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna
```

### 3.2 Verificar arquivos
```bash
ls -la
```

## 🔐 Passo 4: Configurar SSL (Certificados)

### 4.1 Criar diretório SSL
```bash
mkdir -p ssl
```

### 4.2 Gerar certificados autoassinados (para teste)
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/cert.key \
  -out ssl/cert.pem \
  -subj "/C=BR/ST=MG/L=Belo Horizonte/O=MapaDNA/OU=IT/CN=www.lp.mapadnafinanceiro.com/emailAddress=admin@www.lp.mapadnafinanceiro.com"
```

**⚠️ IMPORTANTE**: O domínio está configurado como `www.lp.mapadnafinanceiro.com`

### 4.3 Verificar certificados
```bash
ls -la ssl/
```

## ⚙️ Passo 5: Configurar Variáveis de Ambiente

### 5.1 Criar arquivo .env
```bash
cp env.traefik .env
```

### 5.2 Editar variáveis
```bash
nano .env
```

**Conteúdo do .env:**
```env
# Backend
PORT=3002
NODE_ENV=production
OPENAI_API_KEY=sua_chave_openai_aqui
WEBHOOK_URL=https://wbn.araxa.app/webhook/mapa-dna-financeiro
WEBHOOK_SECRET=seu_secret_webhook_aqui
CORS_ORIGIN=https://www.lp.mapadnafinanceiro.com

# Frontend
VITE_API_URL=https://www.lp.mapadnafinanceiro.com/api
```

**⚠️ IMPORTANTE**: O domínio está configurado como `www.lp.mapadnafinanceiro.com`

## 🏗️ Passo 6: Build e Deploy

### 6.1 Parar containers existentes (se houver)
```bash
docker-compose -f docker-compose.simple.yml down
```

### 6.2 Remover imagens antigas (limpeza)
```bash
docker system prune -a -f
```

### 6.3 Build das imagens
```bash
docker-compose -f docker-compose.simple.yml build --no-cache
```

### 6.4 Iniciar os serviços
```bash
docker-compose -f docker-compose.simple.yml up -d
```

### 6.5 Verificar status
```bash
docker-compose -f docker-compose.simple.yml ps
```

## 🔍 Passo 7: Verificação e Testes

### 7.1 Verificar logs
```bash
# Logs gerais
docker-compose -f docker-compose.simple.yml logs -f

# Logs específicos
docker-compose -f docker-compose.simple.yml logs -f frontend
docker-compose -f docker-compose.simple.yml logs -f backend
docker-compose -f docker-compose.simple.yml logs -f nginx
```

### 7.2 Testar conectividade
```bash
# Testar backend
curl -k https://www.lp.mapadnafinanceiro.com/api/health

# Testar frontend
curl -k https://www.lp.mapadnafinanceiro.com
```

### 7.3 Verificar portas
```bash
netstat -tlnp | grep :80
netstat -tlnp | grep :443
```

## 🔧 Passo 8: Configuração do Firewall

### 8.1 Configurar UFW
```bash
# Habilitar firewall
ufw enable

# Permitir SSH
ufw allow ssh

# Permitir HTTP e HTTPS
ufw allow 80
ufw allow 443

# Verificar status
ufw status
```

## 📊 Passo 9: Monitoramento

### 9.1 Script de monitoramento
```bash
# Criar script de monitoramento
cat > /home/monitor.sh << 'EOF'
#!/bin/bash
echo "=== STATUS DOS CONTAINERS ==="
docker-compose -f /home/mapa-dna/docker-compose.simple.yml ps

echo -e "\n=== USO DE RECURSOS ==="
docker stats --no-stream

echo -e "\n=== ESPAÇO EM DISCO ==="
df -h

echo -e "\n=== MEMÓRIA ==="
free -h
EOF

chmod +x /home/monitor.sh
```

### 9.2 Executar monitoramento
```bash
/home/monitor.sh
```

## 🚨 Passo 10: Troubleshooting

### 10.1 Problemas Comuns

#### Container não inicia:
```bash
# Ver logs detalhados
docker-compose -f docker-compose.simple.yml logs container_name

# Rebuild específico
docker-compose -f docker-compose.simple.yml build --no-cache container_name
```

#### Erro de SSL:
```bash
# Verificar certificados
openssl x509 -in ssl/cert.pem -text -noout

# Regenerar certificados
rm ssl/cert.*
# Executar novamente o comando do Passo 4.2
```

#### Erro de CORS:
```bash
# Verificar variáveis de ambiente
docker-compose -f docker-compose.simple.yml exec backend env | grep CORS
```

### 10.2 Comandos de Manutenção

#### Reiniciar serviços:
```bash
docker-compose -f docker-compose.simple.yml restart
```

#### Atualizar aplicação:
```bash
cd /home/mapa-dna
git pull origin master
docker-compose -f docker-compose.simple.yml down
docker-compose -f docker-compose.simple.yml up -d --build
```

#### Backup:
```bash
# Backup dos dados
tar -czf backup-$(date +%Y%m%d).tar.gz /home/mapa-dna
```

## ✅ Passo 11: Verificação Final

### 11.1 Checklist de Verificação

- [ ] ✅ Docker instalado e funcionando
- [ ] ✅ Docker Compose instalado
- [ ] ✅ Projeto clonado
- [ ] ✅ Certificados SSL gerados
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Containers rodando
- [ ] ✅ Firewall configurado
- [ ] ✅ Site acessível via HTTPS
- [ ] ✅ API respondendo
- [ ] ✅ Webhook funcionando

### 11.2 Teste Final
```bash
# Teste completo
curl -k -I https://www.lp.mapadnafinanceiro.com
curl -k https://www.lp.mapadnafinanceiro.com/api/health
```

## 🎯 URLs de Acesso

Após a instalação, sua aplicação estará disponível em:

- **Frontend**: `https://www.lp.mapadnafinanceiro.com`
- **API Health**: `https://www.lp.mapadnafinanceiro.com/api/health`
- **API Oracle**: `https://www.lp.mapadnafinanceiro.com/api/oracle/generate`

## 📞 Suporte

### Logs Importantes:
```bash
# Logs em tempo real
docker-compose -f docker-compose.simple.yml logs -f

# Logs do sistema
journalctl -u docker -f
```

### Comandos de Emergência:
```bash
# Parar tudo
docker-compose -f docker-compose.simple.yml down

# Limpar tudo e recomeçar
docker system prune -a -f
docker-compose -f docker-compose.simple.yml up -d --build
```

---

**🎉 Parabéns! Sua aplicação Mapa da Grana está rodando na VPS!**

**Desenvolvido com ❤️ por [JonasKash](https://github.com/JonasKash)**
