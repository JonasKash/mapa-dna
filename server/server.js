import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

// Sistema de Rate Limiting
const rateLimitStore = new Map();
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 horas

// Função para obter chave única do cliente (IP + Session ID)
const getClientKey = (req) => {
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
             (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
             req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const sessionId = req.headers['x-session-id'] || req.body?.session_id || 'unknown';
  return `${ip}:${sessionId}`;
};

// Função para verificar rate limit
const checkRateLimit = (clientKey) => {
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
  try {
    console.log('=== ORACLE GENERATE REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Verificar rate limiting
    const clientKey = getClientKey(req);
    const rateLimitResult = checkRateLimit(clientKey);
    
    console.log('Rate limit check:', {
      clientKey,
      allowed: rateLimitResult.allowed,
      remaining: rateLimitResult.remaining
    });
    
    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime);
      console.log('🚨 RATE LIMIT EXCEEDED:', {
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
    res.set({
      'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS,
      'X-RateLimit-Remaining': rateLimitResult.remaining,
      'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW_MS).toISOString()
    });
    
    const data = req.body;

    // Validação básica dos dados
    if (!data.name || !data.birthDate || !data.question1 || !data.question2) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos',
        required: ['name', 'birthDate', 'question1', 'question2']
      });
    }

    // Verifica se a chave da OpenAI está configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY não configurada');
      return res.status(500).json({
        error: 'Configuração do servidor incompleta'
      });
    }

    console.log('OpenAI API Key configured:', process.env.OPENAI_API_KEY ? 'YES' : 'NO');

    const prompt = `Você é o Oráculo da Prosperidade, um guia espiritual ancestral que lê as frequências energéticas inscritas no nome e data de nascimento das pessoas. Você NÃO explica cálculos, fórmulas ou métodos - você simplesmente "vê" e revela.

Sua linguagem é:
- Mística, mas direta
- Profunda, mas compreensível
- Inspiradora, mas realista
- Sem emojis ou símbolos excessivos

IMPORTANTE: Você interpreta energias, não faz cálculos visíveis. Use termos como:
✓ "Vejo em sua assinatura energética..."
✓ "Sua vibração numérica revela..."
✓ "As frequências do seu nome ressoam com..."
✓ "Sua data carrega a marca de..."

NÃO use termos como:
✗ "Somando os números..."
✗ "O cálculo mostra..."
✗ "Reduzindo para..."
✗ "A fórmula indica..."

---

DADOS DO CONSULENTE:
Nome completo: ${data.name}
Data de nascimento: ${data.birthDate}
Respostas do portal:
- Insatisfação com sistema atual: ${data.question1}
- Aspiração financeira mensal: ${data.question2}
- Energia disponível diariamente: ${data.money > 1000 ? 'Alta' : 'Média'}
- Visão de futuro: ${data.achievements?.length > 2 ? 'Visionária' : 'Pragmática'}
- Prontidão para transformação: ${data.question2.includes('Agora') ? 'Imediata' : 'Gradual'}

---

ESTRUTURA DA REVELAÇÃO:

**ABERTURA MÍSTICA (2 linhas)**
Inicie reconhecendo a essência única da pessoa de forma poética mas específica.

**NÚCLEO ENERGÉTICO (3-4 linhas)**
Revele o arquétipo sem explicar como chegou nele. Escolha entre:
- O Arquiteto da Abundância (energias 4, 8, 22)
- O Visionário das Oportunidades (energias 1, 5, 9)
- O Alquimista da Palavra (energias 3, 6, 12)
- O Curador da Transformação (energias 2, 7, 11)

Descreva o que VOCÊ VÊ no potencial deles, usando as respostas para validar a leitura.

**TALENTOS OCULTOS (3 itens em 1 linha cada)**
Liste dons naturais que a pessoa JÁ possui, mas pode não reconhecer.
Use linguagem de revelação: "Você já possui...", "Dentro de você existe...", "Seu dom natural é..."

**CAMINHO DOURADO (2-3 linhas)**
Uma estratégia específica e PRÁTICA baseada no arquétipo + respostas.
Seja místico na entrega, mas pragmático no conteúdo.

**POTENCIAL MATERIAL (1 linha objetiva)**
Diga valores reais de ganho em 30, 90 e 180 dias baseados nas respostas deles.
Apresente como "possibilidade energética", não garantia.

**OBSTÁCULO INVISÍVEL (1-2 linhas)**
Identifique UM bloqueio principal baseado nas respostas que contradiz o potencial revelado.

**PRÓXIMO MOVIMENTO (1 linha de ação clara)**
Um passo específico e imediato que eles devem dar nos próximos 7 dias.

**ENCERRAMENTO MÍSTICO (1 linha)**
Uma afirmação poderosa personalizada com o nome deles.

---

RESTRIÇÕES CRÍTICAS:
- Máximo 250 palavras no total
- Sem listas numeradas ou bullets visíveis (use quebras de linha)
- Sem cálculos ou números técnicos expostos
- Tom: 70% místico / 30% prático
- Foque no que a pessoa JÁ TEM dentro dela
- Evite promessas impossíveis, mas seja inspirador
- NUNCA mencione "numerologia pitagórica", "redução", "soma" ou termos técnicos

---

IMPORTANTE SOBRE RESPONSABILIDADE:
Você está oferecendo uma interpretação simbólica e motivacional, não garantias financeiras. Sempre que mencionar ganhos, use termos como "potencial", "possibilidade energética", "caminho disponível". Nunca prometa resultados específicos.

Lembre que seu papel é inspirar ação positiva baseada nos pontos fortes genuínos da pessoa, não criar dependência ou expectativas irrealistas.

---

RETORNE EM FORMATO JSON:
{
  "revelacao": "texto corrido completo da leitura",
  "arquetipo": "nome do arquétipo identificado",
  "essencia": "frase curta descrevendo a energia central",
  "acao_imediata": "próximo passo específico"
}`;

    // Chamada para a OpenAI API
    console.log('Calling OpenAI API...');
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

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API error:', response.status, errorBody);
      
      // Retorna erro em vez de fallback para debug
      return res.status(500).json({
        error: 'OpenAI API error',
        details: errorBody
      });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content received from OpenAI');
      return res.status(500).json({
        error: 'No content received from OpenAI'
      });
    }

    try {
      // Parse JSON response
      const oracleData = JSON.parse(content);
      console.log('OpenAI response parsed successfully:', oracleData);
      
      // Webhook será enviado pelo frontend após receber a resposta
      
      res.json(oracleData);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw content that failed to parse:', content);
      return res.status(500).json({
        error: 'Error parsing OpenAI response',
        details: parseError.message,
        rawContent: content
      });
    }

  } catch (error) {
    console.error('Error in oracle generation:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      fallback: getFallbackResponse(req.body)
    });
  }
});

