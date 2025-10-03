# Matrix Mind Path - Backend Seguro

## 🔒 Arquitetura de Segurança

Esta solução implementa uma arquitetura segura que protege a chave da OpenAI no backend, evitando exposição no frontend.

### 🏗️ Estrutura da Solução

```
matrix-mind-path/
├── src/                     # Frontend React
│   └── services/
│       └── openaiService.ts # Chama backend (não mais OpenAI diretamente)
├── server/                  # Backend Node.js/Express
│   ├── package.json
│   ├── server.js            # API que intermedia chamadas OpenAI
│   ├── .env                 # Variáveis de ambiente (não commitado)
│   └── Dockerfile
├── docker-compose.yml       # Orquestração completa
├── Dockerfile.frontend      # Build seguro do frontend
├── nginx.conf              # Configuração Nginx
└── .env.example            # Template de variáveis
```

## 🚀 Como Usar

### 1. Configuração Inicial

```bash
# 1. Configure a chave da OpenAI
cp .env.example .env
# Edite o arquivo .env e insira sua chave real da OpenAI

# 2. Configure o backend
cp server/.env.example server/.env
# Edite server/.env com suas configurações
```

### 2. Desenvolvimento Local

#### Opção A: Executar Separadamente

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
npm install
npm run dev
```

#### Opção B: Docker Compose (Recomendado)

```bash
# Build e execução completa
docker-compose up --build

# Apenas execução (após primeiro build)
docker-compose up
```

### 3. Produção

```bash
# Deploy com Docker
docker-compose -f docker-compose.yml up -d

# Ou build individual
docker build -f Dockerfile.frontend -t matrix-mind-frontend .
docker build -f server/Dockerfile -t matrix-mind-backend ./server
```

## 🔧 Configuração de Variáveis de Ambiente

### Arquivo `.env` (Raiz do projeto)
```env
OPENAI_API_KEY=sk-proj-sua-chave-openai-aqui
FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3002
NODE_ENV=production
PORT=3002
```

### Arquivo `server/.env` (Backend)
```env
OPENAI_API_KEY=sk-proj-sua-chave-openai-aqui
PORT=3002
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🛡️ Benefícios de Segurança

### ❌ Antes (Inseguro)
```typescript
// Frontend exposto - chave visível no browser
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
});
```

### ✅ Agora (Seguro)
```typescript
// Frontend seguro - apenas chama nosso backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
fetch(`${BACKEND_URL}/api/oracle/generate`, {
  method: 'POST',
  body: JSON.stringify(data)
});
```

## 🔍 Endpoints da API

### Backend API (Porta 3002)

#### `GET /api/health`
Health check do backend
```bash
curl http://localhost:3002/api/health
```

#### `POST /api/oracle/generate`
Gera revelação do Oráculo
```bash
curl -X POST http://localhost:3002/api/oracle/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "birthDate": "1990-01-01",
    "question1": "Insatisfeito com trabalho atual",
    "question2": "Quero ganhar R$ 5000/mês",
    "money": 1500,
    "achievements": ["meta1", "meta2"],
    "currentStep": 5,
    "monthlyPotential": 5000
  }'
```

## 🐳 Docker

### Comandos Úteis

```bash
# Build completo
docker-compose build

# Executar em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Rebuild específico
docker-compose build backend
docker-compose build frontend
```

### Volumes e Persistência
- Logs: mapeados para o host
- Configuração: via variáveis de ambiente
- Código: copiado durante build (não development volumes)

## 🔧 Troubleshooting

### Problema: Porta 3002 ocupada
```bash
# Verificar processo usando a porta
netstat -ano | findstr :3002

# Matar processo (Windows)
taskkill /PID <PID> /F

# Ou alterar porta no .env
PORT=3003
```

### Problema: Erro de CORS
Verifique se `FRONTEND_URL` no backend está correto:
```env
FRONTEND_URL=http://localhost:5173
```

### Problema: OpenAI API Key inválida
1. Verifique se a chave está correta em `.env`
2. Teste a chave diretamente:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 📦 Deploy em Produção

### 1. Preparação
```bash
# Criar .env de produção
cp .env.example .env.prod

# Configurar URLs de produção
FRONTEND_URL=https://seu-dominio.com
VITE_BACKEND_URL=https://api.seu-dominio.com
```

### 2. Build Seguro
```bash
# Frontend com backend URL correto
docker build --build-arg VITE_BACKEND_URL=https://api.seu-dominio.com \
  -f Dockerfile.frontend -t frontend:prod .

# Backend
docker build -f server/Dockerfile -t backend:prod ./server
```

### 3. Deploy
```bash
# Com variáveis de produção
docker-compose --env-file .env.prod up -d
```

## 🚨 Segurança em Produção

### Checklist de Segurança
- [ ] ✅ Chave OpenAI apenas no backend
- [ ] ✅ HTTPS obrigatório em produção
- [ ] ✅ Headers de segurança configurados
- [ ] ✅ Rate limiting implementado
- [ ] ✅ Logs de auditoria
- [ ] ✅ Usuários não-root nos containers
- [ ] ✅ Health checks configurados

### Headers de Segurança (Nginx)
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'";
```

## 📚 Próximos Passos

1. **Monitoramento**: Implementar logs estruturados
2. **Cache**: Redis para cache de respostas
3. **Rate Limiting**: Proteção contra abuse
4. **CI/CD**: Pipeline automatizado
5. **Testes**: Cobertura completa da API

## 💡 Dicas de Desenvolvimento

### Hot Reload
```bash
# Backend com nodemon
cd server && npm run dev

# Frontend com Vite
npm run dev
```

### Debug
```javascript
// Backend: adicionar logs
console.log('Received data:', JSON.stringify(data, null, 2));

// Frontend: verificar network tab
console.log('Backend URL:', BACKEND_URL);
```

### Teste Local da API
```bash
# Teste health check
curl http://localhost:3002/api/health

# Teste geração (com dados mock)
node -e "
const data = { name: 'Test', birthDate: '1990-01-01', question1: 'test', question2: 'test' };
fetch('http://localhost:3002/api/oracle/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
}).then(r => r.json()).then(console.log);
"
```

---

**🎯 Resultado**: Agora sua chave da OpenAI está segura no backend e não é mais exposta no frontend!
