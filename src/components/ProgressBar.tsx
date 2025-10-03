import { useFunnel } from '@/contexts/FunnelContext';

const ProgressBar = () => {
  const { data } = useFunnel();
  const totalSteps = 7;
  const percentage = Math.round((data.currentStep / totalSteps) * 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-primary/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <span className="text-sm font-orbitron text-primary matrix-glow">
              Etapa {data.currentStep}/{totalSteps}
            </span>
            <span className="text-xs text-muted-foreground">
              {percentage}% Completo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-orbitron text-secondary">
              💰 R$ {data.money}
            </span>
          </div>
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 animate-pulse-glow"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
