import { useState, useEffect } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { useSound } from '@/hooks/useSound';
import { Button } from '@/components/ui/button';

const Step1Welcome = () => {
  const { nextStep } = useFunnel();
  const { playAchievement } = useSound();
  const [typedText, setTypedText] = useState('');
  const fullText = 'Inicializando Sistema de DNA Financeiro...';

  useEffect(() => {
    playAchievement();
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [playAchievement]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8 animate-fade-in-up">
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/20 border border-primary rounded-lg matrix-glow">
            <p className="text-xs font-mono terminal-cursor" style={{ color: '#B28C36' }}>
              {typedText}
            </p>
          </div>

          <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-primary matrix-glow leading-tight">
            Desperte<br />
            sua<br />
            Vida<br />
            financeira
          </h1>

          <p className="text-lg md:text-xl text-secondary font-orbitron">
            Com a numerologia do dinheiro
          </p>

          <div className="bg-card/50 backdrop-blur-sm border-2 border-primary rounded-lg p-6 matrix-border animate-pulse-glow">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">📊</span>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Bônus de Início:</p>
                <p className="text-2xl font-orbitron text-primary matrix-glow">
                  Relatório Gratuito
                </p>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Análise gratuita da sua numerologia financeira!
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <Button
              onClick={nextStep}
              size="lg"
              className="w-full md:w-auto text-lg font-orbitron bg-primary hover:bg-primary/80 text-primary-foreground border-2 border-primary shadow-lg hover:shadow-xl transition-all animate-pulse-glow"
            >
              🚀 Iniciar Minha Jornada
            </Button>
            <p className="text-xs text-muted-foreground">
              Clique para descobrir seu DNA Financeiro oculto
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8">
          {['Sistema Seguro', 'DNA Único', '100% Digital'].map((feature, i) => (
            <div
              key={i}
              className="text-center p-3 bg-card/30 rounded-lg border border-primary/30"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <p className="text-xs font-orbitron" style={{ color: '#1c31a5' }}>✓ {feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1Welcome;
