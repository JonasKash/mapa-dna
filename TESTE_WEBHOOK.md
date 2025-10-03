# 🔧 Teste do Webhook - Instruções

## 🚀 Como Testar

### 1. Iniciar o Projeto
```bash
cd matrix-mind-path-main
npm run dev
```

### 2. Abrir o Console do Navegador
- Pressione `F12` ou `Ctrl+Shift+I`
- Vá para a aba "Console"

### 3. Testar o Webhook

#### Opção A: Botão de Teste (Mais Fácil)
- Procure pelo botão vermelho "Test Webhook" no canto inferior direito
- Clique nele e observe os logs no console

#### Opção B: Fluxo Completo
1. Preencha o nome e data de nascimento no Step 4
2. Clique em "Desbloquear DNA Financeiro"
3. Observe os logs no console

#### Opção C: Botão de Pagamento
1. Complete todo o fluxo até o Step 6
2. Clique em "Hacker a Matrix Financeira"
3. Observe os logs no console

## 📊 Logs Esperados

### 1. Inicialização do Tracking
```
Tracking data initialized: {
  utmSource: "direct",
  utmMedium: "none",
  utmCampaign: "none",
  utmTerm: "none",
  utmContent: "none",
  userId: "user_1703123456789_abc123def",
  sessionId: "session_1703123456789_xyz789ghi",
  timestamp: "2023-12-21T10:30:45.123Z",
  userAgent: "Mozilla/5.0...",
  referrer: "direct"
}
```

### 2. Chamada do Webhook
```
sendWebhook called with eventType: data_collected
Current funnel data: { name: "João", birthDate: "1990-01-01", ... }
Tracking data: { utmSource: "direct", ... }
Created webhook payload: { utm_source: "direct", ... }
Sending webhook payload: { utm_source: "direct", ... }
```

### 3. Resposta do Webhook
```
Webhook response status: 200
Webhook response headers: { ... }
Webhook sent successfully. Response: OK
```

## 🐛 Possíveis Problemas

### 1. "Tracking data not available"
- **Causa**: Hook de tracking não foi inicializado
- **Solução**: Recarregue a página

### 2. "Webhook failed: 404"
- **Causa**: URL do webhook incorreta
- **Solução**: Verificar se a URL está correta

### 3. "Webhook failed: 500"
- **Causa**: Erro no servidor do webhook
- **Solução**: Verificar se o servidor n8n está funcionando

### 4. "Error sending webhook: NetworkError"
- **Causa**: Problema de CORS ou rede
- **Solução**: Verificar configurações do servidor

## 🔍 Debugging

### Verificar se o Tracking está Funcionando
```javascript
// No console do navegador
console.log('Cookies:', document.cookie);
console.log('URL params:', new URLSearchParams(window.location.search));
```

### Verificar se o Webhook está Sendo Chamado
```javascript
// No console do navegador
// Deve aparecer quando clicar no botão
```

### Testar o Webhook Manualmente
```javascript
// No console do navegador
fetch('https://n8n.mapadnafinanceiro.com/webhook-test/mapa-dna', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data' })
}).then(r => r.text()).then(console.log);
```

## 📝 Dados Enviados

O webhook envia os seguintes dados:
- **UTM Tracking**: source, medium, campaign, term, content
- **User ID**: ID único persistente em cookie
- **Session ID**: ID único da sessão atual
- **Dados Pessoais**: nome, data de nascimento
- **Respostas do Quiz**: question1, question2
- **Pontos e Conquistas**: points, achievements
- **Metadados**: timestamp, user_agent, referrer, current_step
- **Event Type**: data_collected, payment_click, quiz_complete
