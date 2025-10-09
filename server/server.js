const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Rate limiting (temporariamente desabilitado para desenvolvimento)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Aumentado para testes
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar rate limiting apenas em produção
if (process.env.NODE_ENV === 'production') {
  app.use('/api/', limiter);
}

// Verificar configuração
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-proj-test-key') {
  console.log('⚠️ Usando chave de teste - sistema funcionará com respostas artificiais');
  process.env.OPENAI_API_KEY = 'sk-proj-test-key';
}

console.log('✅ Servidor configurado com sucesso');

// Função para calcular numerologia pitagórica
const calculateNumerology = (name, birthDate) => {
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

  const fullName = name.toUpperCase().replace(/\s/g, '');
  const vowels = fullName.match(/[AEIOU]/g) || [];
  const consonants = fullName.match(/[BCDFGHJKLMNPQRSTVWXYZ]/g) || [];

  const soulEssence = vowels.reduce((sum, letter) => sum + (pythagoreanTable[letter] || 0), 0);
  const dreamsNumber = consonants.reduce((sum, letter) => sum + (pythagoreanTable[letter] || 0), 0);
  const expressionNumber = soulEssence + dreamsNumber;

  const reduceToSingleDigit = (num) => {
    if (num === 11 || num === 22 || num === 33) return num;
    while (num > 9) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  };

  const birthDateStr = birthDate.replace(/-/g, '');
  const birthSum = birthDateStr.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const birthNumber = reduceToSingleDigit(birthSum);

  const finalNumber = reduceToSingleDigit(expressionNumber + birthNumber);
  
  return { 
    soulEssence: reduceToSingleDigit(soulEssence),
    dreamsNumber: reduceToSingleDigit(dreamsNumber),
    expressionNumber: reduceToSingleDigit(expressionNumber),
    birthNumber: birthNumber,
    finalNumber: finalNumber
  };
};

// Função para gerar resposta artificial baseada no histórico
const generateArtificialResponse = (data, numerology) => {
  const archetypes = {
    1: { name: "Arquiteto da Abundância", essence: "Liderança e inovação" },
    2: { name: "Visionário das Oportunidades", essence: "Intuição e colaboração" },
    3: { name: "Alquimista da Palavra", essence: "Criatividade e expressão" },
    4: { name: "Curador da Transformação", essence: "Estabilidade e cura" },
    5: { name: "Explorador da Liberdade", essence: "Aventura e mudança" },
    6: { name: "Guardião da Harmonia", essence: "Responsabilidade e amor" },
    7: { name: "Místico da Sabedoria", essence: "Espiritualidade e análise" },
    8: { name: "Magnata do Poder", essence: "Autoridade e materialização" },
    9: { name: "Filantropo Universal", essence: "Serviço e compaixão" },
    11: { name: "Curador da Transformação", essence: "Intuição elevada e cura" },
    22: { name: "Construtor Mestre", essence: "Visão global e manifestação" },
    33: { name: "Mestre da Compaixão", essence: "Serviço universal e cura" }
  };

  const obstacles = [
    "procrastinação excessiva que paralisa sua ação",
    "excesso de oportunidades que dispersa seu foco",
    "excesso de conhecimentos que gera paralisia",
    "excesso de amizades ruins que drenam sua energia",
    "medo do sucesso que sabota suas conquistas",
    "perfeccionismo que impede a execução",
    "ansiedade que bloqueia sua intuição",
    "dependência de aprovação externa"
  ];

  const archetype = archetypes[numerology.finalNumber] || archetypes[1];
  const obstacle = obstacles[Math.floor(Math.random() * obstacles.length)];

  const responses = {
    "Dobrar Renda": "Estratégia de múltiplas fontes de renda através de investimentos e empreendedorismo digital",
    "Liberdade Financeira": "Caminho da independência através de ativos que geram renda passiva",
    "Investir Melhor": "Educação financeira e diversificação de portfólio para maximizar retornos",
    "Sair das Dívidas": "Plano de reestruturação financeira e mudança de hábitos de consumo",
    "Aposentadoria": "Construção de patrimônio de longo prazo com foco em segurança"
  };

  const strategy = responses[data.question1] || "Desenvolvimento de habilidades de alto valor e criação de múltiplas fontes de renda";

  return {
    revelacao: `${data.name}, sua essência única vibra no número ${numerology.finalNumber}, despertando o ${archetype.name} que habita em você.`,
    arquetipo: archetype.name,
    essencia: archetype.essence,
    obstaculo: obstacle,
    acao_imediata: "Nos próximos 7 dias, escolha UMA ação específica e execute sem perfeicionismo",
    numero_final: numerology.finalNumber
  };
};

