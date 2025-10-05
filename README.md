# 🔮 Mapa da Grana - Oráculo da Prosperidade

Sistema de oráculo numerológico que gera relatórios personalizados de prosperidade financeira baseados em numerologia pitagórica e dados pessoais do usuário.

## ✨ Funcionalidades

- **Numerologia Pitagórica**: Cálculos automáticos baseados no nome e data de nascimento
- **Relatórios Personalizados**: Geração de insights financeiros únicos
- **Sistema de Fallback**: Respostas artificiais quando a API da OpenAI não está disponível
- **Interface Moderna**: Design Matrix com animações e efeitos visuais
- **Deploy Automatizado**: Stack Docker completa para produção

## 🚀 Deploy em Produção

### Domínio: www.mapadnafinanceiro.com

### Pré-requisitos

- VPS Ubuntu 20.04+ com acesso root
- Domínio configurado apontando para o IP do servidor
- Docker e Docker Compose instalados

### Deploy Rápido (1 comando)

```bash
# Clone o repositório
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna

# Execute o script de deploy
sudo ./deploy-production.sh
```

### Configuração Manual

1. **Configurar variáveis de ambiente:**
```bash
cp env.production .env
nano .env
```

2. **Configurar SSL (Let's Encrypt):**
```bash
certbot certonly --standalone -d www.mapadnafinanceiro.com
cp /etc/letsencrypt/live/www.mapadnafinanceiro.com/* ssl/
```

3. **Deploy com Docker:**
```bash
docker-compose -f docker-compose.production.yml up -d --build
```

## 📋 Comandos de Manutenção

### Verificar Status
```bash
docker-compose -f docker-compose.production.yml ps
curl https://www.mapadnafinanceiro.com/health
```

### Logs
```bash
docker-compose -f docker-compose.production.yml logs -f
```

### Atualizações
```bash
git pull origin main
docker-compose -f docker-compose.production.yml up -d --build
```

## 📁 Estrutura do Projeto

```
mapa-dna/
├── src/                           # Frontend React/TypeScript
├── server/                        # Backend Node.js/Express
├── docker-compose.production.yml  # Stack Docker para produção
├── nginx-production.conf          # Configuração Nginx otimizada
├── deploy-production.sh           # Script de deploy automático
├── env.production                 # Configurações de produção
└── README-PRODUCTION.md           # Documentação completa
```

## 🔧 Configurações

### Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `OPENAI_API_KEY` | Chave da API OpenAI | ❌ |
| `WEBHOOK_URL` | URL do webhook | ❌ |
| `WEBHOOK_SECRET` | Chave secreta do webhook | ❌ |

## 🔒 Segurança

- ✅ SSL/TLS obrigatório
- ✅ Headers de segurança
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Firewall básico

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/JonasKash/mapa-dna/issues)
- **Documentação**: README-PRODUCTION.md

---

**Desenvolvido com ❤️ por [JonasKash](https://github.com/JonasKash)**