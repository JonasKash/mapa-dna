import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (whatsapp: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [whatsapp, setWhatsapp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp.trim()) return;

    setIsLoading(true);
    
    // Simular delay para UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onConfirm(whatsapp.trim());
    setIsLoading(false);
  };

  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const limited = numbers.slice(0, 11);
    
    // Formata: (XX) XXXXX-XXXX
    if (limited.length <= 2) return limited;
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setWhatsapp(formatted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary rounded-lg p-6 w-full max-w-md matrix-border animate-fade-in-up">
        <div className="text-center space-y-4">
          <div className="text-4xl">📱</div>
          <h2 className="text-2xl font-orbitron text-primary matrix-glow">
            Quase lá!
          </h2>
          <p className="text-foreground">
            Escreva seu WhatsApp para receber o relatório completo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-sm font-medium">
              Número do WhatsApp
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={handleInputChange}
              className="w-full"
              maxLength={15}
              required
            />
            <p className="text-xs text-muted-foreground">
              Digite apenas números, a formatação será feita automaticamente
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 matrix-glow"
              disabled={!whatsapp.trim() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                'Receber Relatório'
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Seus dados estão seguros e não serão compartilhados
          </p>
        </div>
      </div>
    </div>
  );
};
