interface OracleResponse {
  revelacao: string;
  arquetipo: string;
  essencia: string;
  obstaculo: string;
  acao_imediata: string;
  numero_final: number;
}

interface FunnelData {
  name: string;
  birthDate: string;
  whatsapp: string;
  question1: string;
  question2: string;
  money: number;
  currentStep: number;
  achievements: string[];
  monthlyPotential: number;
}

// URL do backend - configurável via variável de ambiente ou padrão local
const BACKEND_URL = 'http://localhost:3002';

export const generateOracleRevelation = async (data: FunnelData): Promise<OracleResponse> => {
  const requestId = Math.random().toString(36).substr(2, 9);
  const startTime = Date.now();
  
  try {
    console.log(`=== FRONTEND: Calling Oracle API [${requestId}] ===`);
    console.log(`[${requestId}] Timestamp:`, new Date().toISOString());
    console.log(`[${requestId}] Data being sent:`, JSON.stringify(data, null, 2));
    console.log(`[${requestId}] Backend URL:`, `${BACKEND_URL}/api/oracle/generate`);
    console.log(`[${requestId}] Data size:`, JSON.stringify(data).length, 'bytes');
    
    // Verificar se o backend está acessível
    console.log(`[${requestId}] 🔍 Checking backend connectivity...`);
    const healthCheck = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(error => {
      console.error(`[${requestId}] ❌ Backend health check failed:`, error);
      return null;
    });
    
    if (healthCheck) {
      console.log(`[${requestId}] ✅ Backend health check passed:`, healthCheck.status);
    } else {
      console.log(`[${requestId}] ⚠️ Backend health check failed, proceeding anyway...`);
    }
    
    // Chama o backend ao invés da OpenAI diretamente
    console.log(`[${requestId}] 🚀 Making request to backend...`);
    const fetchStartTime = Date.now();
    
    // Implementar timeout de 10 segundos no frontend
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${BACKEND_URL}/api/oracle/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const fetchEndTime = Date.now();
    console.log(`[${requestId}] ⏱️ Fetch completed in ${fetchEndTime - fetchStartTime}ms`);
    console.log(`[${requestId}] Response status:`, response.status);
    console.log(`[${requestId}] Response ok:`, response.ok);
    console.log(`[${requestId}] Response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.log(`[${requestId}] ❌ Response not ok, parsing error data...`);
      const errorData = await response.json().catch(error => {
        console.error(`[${requestId}] ❌ Failed to parse error response:`, error);
        return { error: 'Failed to parse error response' };
      });
      console.error(`[${requestId}] Backend API error:`, errorData);
      
      // Tratamento específico para rate limiting
      if (response.status === 429) {
        throw new Error(`RATE_LIMIT_EXCEEDED: ${errorData.message || 'Limite de requisições excedido'}`);
      }
      
      throw new Error(`Backend API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    console.log(`[${requestId}] ✅ Response ok, parsing JSON...`);
    const oracleData = await response.json() as OracleResponse;
    console.log(`[${requestId}] Oracle data received:`, oracleData);
    
    const totalTime = Date.now() - startTime;
    console.log(`[${requestId}] 🎉 Frontend request completed successfully in ${totalTime}ms`);
    
    return oracleData;

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`[${requestId}] ❌ Error generating oracle revelation after ${totalTime}ms:`, error);
    console.error(`[${requestId}] Error stack:`, error.stack);
    
    // Se for timeout ou erro de conexão, usar resposta artificial
    if (error.name === 'AbortError' || error.message.includes('ERR_CONNECTION_REFUSED') || error.message.includes('Failed to fetch')) {
      console.log(`[${requestId}] 🎭 Using artificial response due to timeout/connection error`);
      return generateArtificialResponse(data);
    }
    
    console.log(`[${requestId}] Throwing error instead of using fallback`);
    throw error;
  }
};

// Função para gerar resposta artificial no frontend (fallback)
const generateArtificialResponse = (data: FunnelData): OracleResponse => {
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

  // Gerar número aleatório baseado no nome
  const nameHash = data.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomNumber = (nameHash % 9) + 1;
  
  const archetype = archetypes[randomNumber] || archetypes[1];
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
    revelacao: `${data.name}, sua essência única vibra no número ${randomNumber}, despertando o ${archetype.name} que habita em você.`,
    arquetipo: archetype.name,
    essencia: archetype.essence,
    obstaculo: obstacle,
    acao_imediata: "Nos próximos 7 dias, escolha UMA ação específica e execute sem perfeicionismo",
    numero_final: randomNumber
  };
};