// Função para obter resposta de fallback
const getFallbackResponse = (data, numerology) => {
  return {
    revelacao: `${data.name}, sua essência única vibra no número ${numerology.finalNumber}, despertando o Arquiteto da Abundância que habita em você.`,
    arquetipo: "Arquiteto da Abundância",
    essencia: "Liderança e inovação",
    obstaculo: "Procrastinação excessiva que paralisa sua ação",
    acao_imediata: "Nos próximos 7 dias, escolha UMA ação específica e execute sem perfeicionismo",
    numero_final: numerology.finalNumber
  };
};

// Health check - rota principal para Docker healthcheck
app.get('/health', (req, res) => {
  console.log('🔍 Health check solicitado');
  res.status(200).send('OK');
});

// Health check - rota da API
app.get('/api/health', (req, res) => {
  console.log('🔍 Health check solicitado');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Reset rate limit (apenas para desenvolvimento)
app.post('/api/rate-limit/reset', (req, res) => {
  console.log('🔄 Rate limit reset solicitado');
  res.json({ message: 'Rate limit resetado com sucesso' });
});

// Rota para enviar webhook via backend (evita CORS)
app.post('/api/webhook/send', async (req, res) => {
  try {
    const { webhookUrl, payload } = req.body;
    
    console.log('=== BACKEND WEBHOOK PROXY START ===');
    console.log('Webhook URL:', webhookUrl);
    console.log('Payload size:', JSON.stringify(payload).length, 'bytes');
    console.log('Full payload:', JSON.stringify(payload, null, 2));
    
    if (!webhookUrl || !payload) {
      return res.status(400).json({ 
        success: false, 
        error: 'webhookUrl and payload are required' 
      });
    }
    
    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MapaDNA-Backend-Proxy/1.0',
      },
      timeout: 15000
    });
    
    console.log('=== BACKEND WEBHOOK PROXY SUCCESS ===');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    res.json({ 
      success: true, 
      status: response.status,
      data: response.data 
    });
  } catch (error) {
    console.error('=== BACKEND WEBHOOK PROXY ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.data || 'No response data'
    });
  }
});

