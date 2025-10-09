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
  const webhookUrl = 'https://wbn.araxa.app/webhook/mapa-dna-financeiro';
  const timestamp = new Date().toISOString();
  
  try {
    console.log('=== WEBHOOK DEBUG START ===');
    console.log('Timestamp:', timestamp);
    console.log('Webhook URL:', webhookUrl);
    console.log('Payload size:', JSON.stringify(payload).length, 'bytes');
    console.log('Full payload:', JSON.stringify(payload, null, 2));
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'MapaDNA-Frontend/1.0',
      },
      body: JSON.stringify(payload),
      mode: 'cors' as RequestMode,
      signal: controller.signal,
    };
    
    console.log('Request options:', {
      method: requestOptions.method,
      headers: requestOptions.headers,
      mode: requestOptions.mode,
      bodyLength: requestOptions.body.length
    });
    
    const response = await fetch(webhookUrl, requestOptions);
    clearTimeout(timeoutId);
    
    console.log('=== WEBHOOK RESPONSE ===');
    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response URL:', response.url);
    console.log('Response type:', response.type);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('=== WEBHOOK FAILED ===');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Error Response:', errorText);
      console.error('Response Headers:', Object.fromEntries(response.headers.entries()));
      return false;
    }

    const responseData = await response.text();
    console.log('=== WEBHOOK SUCCESS ===');
    console.log('Response data:', responseData);
    console.log('Response data length:', responseData.length);
    console.log('=== WEBHOOK DEBUG END ===');
    return true;
  } catch (error) {
    console.error('=== WEBHOOK ERROR ===');
    console.error('Error timestamp:', timestamp);
    console.error('Error type:', error.constructor.name);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'AbortError') {
      console.error('Request timed out after 15 seconds');
    }
    
    // Log additional error details
    if (error instanceof TypeError) {
      console.error('Network error or CORS issue');
    }
    
    console.error('=== WEBHOOK DEBUG END ===');
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
    whatsapp: funnelData?.whatsapp || '',
    
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
