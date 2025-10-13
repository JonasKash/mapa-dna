import { useState } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { useSound } from '@/hooks/useSound';
import { Button } from '@/components/ui/button';
import NotificationBadge from '@/components/NotificationBadge';

const options = [
  { id: 'A', text: 'Quero o guia\nAgora', money: 600 },
  { id: 'B', text: 'Continuar\nPobre', money: 0 },
];

const Step3Question2 = () => {
  const { data, updateData, addMoney, addAchievement, nextStep } = useFunnel();
  const { playAchievement } = useSound();
  const [selected, setSelected] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showLockedMessage, setShowLockedMessage] = useState(false);

  const handleSelect = (option: typeof options[0]) => {
    setSelected(option.id);
    updateData({ question2: option.text });
    
    if (option.id === 'B') {
      // Mostrar mensagem de sistema travado
      setShowLockedMessage(true);
      return;
    }
    
    addMoney(option.money);
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
            <span className="inline-block px-4 py-2 bg-secondary/20 border border-secondary rounded-lg text-xs font-orbitron cyber-glow" style={{ color: '#B28C36' }}>
              R$ {data.money}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-primary matrix-glow leading-tight">
            Mapa do DNA Financeiro
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Receba um guia exclusivo de como usar sua numerologia para fazer dinheiro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
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
                  +R$ {option.money}
                </span>
              </div>
              
              <p className="text-xs md:text-sm text-foreground font-medium leading-tight break-words hyphens-auto max-w-full text-center whitespace-pre-line">
                {option.text}
              </p>

              {selected === option.id && (
                <div className="w-full pt-2 border-t border-primary/30 animate-slide-down">
                  <p className="text-xs matrix-glow" style={{ color: '#B28C36' }}>
                    ✓ +R$ {option.money} adicionados
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

      {/* Mensagem de Sistema Travado */}
      {showLockedMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border-2 border-destructive rounded-lg p-8 text-center max-w-sm mx-4 animate-fade-in-up">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-orbitron text-destructive matrix-glow mb-4">
              Sistema Travado
            </h3>
            <p className="text-muted-foreground text-sm">
              Acesso negado. Opção bloqueada.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3Question2;