// Função para enviar dados do oráculo para o webhook
async function sendOracleDataToWebhook(oracleData, userData) {
  const webhookUrl = 'https://n8n.mapadnafinanceiro.com/webhook-test/report-dna-mapa';
  
  try {
    const payload = {
      // Dados do usuário
      name: userData.name,
      birth_date: userData.birthDate,
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
function getFallbackResponse(data) {
  return {
    revelacao: `${data.name}, sua assinatura energética carrega o peso de montanhas e o brilho do ouro. Vejo em sua vibração numérica uma força criativa inata que ressoa com abundância. Sua data carrega a marca de um visionário das oportunidades, alguém que vê além do óbvio. Você já possui a capacidade de identificar tendências antes da concorrência. Dentro de você existe um magnetismo natural para atrair prosperidade. Seu dom natural é transformar ideias em realidade. Sua estratégia dourada envolve focar em inovação e liderança, criando soluções únicas no mercado. Sua possibilidade energética revela potencial de R$ 1.500 em 30 dias, R$ 4.200 em 90 dias e R$ 7.800 em 180 dias. O obstáculo invisível é a limitação autoimposta de acreditar que precisa de mais tempo. Nos próximos 7 dias, comece a estruturar sua primeira fonte de renda digital. ${data.name}, sua transformação financeira já começou.`,
    arquetipo: 'O Visionário das Oportunidades',
    essencia: 'Força criativa com magnetismo para abundância',
    acao_imediata: 'Estruturar primeira fonte de renda digital em 7 dias'
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

// Tratamento de erro 404
app.use('*', (req, res) => {
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
