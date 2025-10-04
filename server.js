import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

// Sistema de Rate Limiting
const rateLimitStore = new Map();
const RATE_LIMIT_MAX_REQUESTS = 50; // Aumentado para testes
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 horas

// Função para obter chave única do cliente (IP + Session ID)
const getClientKey = (req) => {
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
             (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
             req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const sessionId = req.headers['x-session-id'] || req.body?.session_id || 'unknown';
  return `${ip}:${sessionId}`;
};

// Função para calcular numerologia pitagórica
const calculateNumerology = (name, birthDate) => {
  // Tabela Pitagórica
  const pythagoreanTable = {
    'A': 1, 'J': 1, 'S': 1,
    'B': 2, 'K': 2, 'T': 2,
    'C': 3, 'L': 3, 'U': 3,
    'D': 4, 'M': 4, 'V': 4,
    'E': 5, 'N': 5, 'W': 5,
    'F': 6, 'O': 6, 'X': 6,
    'G': 7, 'P': 7, 'Y': 7,
    'H': 8, 'Q': 8, 'Z': 8,
    'I': 9, 'R': 9
  };

  // Converter nome para maiúsculas e remover espaços
  const fullName = name.toUpperCase().replace(/\s/g, '');
  
  // Separar vogais e consoantes
  const vowels = fullName.match(/[AEIOU]/g) || [];
  const consonants = fullName.match(/[BCDFGHJKLMNPQRSTVWXYZ]/g) || [];
  
  // Calcular Número da Essência da Alma (vogais)
  const soulEssence = vowels.reduce((sum, letter) => sum + (pythagoreanTable[letter] || 0), 0);
  
  // Calcular Número dos Sonhos (consoantes)
  const dreamsNumber = consonants.reduce((sum, letter) => sum + (pythagoreanTable[letter] || 0), 0);
  
  // Calcular Número da Expressão (total)
  const expressionNumber = soulEssence + dreamsNumber;
  
  // Reduzir a um dígito (exceto números mestres 11, 22, 33)
  const reduceToSingleDigit = (num) => {
    if (num === 11 || num === 22 || num === 33) return num;
    while (num > 9) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  };
  
  // Calcular data de nascimento
  const birthDateStr = birthDate.replace(/-/g, '');
  const birthSum = birthDateStr.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const birthNumber = reduceToSingleDigit(birthSum);
  
  // Número final (Expressão + Nascimento)
  const finalNumber = reduceToSingleDigit(expressionNumber + birthNumber);
  
  return {
    soulEssence: reduceToSingleDigit(soulEssence),
    dreamsNumber: reduceToSingleDigit(dreamsNumber),
    expressionNumber: reduceToSingleDigit(expressionNumber),
    birthNumber: birthNumber,
    finalNumber: finalNumber
  };
};

// Função para verificar rate limit
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
  */
};

// Função para limpeza automática de dados antigos
const cleanupOldEntries = () => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.lastRequest > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
};

// Limpeza automática a cada hora
setInterval(cleanupOldEntries, 60 * 60 * 1000);

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: true, // Aceita qualquer origem durante desenvolvimento
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));
app.use(express.json({ limit: '10mb' }));

// Estrutura esperada para os dados do funil:
// {
//   name: string,
//   birthDate: string,
//   question1: string,
//   question2: string,
//   money: number,
//   currentStep: number,
//   achievements: array,
//   monthlyPotential: number
// }

// Estrutura de resposta do Oráculo:
// {
//   revelacao: string,
//   arquetipo: string,
//   essencia: string,
//   acao_imediata: string
// }

