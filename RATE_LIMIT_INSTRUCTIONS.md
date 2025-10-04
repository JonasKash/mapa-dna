# Instruções para Reabilitar Rate Limiting

## Status Atual
✅ **RATE LIMITING DESABILITADO** para desenvolvimento

## Para Reabilitar em Produção

1. **Abra o arquivo**: `server/server.js`

2. **Encontre a função**: `checkRateLimit` (linha ~24)

3. **Substitua o código atual**:
```javascript
const checkRateLimit = (clientKey, req) => {
  // DESABILITADO TEMPORARIAMENTE PARA DESENVOLVIMENTO
  // TODO: Reabilitar em produção
  console.log(`[RATE_LIMIT] Temporarily disabled for development - client: ${clientKey}`);
  return { 
    allowed: true, 
    remaining: 999999,
    resetTime: null
  };
  
  // CÓDIGO ORIGINAL (COMENTADO):
  /*
  // ... código comentado ...
  */
};
```

4. **Pelo código original**:
```javascript
const checkRateLimit = (clientKey, req) => {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientKey);
  
  if (!clientData) {
    // Primeira requisição
    rateLimitStore.set(clientKey, {
      count: 1,
      firstRequest: now,
      lastRequest: now
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  
  // Verificar se passou o período de janela
  if (now - clientData.firstRequest > RATE_LIMIT_WINDOW_MS) {
    // Reset do contador
    rateLimitStore.set(clientKey, {
      count: 1,
      firstRequest: now,
      lastRequest: now
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  
  // Verificar se excedeu o limite
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { 
      allowed: false, 
      remaining: 0,
      resetTime: clientData.firstRequest + RATE_LIMIT_WINDOW_MS
    };
  }
  
  // Incrementar contador
  clientData.count++;
  clientData.lastRequest = now;
  rateLimitStore.set(clientKey, clientData);
  
  return { 
    allowed: true, 
    remaining: RATE_LIMIT_MAX_REQUESTS - clientData.count 
  };
};
```

5. **Ajuste os limites** se necessário:
```javascript
const RATE_LIMIT_MAX_REQUESTS = 5; // Limite por dia
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 horas
```

6. **Reinicie o servidor** após as mudanças

## Configurações Atuais
- **Rate Limit**: DESABILITADO (999999 requisições)
- **Janela de Tempo**: 24 horas
- **Status**: Desenvolvimento

## Importante
⚠️ **NUNCA** faça deploy em produção com rate limiting desabilitado!


