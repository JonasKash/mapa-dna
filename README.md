# 🔮 Mapa da Grana - Oráculo da Prosperidade

Sistema de oráculo numerológico que gera relatórios personalizados de prosperidade financeira baseados em numerologia pitagórica e dados pessoais do usuário.

## ✨ Funcionalidades

- **Numerologia Pitagórica**: Cálculos automáticos baseados no nome e data de nascimento
- **Relatórios Personalizados**: Geração de insights financeiros únicos
- **Sistema de Fallback**: Respostas artificiais quando a API da OpenAI não está disponível
- **Interface Moderna**: Design Matrix com animações e efeitos visuais
- **Docker Ready**: Pronto para deploy em VPS com Docker Compose

## 🚀 Deploy em VPS com Docker

### Pré-requisitos

- VPS com Docker e Docker Compose instalados
- Domínio configurado (opcional)
- Certificado SSL (recomendado)

### 1. Clone o Repositório

```bash
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna
```

### 2. Configuração do Ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
# OpenAI API Key (opcional - sistema funciona sem ela)
OPENAI_API_KEY=sk-proj-sua-chave-aqui

# Configurações do servidor
NODE_ENV=production
PORT=3002

# Configurações do frontend
VITE_BACKEND_URL=https://seu-dominio.com
```

### 3. Deploy com Docker Compose

```bash
# Build e start dos containers
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Configuração do Nginx (Opcional)

Se você quiser usar um domínio personalizado, configure o Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. SSL com Let's Encrypt (Recomendado)

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🛠️ Desenvolvimento Local

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd server
npm install
cd ..

# Criar arquivo .env
cp .env.example .env
# Editar .env com suas configurações

# Executar em modo desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Frontend + Backend
npm run dev:frontend # Apenas frontend
npm run dev:backend  # Apenas backend

# Produção
npm run build        # Build do frontend
npm run start        # Iniciar em produção
```

## 📁 Estrutura do Projeto

```
mapa-dna/
├── src/                    # Frontend React/TypeScript
│   ├── components/         # Componentes React
│   ├── contexts/          # Context API
│   ├── services/          # Serviços de API
│   └── hooks/             # Custom hooks
├── server/                # Backend Node.js/Express
│   ├── server.js          # Servidor principal
│   └── package.json       # Dependências do backend
├── docker-compose.yml     # Docker Compose para desenvolvimento
├── docker-compose.prod.yml # Docker Compose para produção
├── Dockerfile.frontend    # Dockerfile do frontend
├── nginx.conf             # Configuração do Nginx
└── README.md              # Este arquivo
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `OPENAI_API_KEY` | Chave da API OpenAI | `sk-proj-test-key` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `PORT` | Porta do backend | `3002` |
| `VITE_BACKEND_URL` | URL do backend | `http://localhost:3002` |

### Rate Limiting

O sistema inclui rate limiting configurável:

```javascript
// Em server/server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Máximo 50 requisições por IP
});
```

### Webhooks

O sistema envia webhooks para eventos importantes:

- `data_collected`: Dados coletados do usuário
- `oracle_generated`: Oráculo gerado com sucesso
- `payment_click`: Clique no botão de pagamento

## 🐳 Docker

### Desenvolvimento

```bash
docker-compose up -d
```

### Produção

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Comandos Úteis

```bash
# Rebuild containers
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar containers
docker-compose -f docker-compose.prod.yml down

# Limpar volumes
docker-compose -f docker-compose.prod.yml down -v
```

## 🔍 Monitoramento

### Health Check

```bash
# Backend
curl http://localhost:3002/api/health

# Frontend
curl http://localhost:3000
```

### Logs

```bash
# Todos os containers
docker-compose -f docker-compose.prod.yml logs -f

# Apenas backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Apenas frontend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 PID
   ```

2. **Erro de permissão Docker**
   ```bash
   sudo usermod -aG docker $USER
   # Fazer logout e login novamente
   ```

3. **Container não inicia**
   ```bash
   docker-compose -f docker-compose.prod.yml logs container-name
   ```

4. **Erro de memória**
   ```bash
   # Aumentar limite de memória no docker-compose.prod.yml
   deploy:
     resources:
       limits:
         memory: 1G
   ```

## 📊 Performance

### Otimizações Incluídas

- **Lazy Loading**: Componentes carregados sob demanda
- **Code Splitting**: JavaScript dividido em chunks
- **Image Optimization**: Imagens otimizadas
- **Caching**: Headers de cache configurados
- **Gzip**: Compressão habilitada

### Métricas Recomendadas

- **CPU**: Mínimo 1 vCPU, recomendado 2 vCPU
- **RAM**: Mínimo 1GB, recomendado 2GB
- **Storage**: Mínimo 10GB SSD
- **Bandwidth**: Mínimo 100Mbps

## 🔒 Segurança

### Configurações de Segurança

- **CORS**: Configurado para domínios específicos
- **Rate Limiting**: Proteção contra spam
- **Helmet**: Headers de segurança
- **Input Validation**: Validação de dados de entrada
- **Environment Variables**: Chaves sensíveis em variáveis de ambiente

### Checklist de Segurança

- [ ] Certificado SSL configurado
- [ ] Firewall configurado (portas 80, 443, 22)
- [ ] Backup automático configurado
- [ ] Monitoramento de logs ativo
- [ ] Atualizações de segurança em dia

## 📈 Escalabilidade

### Para Alto Tráfego

1. **Load Balancer**: Use Nginx ou HAProxy
2. **CDN**: Configure CloudFlare ou similar
3. **Database**: Migre para PostgreSQL/MySQL
4. **Caching**: Implemente Redis
5. **Monitoring**: Use Prometheus + Grafana

### Exemplo de Configuração Nginx para Load Balancing

```nginx
upstream backend {
    server backend1:3002;
    server backend2:3002;
}

upstream frontend {
    server frontend1:3000;
    server frontend2:3000;
}

server {
    listen 80;
    server_name seu-dominio.com;
    
    location /api {
        proxy_pass http://backend;
    }
    
    location / {
        proxy_pass http://frontend;
    }
}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/JonasKash/mapa-dna/issues)
- **Email**: suporte@seu-dominio.com
- **Documentação**: [Wiki do Projeto](https://github.com/JonasKash/mapa-dna/wiki)

## 🎯 Roadmap

- [ ] Integração com mais APIs de pagamento
- [ ] Dashboard administrativo
- [ ] Sistema de usuários
- [ ] Relatórios avançados
- [ ] App mobile
- [ ] Integração com CRM

---

**Desenvolvido com ❤️ por [JonasKash](https://github.com/JonasKash)**