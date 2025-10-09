# 🔮 Mapa da Grana - Oráculo da Prosperidade

Sistema de oráculo numerológico que gera relatórios personalizados de prosperidade financeira baseados em numerologia pitagórica e dados pessoais do usuário.

## ✨ Funcionalidades

- **Numerologia Pitagórica**: Cálculos automáticos baseados no nome e data de nascimento
- **Relatórios Personalizados**: Geração de insights financeiros únicos
- **Sistema de Fallback**: Respostas artificiais quando a API da OpenAI não está disponível
- **Interface Moderna**: Design Matrix com animações e efeitos visuais
- **Deploy Automatizado**: Stack Docker completa para produção

## 🚀 Início Rápido

### Instalação Local (Desenvolvimento)

```bash
# 1. Clonar o repositório
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna

# 2. Instalar dependências
npm install
cd server && npm install && cd ..

# 3. Configurar variáveis de ambiente
# Criar .env na raiz com:
echo "VITE_API_URL=http://localhost:3001" > .env

# Criar server/.env com:
echo "PORT=3001
NODE_ENV=development
OPENAI_API_KEY=sua_chave_aqui
WEBHOOK_URL=sua_url_aqui
WEBHOOK_SECRET=seu_secret_aqui
CORS_ORIGIN=http://localhost:5173" > server/.env

# 4. Executar o projeto
# Terminal 1 - Backend:
cd server && npm run dev

# Terminal 2 - Frontend:
npm run dev
```

### Deploy com Docker (Recomendado)

```bash
# Clone e execute
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna

# Configurar variáveis (opcional)
cp env.traefik .env

# Executar com Docker
docker-compose -f docker-compose.simple.yml up -d --build
```

**Acesse:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/health

## 📚 Documentação Completa

Para instruções detalhadas de instalação, configuração e troubleshooting, consulte:
- **[INSTRUCOES-INSTALACAO.md](./INSTRUCOES-INSTALACAO.md)** - Guia completo de instalação
- **[DEPLOY-SIMPLES.md](./DEPLOY-SIMPLES.md)** - Guia de deploy simplificado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **React Router** para navegação
- **React Hook Form** para formulários

### Backend
- **Node.js** com Express
- **CORS** para cross-origin requests
- **Helmet** para segurança
- **Rate Limiting** para proteção

### Deploy
- **Docker** e **Docker Compose**
- **Nginx** como proxy reverso
- **SSL/TLS** com Let's Encrypt

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

## 📖 Guia Detalhado de Deploy e Configuração

Este documento detalha todos os passos, correções e configurações realizadas para efetuar o deploy do projeto "Mapa DNA" em um servidor VPS, incluindo a configuração de SSL com Let's Encrypt e o gerenciamento de containers Docker.

### 1. Preparação Inicial e Upload do Projeto

O projeto foi enviado com sucesso para o GitHub e clonado no VPS.

- **Repositório**: https://github.com/JonasKash/mapa-dna
- **Branch**: master
- **Commit**: aa8d7b4 - Stack Docker para produção

**Comandos Executados no VPS:**
```bash
cd /home/ # ou o diretório desejado
git clone https://github.com/JonasKash/mapa-dna.git
cd mapa-dna/
```

### 2. Correção do Script deploy-production.sh

Inicialmente, o script deploy-production.sh não estava sendo reconhecido ou executado devido a permissões ou problemas de formato de arquivo (quebra de linha).

#### 2.1. Adicionar Permissões de Execução
Para garantir que o script possa ser executado:
```bash
chmod +x deploy-production.sh
```

#### 2.2. Converter Formato do Arquivo (se necessário)
Se o script tivesse sido criado ou editado em ambiente Windows, ele poderia conter caracteres de quebra de linha \r (CRLF) incompatíveis com Linux, causando o erro "command not found". Usamos dos2unix para converter o formato:
```bash
sudo apt update
sudo apt install dos2unix -y
dos2unix deploy-production.sh
```
(Se dos2unix não estivesse disponível, `sed -i 's/\r$//' deploy-production.sh` seria a alternativa.)

### 3. Configuração do Arquivo .env

O script de deploy alertou que o arquivo .env não foi encontrado e tentou criar a partir de um env.example que também não existia.

