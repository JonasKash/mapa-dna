# ⚡ Instalação Rápida - Mapa da Grana

## 🚀 Instalação em 1 Comando

### Para VPS Ubuntu/Debian:

```bash
# Conectar na VPS como root
ssh root@SEU_IP_VPS

# Baixar e executar o instalador automático
curl -fsSL https://raw.githubusercontent.com/JonasKash/mapa-dna/master/install-vps.sh | bash
```

### Ou manualmente:

```bash
# 1. Baixar o script
wget https://raw.githubusercontent.com/JonasKash/mapa-dna/master/install-vps.sh

# 2. Tornar executável
chmod +x install-vps.sh

# 3. Executar
./install-vps.sh
```

## 📋 O que o script faz automaticamente:

✅ **Atualiza o sistema**  
✅ **Instala Docker e Docker Compose**  
✅ **Clona o projeto do GitHub**  
✅ **Gera certificados SSL autoassinados**  
✅ **Configura variáveis de ambiente**  
✅ **Configura firewall (UFW)**  
✅ **Faz build das imagens Docker**  
✅ **Inicia todos os serviços**  
✅ **Cria scripts de monitoramento**  
✅ **Testa a aplicação**  

## 🎯 Durante a instalação:

O script está configurado para usar automaticamente:
- **Domínio**: `www.lp.mapadnafinanceiro.com`

## ⏱️ Tempo estimado: 5-10 minutos

## 🔧 Após a instalação:

### URLs de acesso:
- **Frontend**: `https://www.lp.mapadnafinanceiro.com`
- **API Health**: `https://www.lp.mapadnafinanceiro.com/api/health`

### Comandos úteis:
```bash
# Monitorar aplicação
/home/monitor-mapa-dna.sh

# Atualizar aplicação
/home/update-mapa-dna.sh

# Ver logs
docker-compose -f /home/mapa-dna/docker-compose.simple.yml logs -f

# Reiniciar serviços
docker-compose -f /home/mapa-dna/docker-compose.simple.yml restart
```

## ⚙️ Configuração pós-instalação:

### 1. Configurar OpenAI (opcional):
```bash
nano /home/mapa-dna/.env
# Edite a linha: OPENAI_API_KEY=sua_chave_aqui
```

### 2. Configurar certificados Let's Encrypt (produção):
```bash
# Instalar certbot
apt install certbot

# Gerar certificados
certbot certonly --standalone -d SEU_DOMINIO

# Copiar certificados
cp /etc/letsencrypt/live/SEU_DOMINIO/fullchain.pem /home/mapa-dna/ssl/cert.pem
cp /etc/letsencrypt/live/SEU_DOMINIO/privkey.pem /home/mapa-dna/ssl/cert.key

# Reiniciar serviços
docker-compose -f /home/mapa-dna/docker-compose.simple.yml restart
```

## 🚨 Troubleshooting:

### Se algo der errado:
```bash
# Ver logs de erro
docker-compose -f /home/mapa-dna/docker-compose.simple.yml logs

# Reinstalar do zero
cd /home
rm -rf mapa-dna
curl -fsSL https://raw.githubusercontent.com/JonasKash/mapa-dna/master/install-vps.sh | bash
```

### Verificar status:
```bash
# Status dos containers
docker-compose -f /home/mapa-dna/docker-compose.simple.yml ps

# Testar conectividade
curl -k https://www.lp.mapadnafinanceiro.com/api/health
```

## 📞 Suporte:

- **GitHub**: https://github.com/JonasKash/mapa-dna
- **Issues**: https://github.com/JonasKash/mapa-dna/issues

---

**🎉 Pronto! Sua aplicação estará rodando em poucos minutos!**
