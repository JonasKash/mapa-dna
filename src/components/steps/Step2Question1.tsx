import { useState } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { useSound } from '@/hooks/useSound';
import { Button } from '@/components/ui/button';
import NotificationBadge from '@/components/NotificationBadge';

const options = [
  { id: 'A', text: 'Multiplicar minha renda de forma constante', points: 50 },
  { id: 'B', text: 'Descobrir oportunidades escondidas', points: 40 },
  { id: 'C', text: 'Segurança Financeira para família', points: 35 },
  { id: 'D', text: 'Liberdade para viver meus sonhos', points: 30 },
];

const Step2Question1 = () => {
  const { updateData, addPoints, addAchievement, nextStep } = useFunnel();
  const { playCoins } = useSound();
  const [selected, setSelected] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleSelect = (option: typeof options[0]) => {
    setSelected(option.id);
    updateData({ question1: option.text });
    addPoints(option.points);
    playCoins();
    
    if (option.points >= 40) {
      addAchievement('Visionário Financeiro');
      setShowNotification(true);
    }

    setTimeout(() => {
      nextStep();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
          <span className="inline-block px-4 py-2 bg-accent/20 border border-accent rounded-lg text-accent text-xs font-orbitron neon-purple-glow">
            QUESTÃO 1/2
          </span>
          
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-primary matrix-glow">
            Qual o seu maior desejo?
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Escolha a opção que mais ressoa com você
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <Button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              className={`h-auto min-h-[140px] p-0 text-left transition-all duration-300 ${
                selected === option.id
                  ? 'bg-primary/20 border-2 border-primary animate-pulse-glow'
                  : 'bg-card hover:bg-card/80 border-2 border-primary/30 hover:border-primary'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-full h-full flex flex-col p-6">
                {/* Header com letra e pontos */}
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="text-2xl font-orbitron text-primary matrix-glow">
                    {option.id}
                  </span>
                  <span className="px-3 py-1 bg-secondary/20 border border-secondary rounded-full text-xs font-orbitron text-secondary">
                    +{option.points} pts
                  </span>
                </div>
                
                {/* Texto principal com área dedicada */}
                <div className="flex-1 w-full mb-3">
                  <p className="text-sm md:text-base text-foreground font-medium leading-relaxed break-words hyphens-auto max-w-full">
                    {option.text}
                  </p>
                </div>

                {/* Notification area dentro do button */}
                {selected === option.id && (
                  <div className="w-full pt-3 border-t border-primary/30 animate-slide-down">
                    <p className="text-xs text-primary matrix-glow">
                      ✓ +{option.points} pontos adicionados
                    </p>
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            💡 Cada escolha revela parte do seu DNA Financeiro
          </p>
        </div>
      </div>

      <NotificationBadge
        message="Visionário Financeiro"
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default Step2Question1;