#### 3.1. Criação e Edição do .env
Criamos o arquivo .env manualmente e preenchemos com as variáveis de ambiente necessárias para o projeto:
```bash
cp env.production .env
nano .env
```
(Conteúdo do .env foi preenchido conforme as necessidades da aplicação, com variáveis como portas, segredos, etc.)

### 4. Obtenção e Configuração do Certificado SSL com Certbot

O script de deploy alertou sobre a falta de certificados SSL. O processo de obtenção do certificado via Certbot (`certbot certonly --standalone`) falhou inicialmente porque a porta 80 estava em uso.

#### 4.1. Instalação do Certbot
```bash
sudo apt update
sudo apt install certbot -y
```

#### 4.2. Identificação e Resolução do Conflito da Porta 80
O Certbot precisava usar a porta 80 para validação, mas ela estava em uso. Foi verificado que o Nginx não estava instalado como serviço do sistema. O problema foi resolvido ao aguardar que a porta fosse liberada ou ao garantir que nenhum outro serviço temporário a estivesse utilizando durante a execução do Certbot.

**Comando para verificar processos na porta 80 (se necessário):**
```bash
sudo lsof -i :80
```

#### 4.3. Geração do Certificado SSL
Executamos o Certbot no modo standalone, fornecendo as informações solicitadas (e-mail, concordância com termos, etc.). Desta vez, a validação ocorreu com sucesso e o Certbot configurou a renovação automática:
```bash
certbot certonly --standalone -d www.mapadnafinanceiro.com
```

#### 4.4. Copiar Certificados para o Diretório ssl/
Os certificados gerados foram copiados para um diretório ssl/ dentro do projeto, conforme esperado pelo docker-compose.production.yml para montagem no container Nginx:
```bash
mkdir -p ssl
sudo cp /etc/letsencrypt/live/www.mapadnafinanceiro.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/www.mapadnafinanceiro.com/privkey.pem ssl/
```

### 5. Correção do Dockerfile do Frontend e Docker Compose

Após a configuração SSL, o deploy falhou durante a fase de build do Docker, indicando que nginx.conf não foi encontrado. Posteriormente, um erro de "mount" de volume foi identificado.

#### 5.1. Padronização do Nome do Arquivo de Configuração do Nginx
O Dockerfile.frontend esperava um arquivo nginx.conf, mas o projeto fornecia nginx-production.conf. Optou-se por renomear o arquivo para alinhar com o Dockerfile:
```bash
mv nginx-production.conf nginx.conf
```

#### 5.2. Correção no Dockerfile.frontend (opcional/confirmação)
Embora a renomeação tenha sido feita, verificamos que o Dockerfile.frontend já estava configurado para copiar nginx.conf para /etc/nginx/nginx.conf. Não foi necessária alteração se o COPY já apontava para nginx.conf.

**Dentro de Dockerfile.frontend, a linha deve ser:**
```dockerfile
COPY nginx.conf /etc/nginx/nginx.conf
```

#### 5.3. Remoção do Volume de nginx.conf no docker-compose.production.yml
O erro final de "Are you trying to mount a directory onto a file (or vice-versa)?" ocorreu porque o docker-compose.production.yml estava tentando montar o arquivo nginx.conf do host para /etc/nginx/nginx.conf dentro do container, enquanto o Dockerfile já havia copiado o mesmo arquivo para o mesmo destino durante o build. Isso causou um conflito.

A solução foi remover ou comentar a linha de volume correspondente no serviço frontend em docker-compose.production.yml:
```bash
nano docker-compose.production.yml
```

**Exemplo da linha removida/comentada:**
```yaml
# No serviço frontend:
volumes:
  # - ./nginx.conf:/etc/nginx/nginx.conf  <-- ESTA LINHA FOI REMOVIDA/COMENTADA
  - ./ssl:/etc/nginx/ssl # Esta linha foi mantida para os certificados SSL
  - nginx_logs:/var/log/nginx
```

### 6. Execução Final do Deploy

Após todas as correções, o script de deploy foi executado com sucesso:
```bash
sudo ./deploy-production.sh
```

### 7. Resultado Final

O projeto "Mapa DNA" está agora em execução no VPS, acessível via https://www.mapadnafinanceiro.com, com Nginx servindo o frontend e a API, ambos dentro de containers Docker, e com certificados SSL configurados e com renovação automática.

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