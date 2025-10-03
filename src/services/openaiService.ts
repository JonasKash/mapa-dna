interface OracleResponse {
  revelacao: string;
  arquetipo: string;
  essencia: string;
  acao_imediata: string;
}

interface FunnelData {
  name: string;
  birthDate: string;
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
  try {
    console.log('=== FRONTEND: Calling Oracle API ===');
    console.log('Data being sent:', JSON.stringify(data, null, 2));
    console.log('Backend URL:', `${BACKEND_URL}/api/oracle/generate`);
    
    // Chama o backend ao invés da OpenAI diretamente
    const response = await fetch(`${BACKEND_URL}/api/oracle/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend API error:', errorData);
      
      // Tratamento específico para rate limiting
      if (response.status === 429) {
        throw new Error(`RATE_LIMIT_EXCEEDED: ${errorData.message || 'Limite de requisições excedido'}`);
      }
      
      throw new Error(`Backend API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const oracleData = await response.json() as OracleResponse;
    console.log('Oracle data received:', oracleData);
    return oracleData;

  } catch (error) {
    console.error('Error generating oracle revelation:', error);
    console.log('Throwing error instead of using fallback');
    
    // Throw error instead of using fallback for debug
    throw error;
  }
};