// Rota para gerar revelação do Oráculo
app.post('/api/oracle/generate', async (req, res) => {
  const requestId = Math.random().toString(36).substr(2, 9);
  const startTime = Date.now();
  
  try {
    console.log(`=== ORACLE GENERATE REQUEST [${requestId}] ===`);
    console.log(`[${requestId}] Timestamp:`, new Date().toISOString());
    console.log(`[${requestId}] Request headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`[${requestId}] Request body:`, JSON.stringify(req.body, null, 2));
    console.log(`[${requestId}] Request IP:`, req.ip);
    console.log(`[${requestId}] Request method:`, req.method);
    console.log(`[${requestId}] Request URL:`, req.url);
    
    // Verificar rate limiting
    console.log(`[${requestId}] Starting rate limit check...`);
    const clientKey = getClientKey(req);
    const rateLimitResult = checkRateLimit(clientKey, req);
    
    console.log(`[${requestId}] Rate limit check result:`, {
      clientKey,
      allowed: rateLimitResult.allowed,
      remaining: rateLimitResult.remaining,
      resetTime: rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime).toISOString() : null
    });
    
    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime);
      console.log(`[${requestId}] 🚨 RATE LIMIT EXCEEDED:`, {
        clientKey,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString(),
        resetTime: resetTime.toISOString()
      });
      
      return res.status(429).json({
        error: 'Limite de requisições excedido',
        message: 'Você excedeu o limite de 5 consultas por dia. Tente novamente em 24 horas.',
        resetTime: resetTime.toISOString(),
        remaining: 0
      });
    }
    
    // Adicionar headers de rate limiting
    console.log(`[${requestId}] Setting rate limit headers...`);
    res.set({
      'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS,
      'X-RateLimit-Remaining': rateLimitResult.remaining,
      'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW_MS).toISOString()
    });
    
    const data = req.body;
    console.log(`[${requestId}] Processing request data...`);

    // Calcular numerologia
    console.log(`[${requestId}] Calculating numerology for ${data.name}...`);
    const numerology = calculateNumerology(data.name, data.birthDate);
    console.log(`[${requestId}] Numerology calculated:`, numerology);

    // Validação básica dos dados
    console.log(`[${requestId}] Starting data validation...`);
    if (!data.name || !data.birthDate || !data.question1 || !data.question2) {
      console.log(`[${requestId}] ❌ Validation failed - missing required fields:`, {
        hasName: !!data.name,
        hasBirthDate: !!data.birthDate,
        hasQuestion1: !!data.question1,
        hasQuestion2: !!data.question2
      });
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos',
        required: ['name', 'birthDate', 'question1', 'question2']
      });
    }
    console.log(`[${requestId}] ✅ Data validation passed`);

    // Verifica se a chave da OpenAI está configurada
    console.log(`[${requestId}] Checking OpenAI API key...`);
    if (!process.env.OPENAI_API_KEY) {
      console.error(`[${requestId}] ❌ OPENAI_API_KEY não configurada`);
      return res.status(500).json({
        error: 'Configuração do servidor incompleta'
      });
    }

    console.log(`[${requestId}] ✅ OpenAI API Key configured:`, process.env.OPENAI_API_KEY ? 'YES' : 'NO');

    const prompt = `Você é o Oráculo da Prosperidade. Leia as energias numerológicas do nome e data de nascimento. Seja direto e místico.

DADOS NUMEROLÓGICOS:
Nome: ${data.name}
Nascimento: ${data.birthDate}
Número da Essência da Alma: ${numerology.soulEssence}
Número dos Sonhos: ${numerology.dreamsNumber}
Número da Expressão: ${numerology.expressionNumber}
Número do Nascimento: ${numerology.birthNumber}
NÚMERO FINAL: ${numerology.finalNumber}

DADOS PESSOAIS:
Insatisfação: ${data.question1}
Aspiração: ${data.question2}
Energia: ${data.money > 1000 ? 'Alta' : 'Média'}

ESTRUTURA (máximo 150 palavras):

**ABERTURA (1 linha)**
Reconheça a essência única baseada no NÚMERO FINAL ${numerology.finalNumber}.

**ARQUÉTIPO (2-3 linhas)**
Baseado no NÚMERO FINAL ${numerology.finalNumber}, escolha um:
- Arquiteto da Abundância (1, 4, 7)
- Visionário das Oportunidades (2, 5, 8)
- Alquimista da Palavra (3, 6, 9)
- Curador da Transformação (11, 22, 33)

Descreva o potencial baseado no número e respostas.

**ESTRATÉGIA (2 linhas)**
Caminho prático baseado no arquétipo numerológico.

**POTENCIAL (1 linha)**
Valores em 30/90/180 dias como "possibilidade energética".

**OBSTÁCULO (1 linha)**
UM bloqueio comum: procrastinação excessiva, excesso de oportunidades, excesso de conhecimentos, excesso de amizades ruins, medo do sucesso, perfeccionismo, etc.

**AÇÃO (1 linha)**
Próximo passo em 7 dias.

**FECHAMENTO (1 linha)**
Afirmação com o nome e número ${numerology.finalNumber}.

RETORNE JSON:
{
  "revelacao": "texto completo",
  "arquetipo": "nome do arquétipo",
  "essencia": "energia central",
  "obstaculo": "bloqueio principal",
  "acao_imediata": "próximo passo",
  "numero_final": ${numerology.finalNumber}
}`;

    // Chamada para a OpenAI API
    console.log(`[${requestId}] 🚀 Calling OpenAI API...`);
    console.log(`[${requestId}] OpenAI API URL: https://api.openai.com/v1/chat/completions`);
    console.log(`[${requestId}] Request payload size:`, JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é o Oráculo da Prosperidade, especializado em leitura energética de nomes e datas de nascimento. Sempre retorne apenas JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    }).length, 'bytes');
    
    const openaiStartTime = Date.now();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é o Oráculo da Prosperidade, especializado em leitura energética de nomes e datas de nascimento. Sempre retorne apenas JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    const openaiEndTime = Date.now();
    console.log(`[${requestId}] ⏱️ OpenAI API call completed in ${openaiEndTime - openaiStartTime}ms`);
    console.log(`[${requestId}] OpenAI API response status:`, response.status);
    console.log(`[${requestId}] OpenAI API response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[${requestId}] ❌ OpenAI API error:`, response.status, errorBody);
      
      // Retorna erro em vez de fallback para debug
      return res.status(500).json({
        error: 'OpenAI API error',
        details: errorBody
      });
    }

    console.log(`[${requestId}] ✅ OpenAI API call successful, parsing response...`);
    const result = await response.json();
    console.log(`[${requestId}] OpenAI response structure:`, {
      hasChoices: !!result.choices,
      choicesLength: result.choices?.length,
      hasMessage: !!result.choices?.[0]?.message,
      hasContent: !!result.choices?.[0]?.message?.content
    });
    
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      console.error(`[${requestId}] ❌ No content received from OpenAI`);
      console.log(`[${requestId}] Full OpenAI response:`, JSON.stringify(result, null, 2));
      return res.status(500).json({
        error: 'No content received from OpenAI'
      });
    }

    console.log(`[${requestId}] Raw content from OpenAI (first 200 chars):`, content.substring(0, 200));

    try {
      // Parse JSON response
      console.log(`[${requestId}] 🔄 Parsing JSON response...`);
      const oracleData = JSON.parse(content);
      console.log(`[${requestId}] ✅ OpenAI response parsed successfully:`, oracleData);
      
      const totalTime = Date.now() - startTime;
      console.log(`[${requestId}] 🎉 Request completed successfully in ${totalTime}ms`);
      
      // Webhook será enviado pelo frontend após receber a resposta
      
      res.json(oracleData);
    } catch (parseError) {
      console.error(`[${requestId}] ❌ Error parsing OpenAI response:`, parseError);
      console.log(`[${requestId}] Raw content that failed to parse:`, content);
      return res.status(500).json({
        error: 'Error parsing OpenAI response',
        details: parseError.message,
        rawContent: content
      });
    }

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`[${requestId}] ❌ Error in oracle generation after ${totalTime}ms:`, error);
    console.error(`[${requestId}] Error stack:`, error.stack);
    res.status(500).json({
      error: 'Erro interno do servidor',
      fallback: getFallbackResponse(req.body, numerology)
    });
  }
});

