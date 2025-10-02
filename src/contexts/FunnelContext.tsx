import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface FunnelData {
  name: string;
  birthDate: string;
  question1: string;
  question2: string;
  points: number;
  currentStep: number;
  achievements: string[];
}

interface FunnelContextType {
  data: FunnelData;
  updateData: (updates: Partial<FunnelData>) => void;
  addPoints: (points: number) => void;
  addAchievement: (achievement: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetFunnel: () => void;
}

const initialData: FunnelData = {
  name: '',
  birthDate: '',
  question1: '',
  question2: '',
  points: 10, // Starting bonus
  currentStep: 1,
  achievements: ['Jornada Iniciada'],
};

const FunnelContext = createContext<FunnelContextType | undefined>(undefined);

export const FunnelProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<FunnelData>(initialData);

  const updateData = useCallback((updates: Partial<FunnelData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const addPoints = useCallback((points: number) => {
    setData((prev) => ({ ...prev, points: prev.points + points }));
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

  return (
    <FunnelContext.Provider
      value={{
        data,
        updateData,
        addPoints,
        addAchievement,
        nextStep,
        previousStep,
        resetFunnel,
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
