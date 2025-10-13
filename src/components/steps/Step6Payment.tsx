import { useState } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import qrCodePix from '@/assets/qrcode-pix.png';

const Step6Payment = () => {
  const { nextStep, sendWebhookWithData, data } = useFunnel();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const pixCode = '00020126430014BR.GOV.BCB.PIX0121agenciavonk@gmail.com520400005303986540519.995802BR5901N6001C62210517MapaDnaFinanceiro63042A70';
  const whatsappLink = 'https://wa.me/5534997101300?text=Ol%C3%A1%20fiz%20a%20compra%20do%20relat%C3%B3rio.%20';

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
      <div className="max-w-2xl w-full space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
          <span className="inline-block px-4 py-2 bg-accent/20 border border-accent rounded-lg text-accent text-xs font-orbitron neon-purple-glow">
            PAGAMENTO SEGURO
          </span>
          
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-primary matrix-glow leading-tight">
            💳 Finalize Seu<br />Acesso Completo
          </h2>
          
          <div className="inline-block">
            <p className="text-5xl font-orbitron matrix-glow" style={{ color: '#B28C36' }}>R$ 19,99</p>
            <p className="text-sm text-muted-foreground">Pagamento único via PIX</p>
          </div>
        </div>

        <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-6 matrix-border">
          <div className="text-center space-y-4">
            <p className="text-sm font-orbitron text-primary">Escaneie o QR Code abaixo:</p>
            
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg inline-block">
                <img 
                  src={qrCodePix} 
                  alt="QR Code PIX" 
                  className="w-64 h-64"
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-xs text-muted-foreground font-orbitron">
                OU COPIE O CÓDIGO PIX:
              </p>
              
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

          <div className="border-t border-primary/30 pt-6 space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              Após realizar o pagamento, clique no botão abaixo:
            </p>

            <Button
              onClick={handlePaymentClick}
              disabled={isLoading}
              size="lg"
              className="w-full text-lg font-orbitron bg-[#25D366] hover:bg-[#20BD5A] text-white border-2 border-[#25D366] shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {isLoading ? 'Hackear a Matrix...' : 'Hackear a Matrix'}
            </Button>
          </div>
        </div>

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

        <div className="text-center pt-4">
          <Button
            onClick={nextStep}
            variant="ghost"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Já fiz o pagamento →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step6Payment;
