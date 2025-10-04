import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useTracking } from '@/hooks/useTracking';
import { sendWebhookData, createWebhookPayload } from '@/services/webhookService';
import { generateOracleRevelation } from '@/services/openaiService';

export interface OracleData {
  revelacao: string;
  arquetipo: string;
  essencia: string;
  obstaculo: string;
  acao_imediata: string;
  numero_final: number;
}

export interface FunnelData {
  name: string;
  birthDate: string;
  question1: string;
  question2: string;
  money: number;
  currentStep: number;
  achievements: string[];
  monthlyPotential: number;
  oracleData?: OracleData;
  isGeneratingOracle: boolean;
}

interface FunnelContextType {
  data: FunnelData;
  updateData: (updates: Partial<FunnelData>) => void;
  addMoney: (money: number) => void;
  addAchievement: (achievement: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetFunnel: () => void;
  calculateMonthlyPotential: () => number;
  sendWebhook: (eventType: 'payment_click' | 'quiz_complete' | 'data_collected' | 'oracle_generated') => Promise<boolean>;
  sendWebhookWithData: (eventType: 'payment_click' | 'quiz_complete' | 'data_collected' | 'oracle_generated', customData?: Partial<FunnelData>) => Promise<boolean>;
  generateOracle: () => Promise<void>;
}

const initialData: FunnelData = {
  name: '',
  birthDate: '',
  question1: '',
  question2: '',
  money: 100, // Starting bonus em dinheiro
  currentStep: 1,
  achievements: ['Jornada Iniciada'],
  monthlyPotential: 0,
  oracleData: undefined,
  isGeneratingOracle: false,
};

const FunnelContext = createContext<FunnelContextType | undefined>(undefined);

export const FunnelProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<FunnelData>(initialData);
  const trackingData = useTracking();
  
  console.log('FunnelProvider - trackingData:', trackingData);

  const updateData = useCallback((updates: Partial<FunnelData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const addMoney = useCallback((money: number) => {
    setData((prev) => ({ ...prev, money: prev.money + money }));
  }, []);

  const addAchievement = useCallback((achievement: string) => {
    setData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, achievement],
    }));
  }, []);

  const nextStep = useCallback(() => {
    setData((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, []);

  const previousStep = useCallback(() => {
    setData((prev) => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  }, []);

  const resetFunnel = useCallback(() => {
    setData(initialData);
  }, []);

  const calculateMonthlyPotential = useCallback(() => {
    // Base mínimo de R$ 1.800
    const baseAmount = 1800;
    
    // Multiplicador baseado no dinheiro acumulado
    const moneyMultiplier = data.money / 100; // Cada R$ 100 = 1x multiplicador
    
    // Bônus por conquistas
    const achievementBonus = data.achievements.length * 200;
    
    // Cálculo final: base + (dinheiro * multiplicador) + bônus de conquistas
    const monthlyPotential = Math.round(baseAmount + (data.money * moneyMultiplier) + achievementBonus);
    
    // Garantir que seja pelo menos R$ 1.800
    return Math.max(monthlyPotential, 1800);
  }, [data.money, data.achievements]);

  const sendWebhook = useCallback(async (eventType: 'payment_click' | 'quiz_complete' | 'data_collected' | 'oracle_generated'): Promise<boolean> => {
    console.log('sendWebhook called with eventType:', eventType);
    console.log('Current funnel data:', data);
    console.log('Tracking data:', trackingData);
    
    if (!trackingData) {
      console.error('Tracking data not available');
      return false;
    }

    // Force a small delay to ensure state is updated
    await new Promise(resolve => setTimeout(resolve, 50));

    const payload = createWebhookPayload(data, trackingData, eventType);
    console.log('Created webhook payload:', payload);
    return await sendWebhookData(payload);
  }, [data, trackingData]);

  const sendWebhookWithData = useCallback(async (eventType: 'payment_click' | 'quiz_complete' | 'data_collected' | 'oracle_generated', customData?: Partial<FunnelData>): Promise<boolean> => {
    console.log('sendWebhookWithData called with eventType:', eventType);
    console.log('Custom data:', customData);
    console.log('Current funnel data:', data);
    console.log('Tracking data:', trackingData);
    
    if (!trackingData) {
      console.error('Tracking data not available');
      return false;
    }

    // Merge current data with custom data
    const mergedData = { ...data, ...customData };
    console.log('Merged data for webhook:', mergedData);

    const payload = createWebhookPayload(mergedData, trackingData, eventType);
    console.log('Created webhook payload with custom data:', payload);
    return await sendWebhookData(payload);
  }, [data, trackingData]);

  const generateOracle = useCallback(async () => {
    console.log('=== CONTEXT: generateOracle called ===');
    console.log('Current data:', data);
    console.log('oracleData exists:', !!data.oracleData);
    console.log('isGeneratingOracle:', data.isGeneratingOracle);
    
    if (data.oracleData || data.isGeneratingOracle) {
      console.log('Oracle already generated or generating, skipping...');
      return; // Já gerou ou está gerando
    }

    console.log('Setting isGeneratingOracle to true');
    setData(prev => ({ ...prev, isGeneratingOracle: true }));

    // Garantir que o loading seja exibido por pelo menos 10 segundos
    const startTime = Date.now();
    const minLoadingTime = 10000; // 10 segundos

    try {
      console.log('Calling generateOracleRevelation with data:', data);
      const oracleData = await generateOracleRevelation(data);
      console.log('Oracle data received in context:', oracleData);
      
      // Calcular tempo restante para completar 10 segundos
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      if (remainingTime > 0) {
        console.log(`Waiting additional ${remainingTime}ms to complete 10 second loading...`);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setData(prev => ({ 
        ...prev, 
        oracleData, 
        isGeneratingOracle: false 
      }));
    } catch (error) {
      console.error('Error generating oracle revelation:', error);
      
      // Calcular tempo restante para completar 10 segundos
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      if (remainingTime > 0) {
        console.log(`Waiting additional ${remainingTime}ms to complete 10 second loading...`);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      // Verificar se é erro de rate limiting
      if (error.message && error.message.includes('RATE_LIMIT_EXCEEDED')) {
        console.log('Rate limit exceeded, showing fallback response');
        // Usar resposta de fallback em caso de rate limiting
      const fallbackData = {
        revelacao: `${data.name}, sua essência única vibra no número 5, despertando o Visionário das Oportunidades que habita em você.`,
        arquetipo: 'Visionário das Oportunidades',
        essencia: 'Força criativa com magnetismo para abundância',
        obstaculo: 'Procrastinação excessiva e medo de começar',
        acao_imediata: 'Estruturar primeira fonte de renda digital em 7 dias',
        numero_final: 5 // Número padrão para fallback
      };
        
        setData(prev => ({ 
          ...prev, 
          oracleData: fallbackData,
          isGeneratingOracle: false
        }));
      } else {
        console.log('Setting oracle data to null to show error state');
        setData(prev => ({ 
          ...prev, 
          isGeneratingOracle: false,
          oracleData: null // Clear oracle data on error
        }));
      }
    }
  }, [data]);

  return (
    <FunnelContext.Provider
      value={{
        data,
        updateData,
        addMoney,
        addAchievement,
        nextStep,
        previousStep,
        resetFunnel,
        calculateMonthlyPotential,
        sendWebhook,
        sendWebhookWithData,
        generateOracle,
      }}
    >
      {children}
    </FunnelContext.Provider>
  );
};

export const useFunnel = () => {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useFunnel must be used within a FunnelProvider');
  }
  return context;
};
