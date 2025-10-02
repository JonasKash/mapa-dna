import { useState } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { useSound } from '@/hooks/useSound';
import { Button } from '@/components/ui/button';
import NotificationBadge from '@/components/NotificationBadge';

const options = [
  { id: 'A', text: 'Sim! Quero um caminho claro e personalizado', points: 60 },
  { id: 'B', text: 'Com certeza, preciso de direção', points: 45 },
  { id: 'C', text: 'Talvez, mas quero entender melhor', points: 30 },
  { id: 'D', text: 'Estou curioso para saber mais', points: 25 },
];

const Step3Question2 = () => {
  const { data, updateData, addPoints, addAchievement, nextStep } = useFunnel();
  const { playAchievement } = useSound();
  const [selected, setSelected] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleSelect = (option: typeof options[0]) => {
    setSelected(option.id);
    updateData({ question2: option.text });
    addPoints(option.points);
    playAchievement();
    
    addAchievement('Explorador da Riqueza');
    setShowNotification(true);

    setTimeout(() => {
      nextStep();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <span className="inline-block px-4 py-2 bg-accent/20 border border-accent rounded-lg text-accent text-xs font-orbitron neon-purple-glow">
              QUESTÃO 2/2
            </span>
            <span className="inline-block px-4 py-2 bg-secondary/20 border border-secondary rounded-lg text-secondary text-xs font-orbitron cyber-glow">
              {data.points} PONTOS
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-primary matrix-glow leading-tight">
            Descubra Seu Mapa<br />de Oportunidades
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Você gostaria de um guia personalizado para suas oportunidades financeiras?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <Button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={`h-auto p-6 text-left flex flex-col items-start gap-3 transition-all duration-300 ${
                selected === option.id
                  ? 'bg-primary/20 border-2 border-primary animate-pulse-glow'
                  : 'bg-card hover:bg-card/80 border-2 border-primary/30 hover:border-primary'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl font-orbitron text-primary matrix-glow">
                  {option.id}
                </span>
                <span className="px-3 py-1 bg-secondary/20 border border-secondary rounded-full text-xs font-orbitron text-secondary">
                  +{option.points} pts
                </span>
              </div>
              
              <p className="text-base text-foreground font-medium">
                {option.text}
              </p>

              {selected === option.id && (
                <div className="w-full pt-2 border-t border-primary/30 animate-slide-down">
                  <p className="text-xs text-primary matrix-glow">
                    ✓ +{option.points} pontos adicionados
                  </p>
                </div>
              )}
            </Button>
          ))}
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🎯 Você está a <span className="text-primary font-orbitron">2 etapas</span> de desbloquear seu DNA Financeiro completo
          </p>
        </div>
      </div>

      <NotificationBadge
        message="Explorador da Riqueza"
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default Step3Question2;
