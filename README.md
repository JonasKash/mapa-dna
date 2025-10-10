# 🧬 Mapa da Grana - DNA Financeiro Matrix

Aplicação web para análise do DNA Financeiro através da Numerologia Matrix.

## 🚀 Deploy Rápido

### Pré-requisitos
- Ubuntu/Debian VPS
- Acesso root
- Domínio configurado

### Deploy Automático

```bash
# Clone o repositório
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna

# Execute o deploy
chmod +x deploy.sh
./deploy.sh
```

### Deploy Manual

```bash
# 1. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 3. Configurar SSL
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/cert.key \
    -out ssl/cert.pem \
    -subj "/C=BR/ST=MG/L=Belo Horizonte/O=MapaDNA/OU=IT/CN=www.lp.mapadnafinanceiro.com/emailAddress=admin@mapadnafinanceiro.com"

# 4. Configurar firewall
ufw enable
ufw allow ssh
ufw allow 80
ufw allow 443

# 5. Iniciar aplicação
docker-compose up -d
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
# Backend
PORT=3002
NODE_ENV=production
OPENAI_API_KEY=sua_chave_openai_aqui
WEBHOOK_URL=https://wbn.araxa.app/webhook/mapa-dna-financeiro
CORS_ORIGIN=https://www.lp.mapadnafinanceiro.com

# Frontend
VITE_API_URL=https://www.lp.mapadnafinanceiro.com/api
```

## 📱 Acesso

- **Site**: https://www.lp.mapadnafinanceiro.com
- **API**: https://www.lp.mapadnafinanceiro.com/api
- **Health Check**: https://www.lp.mapadnafinanceiro.com/health

## 🐳 Containers

- **frontend**: React/Vite aplicação
- **backend**: Node.js/Express API
- **nginx**: Proxy reverso com SSL

## 📊 Monitoramento

```bash
# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Parar aplicação
docker-compose down
```

## 🔐 SSL

O deploy inclui certificado SSL auto-assinado. Para SSL real:

1. **Let's Encrypt**:
```bash
apt install certbot
certbot certonly --standalone -d www.lp.mapadnafinanceiro.com
```

2. **Cloudflare**: Configure no painel do Cloudflare

## 🛠️ Desenvolvimento Local

```bash
# Frontend
npm install
npm run dev

# Backend
cd server
npm install
npm start
```

## 📋 Tecnologias

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, CORS
- **Deploy**: Docker, Docker Compose, Nginx
- **SSL**: OpenSSL, Let's Encrypt