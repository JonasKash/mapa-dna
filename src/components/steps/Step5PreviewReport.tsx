import { useState, useEffect } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { Button } from '@/components/ui/button';

const Step5PreviewReport = () => {
  const { data, nextStep } = useFunnel();
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const calculateLifePath = (birthDate: string) => {
    if (!birthDate) return 0;
    const digits = birthDate.replace(/\D/g, '').split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return sum;
  };

  const lifePath = calculateLifePath(data.birthDate);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="max-w-3xl w-full space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
          <div className="inline-block px-6 py-3 bg-accent/20 border-2 border-accent rounded-lg neon-purple-glow">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏰</span>
              <div className="text-left">
                <p className="text-xs text-accent font-orbitron">OFERTA EXPIRA EM:</p>
                <p className="text-2xl font-orbitron text-accent">
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-primary matrix-glow leading-tight">
            🔥 SISTEMA DECODIFICADO<br />ACESSO LIBERADO! 🔥
          </h2>
          
          <p className="text-xl text-primary font-orbitron matrix-glow">
            DESCUBRA SEU DNA FINANCEIRO:<br />HACKER DE OPORTUNIDADES!
          </p>
          
          <p className="text-base text-foreground">
            Você está prestes a desbloquear o seu verdadeiro potencial financeiro!<br />
            Prepare-se para a transformação!
          </p>
        </div>

        <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-6 matrix-border">
          <div className="text-center">
            <h3 className="text-2xl font-orbitron text-primary matrix-glow mb-4">
              🔮 ANÁLISE COMPLETA - SEU MAPA FINANCEIRO ENERGÉTICO!
            </h3>
            <p className="text-lg text-foreground">
              {data.name}, seu potencial foi identificado e agora vamos detoná-lo!
            </p>
          </div>

          <div className="space-y-4 bg-muted/30 border border-primary/50 rounded-lg p-5">
            <h4 className="text-xl font-orbitron text-primary">🎯 SEU DNA FINANCEIRO DECIFRADO:</h4>
            
            <div className="grid gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-primary/30">
                <span className="text-sm text-muted-foreground">Destino Financeiro:</span>
                <span className="text-3xl font-orbitron text-primary matrix-glow">{lifePath}</span>
              </div>
              <p className="text-sm text-foreground">Poder criativo inato!</p>

              <div className="flex justify-between items-center pb-2 border-b border-primary/30">
                <span className="text-sm text-muted-foreground">Código de Abundância:</span>
                <span className="text-3xl font-orbitron text-primary matrix-glow">10</span>
              </div>
              <p className="text-sm text-foreground">Magnetismo irresistível!</p>

              <div className="flex justify-between items-center pb-2 border-b border-primary/30">
                <span className="text-sm text-muted-foreground">Potencial Mensal:</span>
                <span className="text-2xl font-orbitron text-primary matrix-glow">R$ 2.200</span>
              </div>
              <p className="text-sm text-foreground font-bold">Mas seu verdadeiro potencial é MUITO MAIS!</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-orbitron text-primary">🏆 ARQUÉTIPO DE RIQUEZA: O VISIONÁRIO</h4>
            <p className="text-sm text-foreground">
              Você não é qualquer um, {data.name}! Você é um Visionário! Sua energia natural faz a riqueza fluir através de sua inovação e visão estratégica. Você tem a capacidade de ver oportunidades onde outros veem apenas obstáculos!
            </p>
          </div>

          <div className="space-y-3 bg-muted/30 border border-primary/50 rounded-lg p-5">
            <h4 className="text-lg font-orbitron text-primary">💎 TALENTOS MONETÁRIOS JÁ ATIVOS EM VOCÊ:</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <p className="text-sm text-foreground">
                  Identificação de oportunidades antes da concorrência!
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <p className="text-sm text-foreground">
                  Liderança e inovação são a sua praia.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <p className="text-sm text-foreground">
                  Intuição aguçada para tendências de mercado.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-orbitron text-primary">⚡ SUA ESTRATÉGIA DOURADA PERSONALIZADA!</h4>
            <p className="text-sm text-foreground">
              Com seu Destino {lifePath}, você deve focar em estratégias de alta conversão e otimização máxima do seu tempo. Vamos acelerar sua jornada!
            </p>
          </div>

          <div className="space-y-3 bg-primary/10 border border-primary rounded-lg p-5">
            <h4 className="text-lg font-orbitron text-primary">🚀 PRÓXIMO PASSO CALCULADO PARA VOCÊ:</h4>
            <p className="text-sm text-foreground font-medium">
              Nos próximos 7 dias, comece a estruturar sua saída do CLT e crie sua primeira fonte de renda digital. O tempo de mudar é AGORA!
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-orbitron text-primary">💰 PREVISÕES DE GANHOS, BASEADAS NO SEU DNA:</h4>
            <div className="grid gap-2 text-sm text-foreground">
              <div className="flex justify-between">
                <span>30 dias:</span>
                <span className="font-orbitron text-primary">R$ 1.343</span>
              </div>
              <div className="flex justify-between">
                <span>90 dias:</span>
                <span className="font-orbitron text-primary">R$ 3.741</span>
              </div>
              <div className="flex justify-between">
                <span>180 dias:</span>
                <span className="font-orbitron text-primary">R$ 6.294</span>
              </div>
            </div>
          </div>

          <div className="bg-destructive/20 border-2 border-destructive rounded-lg p-4">
            <h4 className="text-lg font-orbitron text-destructive mb-2">🔥 BLOQUEIOS ENERGÉTICOS DETECTADOS!</h4>
            <p className="text-sm text-foreground">
              Você está com um teto mental baixo, e seus números revelam que você pode triplicar seu potencial. É hora de quebrar essas barreiras e fazer acontecer!
            </p>
          </div>

          <div className="bg-muted/30 backdrop-blur-sm border-2 border-primary/50 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse" />
            <div className="relative z-10 space-y-3">
              <p className="text-base text-center font-orbitron text-primary">
                📈 ESTA É APENAS UMA PRÉVIA DO SEU POTENCIAL...
              </p>
              <p className="text-sm text-center text-foreground font-medium">
                NO RELATÓRIO COMPLETO POR APENAS R$ 10, você vai descobrir:
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary rounded-lg p-6 space-y-4 animate-pulse-glow">
          <div className="text-center space-y-3">
            <p className="text-2xl font-orbitron text-primary matrix-glow">
              💥 APROVEITE A OFERTA DE LANÇAMENTO - SOMENTE HOJE! 💥
            </p>
            <p className="text-lg font-orbitron text-foreground">
              ⚡ DESEJA DESBLOQUEAR SEU POTENCIAL COMPLETO?
            </p>
            <p className="text-base text-primary font-bold">
              RELATÓRIO COMPLETO + ESTRATÉGIAS AVANÇADAS!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl line-through text-muted-foreground">R$ 49,90</span>
            <span className="text-5xl font-orbitron text-primary matrix-glow">R$ 10,00</span>
          </div>

          <Button
            onClick={nextStep}
            size="lg"
            className="w-full text-xl font-orbitron bg-primary hover:bg-primary/80 text-primary-foreground border-2 border-primary shadow-lg hover:shadow-xl transition-all h-16"
          >
            🔓 Desbloquear Relatório Completo
          </Button>

          <div className="space-y-2 text-sm text-foreground">
            <p className="font-bold">🚀 NO RELATÓRIO COMPLETO, você terá acesso a:</p>
            <ul className="space-y-1 text-xs">
              <li>✅ 15 Números de Poder personalizados + aplicações financeiras!</li>
              <li>✅ Mapa Mensal de Oportunidades para os próximos 6 meses!</li>
              <li>✅ Cronograma dia-a-dia para alcançar seus primeiros R$ 10.000!</li>
              <li>✅ Estratégias específicas para seu perfil numerológico!</li>
              <li>✅ Como atrair parceiros ideais baseado no seu DNA!</li>
              <li>✅ Rituais financeiros que potencializam seus números pessoais!</li>
              <li>✅ Timing perfeito para grandes decisões financeiras!</li>
              <li>✅ Métodos de multiplicação de renda por arquétipo!</li>
              <li>✅ Como superar bloqueios energético-financeiros!</li>
              <li>✅ Plano de escape do CLT em 6 meses (se desejar)!</li>
            </ul>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Pagamento seguro via PIX • Acesso instantâneo
          </p>
        </div>

        <div className="text-center space-y-2">
          <p className="text-base font-orbitron text-primary">
            🚀 NÃO PERCA ESSA CHANCE! O TEMPO É AGORA!
          </p>
          <p className="text-sm text-muted-foreground">
            A hora de mudar sua vida financeira é HOJE! Clique e descubra seu verdadeiro potencial!
          </p>
          <p className="text-xs text-muted-foreground">
            💎 Total de Pontos Acumulados: <span className="text-primary font-orbitron">{data.points}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step5PreviewReport;
