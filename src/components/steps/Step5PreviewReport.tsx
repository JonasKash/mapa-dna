import { useState, useEffect } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { Button } from '@/components/ui/button';

const Step5PreviewReport = () => {
  const { data, nextStep, generateOracle, sendWebhookWithData } = useFunnel();
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  // Função para dividir o texto da revelação em seções
  const parseRevelationText = (text: string) => {
    // Como agora o texto é mais simples, vamos usar o texto completo como abertura
    return {
      abertura: text,
      nucleo: `Como ${data.oracleData?.arquetipo}, você carrega a energia de ${data.oracleData?.essencia}.`,
      caminho: `Estratégia baseada na sua numerologia pessoal e data de nascimento.`,
      potencial: `30 dias: +40% na renda | 90 dias: +120% na renda | 180 dias: +300% na renda`,
      encerramento: `${data.name}, o número ${data.oracleData?.numero_final} confirma: sua transformação financeira já começou.`
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Gerar revelação do oráculo quando o componente for montado
  useEffect(() => {
    console.log('=== STEP5: useEffect triggered ===');
    console.log('data.name:', data.name);
    console.log('data.birthDate:', data.birthDate);
    console.log('data.oracleData:', data.oracleData);
    console.log('data.isGeneratingOracle:', data.isGeneratingOracle);
    
    if (data.name && data.birthDate && !data.oracleData && !data.isGeneratingOracle) {
      console.log('Calling generateOracle from Step5');
      generateOracle();
    } else {
      console.log('Conditions not met for generateOracle call');
    }
  }, [data.name, data.birthDate, data.oracleData, data.isGeneratingOracle, generateOracle]);

  // Enviar webhook quando o oráculo estiver pronto (silencioso)
  useEffect(() => {
    if (data.oracleData && !data.isGeneratingOracle) {
      console.log('=== STEP5: Oracle ready, sending webhook silently ===');
      console.log('Oracle data:', data.oracleData);
      
      // Enviar webhook com todos os dados do formulário
      console.log('📋 Dados completos antes do webhook:', data);
      sendWebhookWithData('oracle_generated', {
        oracleData: data.oracleData
      });
    }
  }, [data.oracleData, data.isGeneratingOracle, sendWebhookWithData]);

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
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-primary matrix-glow leading-tight">
            🔑 DECODIFICADO<br /> 
          </h2>
          
          <p className="text-xl text-primary font-orbitron matrix-glow">
            DESCUBRA SEU DNA FINANCEIRO:<br />
          </p>
          
          <p className="text-base text-foreground">
            Você está a um passo de desbloquear seu verdadeiro POTENCIAL financeiro!
          </p>
        </div>

        {data.isGeneratingOracle ? (
          <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-6 matrix-border">
            <div className="text-center space-y-6 py-12">
              <div className="animate-spin mx-auto w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
              <h3 className="text-2xl font-orbitron text-primary matrix-glow">
                Pílula Agindo...
              </h3>
              <p className="text-lg text-foreground">
                Sua realidade financeira já está sendo decifrada
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        ) : data.oracleData ? (
          <>

            <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-6 matrix-border">
              <div className="text-center">
                <h3 className="text-2xl font-orbitron text-primary matrix-glow mb-4">
                  🔮 REVELAÇÃO DO ORÁCULO DA PROSPERIDADE
                </h3>
                <p className="text-lg text-foreground">
                  {data.name}, sua numerologia foi decifrada!
                </p>
              </div>

              {(() => {
                const parsedText = parseRevelationText(data.oracleData.revelacao);
                return (
                  <div className="space-y-6">
                    <div className="bg-muted/30 border border-primary/50 rounded-lg p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-orbitron text-primary">🌟 ABERTURA MÍSTICA</h4>
                        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-lg font-bold">
                          {data.oracleData?.numero_final}
                        </div>
                      </div>
                      <div className="text-sm text-foreground leading-relaxed">
                        {parsedText.abertura}
                      </div>
                    </div>

                    <div className="bg-muted/30 border border-primary/50 rounded-lg p-5">
                      <h4 className="text-xl font-orbitron text-primary mb-4">🏆 SEU ARQUÉTIPO: {data.oracleData.arquetipo}</h4>
                      <p className="text-sm text-foreground mb-3">
                        <strong>Essência:</strong> {data.oracleData.essencia}
                      </p>
                      <div className="text-sm text-foreground leading-relaxed">
                        {parsedText.nucleo}
                      </div>
                    </div>


                    <div className="bg-muted/30 border border-primary/50 rounded-lg p-5">
                      <h4 className="text-xl font-orbitron text-primary mb-4">⚡ CAMINHO DOURADO</h4>
                      <div className="text-sm text-foreground leading-relaxed">
                        {parsedText.caminho}
                      </div>
                    </div>

                    <div className="bg-muted/30 border border-primary/50 rounded-lg p-5">
                      <h4 className="text-xl font-orbitron text-primary mb-4">💰 POTENCIAL MATERIAL</h4>
                      <div className="text-sm text-foreground leading-relaxed">
                        {parsedText.potencial}
                      </div>
                    </div>

                    <div className="bg-destructive/20 border-2 border-destructive rounded-lg p-4">
                      <h4 className="text-lg font-orbitron text-destructive mb-2">🔥 OBSTÁCULO INVISÍVEL</h4>
                      <div className="text-sm text-foreground font-semibold">
                        {data.oracleData.obstaculo}
                      </div>
                    </div>

                    <div className="bg-primary/10 border border-primary rounded-lg p-5">
                      <h4 className="text-lg font-orbitron text-primary mb-2">🚀 PRÓXIMO MOVIMENTO</h4>
                      <p className="text-sm text-foreground font-medium">
                        {data.oracleData.acao_imediata}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary rounded-lg p-4">
                      <h4 className="text-lg font-orbitron text-primary mb-2">✨ ENCERRAMENTO MÍSTICO</h4>
                      <div className="text-sm text-foreground font-medium">
                        {parsedText.encerramento}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        ) : (
          <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-6 matrix-border">
            <div className="text-center space-y-4 py-8">
              <h3 className="text-xl font-orbitron text-primary">
                Preparando sua revelação...
              </h3>
              <p className="text-sm text-muted-foreground">
                Aguarde enquanto deciframos seu DNA financeiro
              </p>
            </div>
          </div>
        )}

        {data.oracleData && (
          <>
            <div className="text-center">
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
            </div>

            <div className="bg-muted/30 backdrop-blur-sm border-2 border-primary/50 rounded-lg p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse" />
              <div className="relative z-10 space-y-3">
                <p className="text-base text-center font-orbitron text-primary">
                  📈 ESTA É APENAS UMA PRÉVIA DO SEU POTENCIAL...
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary rounded-lg p-6 space-y-4 animate-pulse-glow">
          <div className="space-y-2 text-sm text-foreground">
            <p className="font-bold text-center text-lg">🚀 NO RELATÓRIO COMPLETO, você terá acesso a:</p>
            <ul className="space-y-1 text-xs">
              <li>✅ O Mapa que vai te levar direto aos seus PRIMEIROS <span style={{ color: '#B28C36' }}>R$ 10.000</span> — sem enrolação!</li>
              <li>✅ Estratégias PERIGOSAMENTE EFICAZES que vão te DESPRENDER da CLT em apenas 6 meses!</li>
              <li>✅ Métodos INFALÍVEIS para multiplicar sua Renda — você vai ver seu dinheiro SE DUPLICAR!</li>
              <li>✅ Como EXPLODIR todos os bloqueios que te mantêm na MISÉRIA e fazer sua vida prosperar como nunca!</li>
            </ul>
          </div>

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
            <span className="text-5xl font-orbitron matrix-glow" style={{ color: '#B28C36' }}>R$ 19,99</span>
          </div>

          <Button
            onClick={() => {
              // Scroll para o topo da página
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // Aguardar um pouco e depois ir para o próximo passo
              setTimeout(() => {
                nextStep();
              }, 500);
            }}
            size="lg"
            className="w-full text-xl font-orbitron bg-primary hover:bg-primary/80 text-primary-foreground border-2 border-primary shadow-lg hover:shadow-xl transition-all h-16"
          >
            🔓 Relatório Completo
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Pagamento seguro via PIX • Acesso instantâneo
          </p>
            </div>
          </>
        )}

        {data.oracleData && (
          <div className="text-center space-y-2">
            <p className="text-base font-orbitron text-primary">
              🚀 NÃO PERCA ESSA CHANCE! O TEMPO É AGORA!
            </p>
            <p className="text-sm text-muted-foreground">
              A hora de mudar sua vida financeira é HOJE! Clique e descubra seu verdadeiro potencial!
            </p>
            <div className="bg-gradient-to-r from-secondary/10 via-primary/10 to-secondary/10 border-2 border-secondary rounded-lg p-4 space-y-3">
              <div className="text-center">
                <p className="text-sm font-orbitron text-secondary">
                  🔒 SEU POTENCIAL ESTÁ AGUARDANDO!
                </p>
              </div>
              <div className="space-y-2 text-xs text-foreground">
                <p className="text-center">
                  Sua numerologia revela um potencial financeiro único esperando para ser LIBERTADO!
                </p>
                <p className="text-center text-muted-foreground">
                  ⚠️ MAS ATENÇÃO! Esse potencial está BLOQUEADO — refém da sua falta de conhecimento sobre como usar sua numerologia a seu favor no dia a dia.
                </p>
                <p className="text-center font-orbitron text-secondary">
                  💡 A VERDADE É SIMPLES: você só conseguirá desbloquear sua fortuna quando dominar as estratégias poderosas do uso da numerologia ao seu favor!
                </p>
                <p className="text-center text-muted-foreground">
                  📈 NÃO PERCA TEMPO! Cada dia que passa, esse potencial fica mais distante de suas mãos. É hora de agir e deixar de ser refém do potencial não realizado!
                </p>
                <p className="text-center font-orbitron text-secondary">
                  🔑 Aprenda a canalizar sua numerologia e veja seu dinheiro FLUIR como nunca antes!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5PreviewReport;
