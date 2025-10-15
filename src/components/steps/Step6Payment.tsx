import { useState, useEffect } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import qrCodePix from '@/assets/qrcode-pix.png';

const Step6Payment = () => {
  const { nextStep, sendWebhookWithData, data } = useFunnel();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos em segundos
  const [showContent, setShowContent] = useState(false); // Controla se mostra o conteúdo principal
  
  const pixCode = '00020126430014BR.GOV.BCB.PIX0121agenciavonk@gmail.com520400005303986540519.995802BR5901N6001C62210517MapaDnaFinanceiro63042A70';
  const whatsappLink = 'https://wa.me/5534997101300?text=Ol%C3%A1%20fiz%20a%20compra%20do%20relat%C3%B3rio.%20';

  // Gerar número aleatório baseado no nome para manter consistência
  const generateLifePathNumber = (name: string) => {
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (nameHash % 9) + 1;
  };

  const lifePathNumber = generateLifePathNumber(data.name);
  
  const archetypeData = {
    1: { name: "Arquiteto da Liderança", essence: "Liderança, iniciativa, independência, coragem e autonomia" },
    2: { name: "Diplomata da Harmonia", essence: "Cooperação, diplomacia, harmonia, empatia, parcerias e equilíbrio" },
    3: { name: "Comunicador Criativo", essence: "Expressão criativa, comunicação, socialização, alegria e otimismo" },
    4: { name: "Construtor da Estabilidade", essence: "Estrutura, organização, trabalho duro, disciplina, lealdade e estabilidade" },
    5: { name: "Explorador da Liberdade", essence: "Liberdade, mudança, versatilidade, aventura, adaptabilidade e transformação" },
    6: { name: "Guardião da Harmonia", essence: "Responsabilidade, harmonia familiar, amor, proteção e equilíbrio nas relações" },
    7: { name: "Místico da Sabedoria", essence: "Introspecção, espiritualidade, busca por conhecimento, análise, sabedoria e introspecção" },
    8: { name: "Magnata do Poder", essence: "Conquista, poder, prosperidade, realização material, ambição e justiça" },
    9: { name: "Filantropo Universal", essence: "Altruísmo, compaixão, sabedoria, encerramento de ciclos, empatia e caridade" }
  };

  const currentArchetype = archetypeData[lifePathNumber] || archetypeData[6];

  // Scroll para o topo quando o componente for montado
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Loading da pílula por 4 segundos
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setShowContent(true);
    }, 4000); // 4 segundos

    return () => clearTimeout(loadingTimer);
  }, []);

  // Timer para habilitar o botão após 3 minutos
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setButtonEnabled(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentClick = async () => {
    setIsLoading(true);
    try {
      // Send webhook data with current data
      await sendWebhookWithData('payment_click', data);
      console.log('Webhook sent successfully for payment click with data:', data);
      
      // Open WhatsApp
      window.open(whatsappLink, '_blank');
    } catch (error) {
      console.error('Error sending webhook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in-up">
        {!showContent ? (
          /* Loading Section - Mostra apenas durante 4 segundos */
          <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-6 matrix-border">
            <div className="text-center space-y-6 py-8">
              <div className="animate-spin mx-auto w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
              <h3 className="text-xl font-orbitron text-primary matrix-glow">
                Pílula Agindo...
              </h3>
              <p className="text-base text-foreground">
                Sua realidade financeira já está sendo decifrada
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        ) : (
          /* Conteúdo Principal - Mostra após 4 segundos */
          <>
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-primary matrix-glow leading-tight">
                🔮 REVELAÇÃO PARCIAL DO SEU DNA FINANCEIRO
              </h2>
            </div>

        {/* Main Content */}
        <div className="bg-card border-2 border-primary rounded-lg p-8 space-y-8 matrix-border">
          {/* Opening Text */}
          <div className="space-y-4">
            <p className="text-lg text-foreground leading-relaxed">
              <strong>{data.name}</strong>, o Oráculo iniciou sua leitura…
            </p>
            <p className="text-base text-foreground leading-relaxed">
              E o que seus números começaram a revelar é algo que poucos conseguem enxergar —
              um traço energético que explica por que a sua vida financeira nunca seguiu o padrão dos outros.
            </p>
          </div>

          {/* Archetype Revealed */}
          <div className="bg-muted/30 border border-primary/50 rounded-lg p-6 space-y-4">
            <div className="text-center">
              <h3 className="text-lg md:text-xl font-orbitron text-primary matrix-glow mb-2">
                ✴️ Essência:
              </h3>
              <h4 className="text-base font-orbitron text-primary mb-1">
                {currentArchetype.name}
              </h4>
              <p className="text-sm font-orbitron text-primary">
                Número {lifePathNumber}
              </p>
            </div>
            <p className="text-base text-foreground leading-relaxed">
              Você nasceu com a vibração da {currentArchetype.essence.toLowerCase()}.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              Carrega o impulso dos que nascem pra abrir caminhos —
              mas quando essa força é mal direcionada, ela vira o bloqueio invisível que prende sua prosperidade.
            </p>
          </div>

          {/* Insight */}
          <div className="bg-accent/10 border border-accent rounded-lg p-6">
            <p className="text-base text-foreground leading-relaxed">
              💡 Você já sentiu que faz mais do que todos, mas o retorno nunca vem na mesma proporção?
            </p>
            <p className="text-base text-foreground leading-relaxed mt-2">
              Isso não é azar. É padrão vibracional.
              E o primeiro passo pra mudar é decifrar o código oculto que rege seu número.
            </p>
          </div>

          {/* What Oracle Discovered */}
          <div className="space-y-4">
            <h3 className="text-lg font-orbitron text-primary matrix-glow">
              ⚡ O QUE O ORÁCULO JÁ DESCOBRIU:
            </h3>
            <ul className="space-y-2 text-base text-foreground">
              <li>• Seu arquétipo financeiro dominante</li>
              <li>• Sua vibração de prosperidade atual</li>
              <li>• O bloqueio energético que trava seus ganhos</li>
            </ul>
          </div>

          {/* But Attention */}
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
            <p className="text-base text-foreground leading-relaxed">
              Mas atenção…
            </p>
            <p className="text-base text-foreground leading-relaxed mt-2">
              Isso é só a superfície do seu mapa.
            </p>
            <p className="text-base text-foreground leading-relaxed mt-2">
              O que o Relatório Completo revela é o verdadeiro manual da sua prosperidade pessoal:
            </p>
          </div>

          {/* Full Report Benefits */}
          <div className="space-y-4">
            <ul className="space-y-3 text-base text-foreground">
              <li>🔮 As datas exatas em que o dinheiro tende a fluir com mais força — quando assinar contratos, investir, lançar projetos ou até pedir um aumento faz diferença real no resultado. E também os períodos em que é melhor recuar e planejar, evitando perdas e decisões impulsivas.</li>
              <li>💫 Os ciclos ocultos da sua prosperidade, que explicam por que em certos meses tudo dá certo — clientes aparecem, oportunidades surgem — e de repente, sem aviso, tudo trava. O relatório mostra como antecipar esses altos e baixos e manter o equilíbrio.</li>
              <li>💎 Seus números de poder pessoais, que influenciam o tipo de dinheiro que você atrai: uns trazem ganhos rápidos, outros estabilidade, outros multiplicação. Saber quais são muda completamente a forma como você age e decide.</li>
              <li>🚀 As estratégias práticas de prosperidade, personalizadas pra sua vibração: desde rituais de foco e rotina energética, até ajustes comportamentais e decisões financeiras conscientes, pra transformar seu potencial vibracional em renda real, concreta e crescente.</li>
            </ul>
            <p className="text-base text-foreground leading-relaxed mt-4">
              Não é adivinhação. É leitura vibracional aplicada à prosperidade.
            </p>
          </div>

          {/* Payment Section */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary rounded-lg p-8 space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg md:text-xl font-orbitron text-primary matrix-glow">
                🔓 SEU RELATÓRIO ESTÁ PRONTO PARA DESBLOQUEIO
              </h3>
              <p className="text-base text-foreground">
                A leitura foi iniciada, mas só será concluída quando o portal for ativado.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-orbitron text-primary">Ao liberar agora, você recebe:</h4>
              <ul className="space-y-2 text-base text-foreground">
                <li>📲 Entrega imediata no WhatsApp</li>
                <li>🔓 Acesso ao seu Mapa Financeiro Completo</li>
                <li>💸 Rotina de Frequência da Atração</li>
                <li>Valor simbólico de ativação: <span className="font-orbitron text-2xl" style={{ color: '#B28C36' }}>R$ 19,99</span></li>
              </ul>
            </div>


            {/* QR Code and PIX */}
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm font-orbitron text-primary mb-4">✨ Para liberar, realize o pagamento via PIX abaixo e ative o código do seu mapa:</p>
                
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img 
                      src={qrCodePix} 
                      alt="QR Code PIX" 
                      className="w-48 h-48"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-muted/30 border border-primary/50 rounded-lg p-3">
                    <p className="text-xs font-mono text-foreground break-all">
                      {pixCode}
                    </p>
                  </div>

                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="w-full font-orbitron border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Código Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Código PIX
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-base font-orbitron text-primary">
                  🎯 Clique abaixo e desbloqueie seu Relatório Completo agora.
                </p>
                <p className="text-sm text-foreground">
                  ✨ O código da sua prosperidade está ativo — só falta você autorizar a entrega
                </p>

                {!buttonEnabled ? (
                  <div className="bg-accent/20 border border-accent rounded-lg p-4">
                    <p className="text-sm text-accent font-orbitron">
                      Aguardando pagamento
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handlePaymentClick}
                    disabled={isLoading}
                    size="lg"
                    className="w-full text-lg font-orbitron bg-[#25D366] hover:bg-[#20BD5A] text-white border-2 border-[#25D366] shadow-lg hover:shadow-xl transition-all h-14"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    {isLoading ? 'Desbloqueando...' : 'DESBLOQUEAR'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

            {/* Security Notice */}
            <div className="bg-muted/30 border border-primary/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-primary text-xl">🔐</span>
                <p className="text-sm text-muted-foreground font-orbitron">
                  Pagamento 100% Seguro
                </p>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Após a confirmação, você receberá acesso imediato ao relatório completo
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Step6Payment;
