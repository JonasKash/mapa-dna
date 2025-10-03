interface WebhookPayload {
  // UTM Tracking
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  
  // User Identification
  user_id: string;
  session_id: string;
  
  // User Data
  name: string;
  birth_date: string;
  
  // Quiz Responses
  question1: string;
  question2: string;
  
  // Money and Achievements
  money: number;
  monthly_potential: number;
  achievements: string[];
  
  // Oracle Data (quando disponível)
  oracle_data?: {
    revelacao: string;
    arquetipo: string;
    essencia: string;
    acao_imediata: string;
  };
  
  // Technical Data
  timestamp: string;
  user_agent: string;
  referrer: string;
  current_step: number;
  
  // Event Type
  event_type: 'payment_click' | 'quiz_complete' | 'data_collected' | 'oracle_generated';
}

export const sendWebhookData = async (payload: WebhookPayload): Promise<boolean> => {
  const webhookUrl = 'https://n8n.mapadnafinanceiro.com/webhook-test/mapa-dna';
  
  try {
    console.log('Sending webhook payload:', payload);
    console.log('Webhook URL:', webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      mode: 'cors',
    });

    console.log('Webhook response status:', response.status);
    console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook failed:', response.status, response.statusText, errorText);
      return false;
    }

    const responseData = await response.text();
    console.log('Webhook sent successfully. Response:', responseData);
    return true;
  } catch (error) {
    console.error('Error sending webhook:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};

export const createWebhookPayload = (
  funnelData: any,
  trackingData: any,
  eventType: 'payment_click' | 'quiz_complete' | 'data_collected' | 'oracle_generated'
): WebhookPayload => {
  return {
    // UTM Tracking
    utm_source: trackingData?.utmSource || 'direct',
    utm_medium: trackingData?.utmMedium || 'none',
    utm_campaign: trackingData?.utmCampaign || 'none',
    utm_term: trackingData?.utmTerm || 'none',
    utm_content: trackingData?.utmContent || 'none',
    
    // User Identification
    user_id: trackingData?.userId || 'unknown',
    session_id: trackingData?.sessionId || 'unknown',
    
    // User Data
    name: funnelData?.name || '',
    birth_date: funnelData?.birthDate || '',
    
    // Quiz Responses
    question1: funnelData?.question1 || '',
    question2: funnelData?.question2 || '',
    
    // Money and Achievements
    money: funnelData?.money || 0,
    monthly_potential: funnelData?.monthlyPotential || 0,
    achievements: funnelData?.achievements || [],
    
    // Oracle Data (quando disponível)
    oracle_data: funnelData?.oracleData ? {
      revelacao: funnelData.oracleData.revelacao,
      arquetipo: funnelData.oracleData.arquetipo,
      essencia: funnelData.oracleData.essencia,
      acao_imediata: funnelData.oracleData.acao_imediata
    } : undefined,
    
    // Technical Data
    timestamp: new Date().toISOString(),
    user_agent: trackingData?.userAgent || navigator.userAgent,
    referrer: trackingData?.referrer || document.referrer || 'direct',
    current_step: funnelData?.currentStep || 1,
    
    // Event Type
    event_type: eventType,
  };
};