// Endpoint principal para gerar oráculo
app.post('/api/oracle/generate', async (req, res) => {
  const startTime = Date.now();
  console.log('🔮 Nova solicitação de oráculo recebida');
  console.log('📊 Dados recebidos:', JSON.stringify(req.body, null, 2));

  try {
    const data = req.body;

    // Validar dados obrigatórios
    if (!data.name || !data.birthDate || !data.question1 || !data.question2) {
      console.log('❌ Dados obrigatórios ausentes');
      return res.status(400).json({
        error: 'Dados obrigatórios ausentes: name, birthDate, question1, question2' 
      });
    }

    // Calcular numerologia
    console.log('🔢 Calculando numerologia...');
    const numerology = calculateNumerology(data.name, data.birthDate);
    console.log('📊 Numerologia calculada:', numerology);

    // Se for chave de teste, usar sempre resposta artificial
    let usedFallback = false;
    
    if (process.env.OPENAI_API_KEY === 'sk-proj-test-key') {
      console.log('🎭 Usando resposta artificial (chave de teste)');
      usedFallback = true;
    } else {
      // Configurar timeout de 10 segundos para OpenAI
      const openaiTimeout = 10000; // 10 segundos
      let openaiResponse = null;

      try {
        console.log('🤖 Enviando requisição para OpenAI...');
        
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
UM bloqueio comum: procrastinação excessiva, excesso de oportunidades, excesso de conhecimentos, excesso de amizades ruins, medo do sucesso, perfeicionismo, etc.

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

        const openaiRequest = axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
              content: 'Você é um oráculo místico especializado em numerologia pitagórica e prosperidade financeira. Responda sempre em JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
          max_tokens: 800,
          temperature: 0.7
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: openaiTimeout
        });

        // Aguardar resposta com timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('OpenAI timeout')), openaiTimeout)
        );

        openaiResponse = await Promise.race([openaiRequest, timeoutPromise]);
        
        console.log('✅ Resposta da OpenAI recebida em', Date.now() - startTime, 'ms');
        console.log('📝 Tokens usados:', openaiResponse.data.usage?.total_tokens || 'N/A');

      } catch (openaiError) {
        console.log('⚠️ Erro na OpenAI ou timeout:', openaiError.message);
        console.log('🔄 Usando resposta artificial...');
        usedFallback = true;
      }
    }

    let oracleData;

    if (usedFallback || !openaiResponse) {
      // Usar resposta artificial baseada no histórico
      console.log('⏳ Simulando processamento de 10 segundos...');
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10 segundos de delay
      oracleData = generateArtificialResponse(data, numerology);
      console.log('🎭 Resposta artificial gerada');
    } else {
      // Processar resposta da OpenAI
      try {
        const content = openaiResponse.data.choices[0].message.content;
        console.log('📄 Conteúdo recebido da OpenAI:', content.substring(0, 200) + '...');
        
        // Tentar extrair JSON da resposta
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          oracleData = JSON.parse(jsonMatch[0]);
          console.log('✅ JSON extraído com sucesso');
        } else {
          throw new Error('JSON não encontrado na resposta');
        }
      } catch (parseError) {
        console.log('❌ Erro ao processar resposta da OpenAI:', parseError.message);
        console.log('🔄 Usando resposta artificial...');
        oracleData = generateArtificialResponse(data, numerology);
        usedFallback = true;
      }
    }

    // Garantir que todos os campos necessários existam
    const finalResponse = {
      revelacao: oracleData.revelacao || getFallbackResponse(data, numerology).revelacao,
      arquetipo: oracleData.arquetipo || 'Arquiteto da Abundância',
      essencia: oracleData.essencia || 'Liderança e inovação',
      obstaculo: oracleData.obstaculo || 'Procrastinação excessiva que paralisa sua ação',
      acao_imediata: oracleData.acao_imediata || 'Nos próximos 7 dias, escolha UMA ação específica e execute sem perfeicionismo',
      numero_final: oracleData.numero_final || numerology.finalNumber
    };

    console.log('🎯 Resposta final preparada');
    console.log('📊 Tempo total:', Date.now() - startTime, 'ms');
    console.log('🔄 Fallback usado:', usedFallback);

    // Enviar dados para webhook (assíncrono)
    sendOracleDataToWebhook(finalResponse, data).catch(error => {
      console.error('❌ Erro ao enviar webhook:', error.message);
    });

    res.json(finalResponse);

  } catch (error) {
    console.error('💥 Erro no servidor:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
});

// Função para enviar dados do oráculo para webhook
async function sendOracleDataToWebhook(oracleData, userData) {
  const webhookUrl = process.env.WEBHOOK_URL || 'https://wbn.araxa.app/webhook/mapa-dna-financeiro';
  const timestamp = new Date().toISOString();
  
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
      oracle_data: {
        revelacao: oracleData.revelacao,
        arquetipo: oracleData.arquetipo,
        essencia: oracleData.essencia,
        obstaculo: oracleData.obstaculo,
        acao_imediata: oracleData.acao_imediata,
        numero_final: oracleData.numero_final
      },
      
      // Metadados
      timestamp: timestamp,
      event_type: 'oracle_generated'
    };

    console.log('=== BACKEND WEBHOOK DEBUG START ===');
    console.log('Timestamp:', timestamp);
    console.log('Webhook URL:', webhookUrl);
    console.log('Payload size:', JSON.stringify(payload).length, 'bytes');
    console.log('User data keys:', Object.keys(userData));
    console.log('Oracle data keys:', Object.keys(oracleData));
    console.log('Full payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MapaDNA-Backend/1.0',
      },
      timeout: 15000
    });

    console.log('=== BACKEND WEBHOOK SUCCESS ===');
    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);
    console.log('=== BACKEND WEBHOOK DEBUG END ===');
    return true;
  } catch (error) {
    console.error('=== BACKEND WEBHOOK ERROR ===');
    console.error('Error timestamp:', timestamp);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response statusText:', error.response.statusText);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
      console.error('Request config:', error.config);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    console.error('=== BACKEND WEBHOOK DEBUG END ===');
    return false;
  }
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Rate limiting: ${process.env.NODE_ENV === 'production' ? 'ATIVO' : 'DESATIVADO'}`);
  console.log(`🔗 Webhook URL: ${process.env.WEBHOOK_URL || 'https://wbn.araxa.app/webhook/mapa-dna-financeiro'}`);
});
