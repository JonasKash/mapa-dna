import { useFunnel } from '@/contexts/FunnelContext';
import { Button } from '@/components/ui/button';

const Step7Upsell = () => {
  const { data, calculateMonthlyPotential } = useFunnel();
  const whatsappMentoriaLink = 'https://wa.me/5534997101300?text=Ol%C3%A1%20tenho%20interesse%20na%20mentoria%20personalizada!';

  const isEligible = data.money >= 2000;
  const monthlyPotential = calculateMonthlyPotential();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8 animate-fade-in-up">
        {isEligible ? (
          <>
            <div className="text-center space-y-4">
              <div className="inline-block px-6 py-3 bg-accent/20 border-2 border-accent rounded-lg neon-purple-glow animate-pulse">
                <p className="text-sm font-orbitron text-accent">
                  🏆 ACESSO EXCLUSIVO DESBLOQUEADO
                </p>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-primary matrix-glow leading-tight">
                Parabéns, {data.name}!<br />
                Você está a um passo de se tornar<br />
                <span className="text-secondary">Mestre da Matrix Financeira</span>
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Você atingiu {data.money} pontos e desbloqueou uma oferta única
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20 border-2 border-primary rounded-lg p-8 space-y-6 animate-pulse-glow">
              <div className="text-center space-y-3">
                <p className="text-sm font-orbitron text-accent">MENTORIA PERSONALIZADA</p>
                <p className="text-4xl font-orbitron text-primary matrix-glow">
                  Jornada Exclusiva
                </p>
                <p className="text-sm text-foreground">
                  Acompanhamento individual para maximizar seu potencial financeiro
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  '✓ 4 sessões individuais',
                  '✓ Análise profunda do seu mapa',
                  '✓ Estratégias personalizadas',
                  '✓ Suporte via WhatsApp',
                  '✓ Material exclusivo',
                  '✓ Acesso ao grupo VIP',
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-primary">●</span>
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="border-t border-primary/30 pt-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Apenas 15 vagas este mês</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl line-through text-muted-foreground">R$ 497</span>
                    <span className="text-5xl font-orbitron text-primary matrix-glow">R$ 150</span>
                  </div>
                  <p className="text-xs text-accent">🔥 Desconto exclusivo para membros nível {data.money}+</p>
                </div>

                <a href={whatsappMentoriaLink} target="_blank" rel="noopener noreferrer" className="block">
                  <Button
                    size="lg"
                    className="w-full text-xl font-orbitron bg-primary hover:bg-primary/80 text-primary-foreground border-2 border-primary shadow-lg hover:shadow-xl transition-all h-16"
                  >
                    🚀 Quero a Mentoria
                  </Button>
                </a>

                <p className="text-xs text-center text-muted-foreground">
                  Investimento único • Transformação garantida
                </p>
              </div>
            </div>

            <div className="bg-card/50 border border-primary/30 rounded-lg p-6 space-y-4">
              <p className="text-center text-sm font-orbitron text-primary matrix-glow">
                📊 Seu Progresso na Jornada
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-orbitron text-primary">{data.money}</p>
                  <p className="text-xs text-muted-foreground">Pontos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-orbitron text-primary">{data.achievements.length}</p>
                  <p className="text-xs text-muted-foreground">Conquistas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-orbitron text-primary">100%</p>
                  <p className="text-xs text-muted-foreground">Completo</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-orbitron text-primary matrix-glow">
              Obrigado por completar sua jornada!
            </h2>
            <p className="text-lg text-muted-foreground">
              Você acumulou {data.money} pontos e desbloqueou {data.achievements.length} conquistas.
            </p>
            <div className="bg-card border-2 border-primary rounded-lg p-6">
              <p className="text-sm text-foreground">
                Seu relatório completo foi enviado e está disponível para download.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step7Upsell;