// Função para enviar dados do oráculo para o webhook
async function sendOracleDataToWebhook(oracleData, userData) {
  const webhookUrl = 'https://wbn.mapadnafinanceiro.com/webhook/mapa-dna-financeiro';
  
  try {
    const payload = {
      // Dados do usuário
      name: userData.name,
      birth_date: userData.birthDate,
      whatsapp: userData.whatsapp || '',
      question1: userData.question1,
      question2: userData.question2,
      money: userData.money,
      monthly_potential: userData.monthlyPotential,
      achievements: userData.achievements,
      current_step: userData.currentStep,
      
      // Resposta do agente/oráculo
      oracle_response: {
        revelacao: oracleData.revelacao,
        arquetipo: oracleData.arquetipo,
        essencia: oracleData.essencia,
        acao_imediata: oracleData.acao_imediata
      },
      
      // Metadados
      timestamp: new Date().toISOString(),
      event_type: 'oracle_generated'
    };

    console.log('Enviando dados do oráculo para webhook:', webhookUrl);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('Status do webhook:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Falha no webhook:', response.status, response.statusText, errorText);
    } else {
      const responseData = await response.text();
      console.log('Webhook enviado com sucesso. Resposta:', responseData);
    }
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
  }
}

// Função para resposta de fallback
function getFallbackResponse(data, numerology) {
  return {
    revelacao: `${data.name}, sua assinatura energética carrega o peso de montanhas e o brilho do ouro. Vejo em sua vibração numérica uma força criativa inata que ressoa com abundância. Sua data carrega a marca de um visionário das oportunidades, alguém que vê além do óbvio. Sua estratégia dourada envolve focar em inovação e liderança, criando soluções únicas no mercado. Sua possibilidade energética revela potencial de R$ 1.500 em 30 dias, R$ 4.200 em 90 dias e R$ 7.800 em 180 dias. Nos próximos 7 dias, comece a estruturar sua primeira fonte de renda digital. ${data.name}, sua transformação financeira já começou.`,
    arquetipo: 'O Visionário das Oportunidades',
    essencia: 'Força criativa com magnetismo para abundância',
    obstaculo: 'Procrastinação excessiva e medo de começar',
    acao_imediata: 'Estruturar primeira fonte de renda digital em 7 dias',
    numero_final: numerology.finalNumber
  };
}

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota para verificar status do rate limiting
app.get('/api/rate-limit/status', (req, res) => {
  const clientKey = getClientKey(req);
  const clientData = rateLimitStore.get(clientKey);
  
  if (!clientData) {
    return res.json({
      clientKey,
      remaining: RATE_LIMIT_MAX_REQUESTS,
      limit: RATE_LIMIT_MAX_REQUESTS,
      resetTime: null,
      isLimited: false
    });
  }
  
  const now = Date.now();
  const isExpired = now - clientData.firstRequest > RATE_LIMIT_WINDOW_MS;
  
  res.json({
    clientKey,
    remaining: isExpired ? RATE_LIMIT_MAX_REQUESTS : RATE_LIMIT_MAX_REQUESTS - clientData.count,
    limit: RATE_LIMIT_MAX_REQUESTS,
    resetTime: isExpired ? null : new Date(clientData.firstRequest + RATE_LIMIT_WINDOW_MS).toISOString(),
    isLimited: !isExpired && clientData.count >= RATE_LIMIT_MAX_REQUESTS,
    totalClients: rateLimitStore.size
  });
});

// Rota para limpar rate limit (apenas para desenvolvimento)
app.post('/api/rate-limit/reset', (req, res) => {
  const clientKey = getClientKey(req);
  rateLimitStore.delete(clientKey);
  
  console.log(`Rate limit reset for client: ${clientKey}`);
  
  res.json({
    message: 'Rate limit reset successfully',
    clientKey,
    remaining: RATE_LIMIT_MAX_REQUESTS
  });
});

// Tratamento de erro 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Tratamento global de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({
    error: 'Erro interno do servidor'
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  console.log(`🌟 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔮 Oracle API: http://localhost:${PORT}/api/oracle/generate`);
});
