# 🚀 Instruções Completas de Instalação - Mapa da Grana

## 📋 Pré-requisitos

### Software Necessário
- **Node.js** (versão 18 ou superior)
- **npm** (vem com Node.js)
- **Git**
- **Docker** e **Docker Compose** (opcional, para deploy)

### Verificar Instalações
```bash
node --version
npm --version
git --version
docker --version
docker-compose --version
```

## 🔧 Instalação Local (Desenvolvimento)

### 1. Clonar o Repositório
```bash
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna
```

### 2. Instalar Dependências do Frontend
```bash
npm install
```

### 3. Instalar Dependências do Backend
```bash
cd server
npm install
cd ..
```

### 4. Configurar Variáveis de Ambiente

#### Frontend (.env na raiz do projeto)
```bash
# Criar arquivo .env na raiz
touch .env
```

Adicionar ao arquivo `.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Mapa da Grana
```

#### Backend (server/.env)
```bash
# Criar arquivo .env no diretório server
cd server
touch .env
```

Adicionar ao arquivo `server/.env`:
```env
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=sua_chave_openai_aqui
WEBHOOK_URL=sua_url_webhook_aqui
WEBHOOK_SECRET=seu_secret_webhook_aqui
CORS_ORIGIN=http://localhost:5173
```

### 5. Executar o Projeto

#### Opção 1: Executar Separadamente

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Opção 2: Executar com Docker (Recomendado)
```bash
# Na raiz do projeto
docker-compose -f docker-compose.simple.yml up --build
```

### 6. Acessar a Aplicação
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🐳 Deploy com Docker

### Deploy Simples (Desenvolvimento/Teste)
```bash
# Clonar o repositório
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna

# Configurar variáveis de ambiente
cp env.traefik .env
# Editar .env com suas configurações

# Executar com Docker Compose
docker-compose -f docker-compose.simple.yml up -d --build
```

### Deploy em Produção
```bash
# 1. Configurar domínio e SSL
# 2. Configurar variáveis de ambiente de produção
# 3. Executar deploy
docker-compose -f docker-compose.simple.yml up -d --build
```

## 📁 Estrutura do Projeto

```
mapa-dna/
├── src/                          # Frontend React/TypeScript
│   ├── components/               # Componentes React
│   │   ├── steps/               # Componentes dos passos do funil
│   │   └── ui/                  # Componentes UI (shadcn/ui)
│   ├── contexts/                # Contextos React
│   ├── hooks/                   # Hooks customizados
│   ├── services/                # Serviços (API calls)
│   └── pages/                   # Páginas da aplicação
├── server/                      # Backend Node.js/Express
│   ├── server.js               # Servidor principal
│   └── package.json            # Dependências do backend
├── public/                      # Arquivos estáticos
├── docker-compose.simple.yml    # Configuração Docker simples
├── Dockerfile.frontend         # Dockerfile do frontend
├── nginx-simple.conf           # Configuração Nginx
└── package.json                # Dependências do frontend
```

## 🔧 Scripts Disponíveis

### Frontend
```bash
npm run dev          # Executar em modo desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executar linter
```

### Backend
```bash
npm start            # Executar servidor
npm run dev          # Executar com nodemon (desenvolvimento)
```

## 🛠️ Comandos Úteis

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar linter
npm run lint
```

### Docker
```bash
# Build das imagens
docker-compose -f docker-compose.simple.yml build

# Executar containers
docker-compose -f docker-compose.simple.yml up -d

# Ver logs
docker-compose -f docker-compose.simple.yml logs -f

# Parar containers
docker-compose -f docker-compose.simple.yml down

# Rebuild completo
docker-compose -f docker-compose.simple.yml down
docker-compose -f docker-compose.simple.yml up -d --build
```

### Git
```bash
# Atualizar projeto
git pull origin master

# Ver status
git status

# Adicionar mudanças
git add .

# Commit
git commit -m "Sua mensagem"

# Push
git push origin master
```

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Erro de Porta em Uso
```bash
# Verificar processos na porta
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Matar processo (Windows)
taskkill /PID <PID> /F
```

#### 2. Erro de Dependências
```bash
# Limpar cache do npm
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

#### 3. Erro de Docker
```bash
# Limpar containers e imagens
docker system prune -a

# Rebuild completo
docker-compose -f docker-compose.simple.yml down
docker-compose -f docker-compose.simple.yml up -d --build
```

#### 4. Erro de Variáveis de Ambiente
- Verificar se os arquivos `.env` existem
- Verificar se as variáveis estão corretas
- Reiniciar o servidor após mudanças no `.env`

## 📞 Suporte

### Logs e Debug
```bash
# Logs do Docker
docker-compose -f docker-compose.simple.yml logs -f

# Logs do backend
cd server && npm run dev

# Logs do frontend
npm run dev
```

### Verificar Status
```bash
# Status dos containers
docker-compose -f docker-compose.simple.yml ps

# Health check da API
curl http://localhost:3001/health

# Verificar se o frontend está rodando
curl http://localhost:5173
```

## 🎯 Próximos Passos

1. **Configurar OpenAI API Key** (opcional)
2. **Configurar Webhook** (opcional)
3. **Personalizar design** conforme necessário
4. **Configurar domínio** para produção
5. **Configurar SSL** para produção

---

**Desenvolvido com ❤️ por [JonasKash](https://github.com/JonasKash)**
