import { useState } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { useSound } from '@/hooks/useSound';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NotificationBadge from '@/components/NotificationBadge';
import { WhatsAppModal } from '@/components/WhatsAppModal';

const Step4DataCollection = () => {
  const { data, updateData, addMoney, addAchievement, nextStep } = useFunnel();
  const { playAchievement } = useSound();
  const [name, setName] = useState(data.name);
  const [birthDate, setBirthDate] = useState(data.birthDate);
  const [showNotification, setShowNotification] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [nameError, setNameError] = useState('');

  // Função para validar o nome
  const validateName = (nameValue: string): string => {
    const trimmedName = nameValue.trim();
    
    // Verifica se está vazio
    if (!trimmedName) {
      return 'Nome é obrigatório';
    }
    
    // Divide o nome em palavras
    const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
    
    // Verifica se tem pelo menos 2 palavras (nome e sobrenome)
    if (words.length < 2) {
      return 'Digite seu nome completo (nome e sobrenome)';
    }
    
    // Verifica se cada palavra tem pelo menos 2 caracteres
    for (const word of words) {
      if (word.length < 2) {
        return 'Cada nome deve ter pelo menos 2 caracteres';
      }
    }
    
    // Verifica caracteres repetidos excessivos (mais de 3 caracteres iguais seguidos)
    for (const word of words) {
      if (/(.)\1{3,}/.test(word)) {
        return 'Nome contém caracteres repetidos inválidos';
      }
    }
    
    // Verifica se contém apenas letras, espaços e acentos
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)) {
      return 'Nome deve conter apenas letras';
    }
    
    return '';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    // Valida o nome em tempo real
    const error = validateName(value);
    setNameError(error);
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limitar a 4 dígitos no ano (formato YYYY-MM-DD)
    if (value.length <= 10) { // 10 caracteres para YYYY-MM-DD
      setBirthDate(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valida o nome antes de prosseguir
    const nameValidationError = validateName(name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }
    
    if (!name || !birthDate) return;

    // Update data first
    updateData({ name, birthDate });
    
    // Show WhatsApp modal instead of going to next step
    setShowWhatsAppModal(true);
  };

  const handleWhatsAppConfirm = (whatsapp: string) => {
    // Update data with WhatsApp
    updateData({ whatsapp });
    addMoney(1000);
    addAchievement('DNA Financeiro Desbloqueado');
    playAchievement();
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    
    // Close modal and go to next step
    setShowWhatsAppModal(false);
    setTimeout(() => {
      nextStep();
    }, 2000);
  };

  const isValid = name.trim() !== '' && birthDate !== '' && !nameError;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in-up">
        <div className="text-center space-y-4">
          <span className="inline-block px-4 py-2 bg-accent/20 border border-accent rounded-lg text-accent text-xs font-orbitron neon-purple-glow">
            DECODIFICAÇÃO DNA
          </span>
          
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-primary matrix-glow leading-tight">
            🔓 Acesso ao<br />Terminal Financeiro
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Insira seus dados para desbloquear seu código único
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-orbitron text-primary matrix-glow">
              {'>'} NOME_COMPLETO:
            </label>
            <Input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Digite seu nome completo..."
              className={`bg-card border-2 text-foreground font-mono h-14 text-lg terminal-cursor ${
                nameError 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-primary/50 focus:border-primary'
              }`}
              required
            />
            {nameError && (
              <p className="text-red-500 text-sm font-orbitron animate-pulse">
                ⚠️ {nameError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-orbitron text-primary matrix-glow">
              {'>'} DATA_NASCIMENTO:
            </label>
            <Input
              type="date"
              value={birthDate}
              onChange={handleBirthDateChange}
              className="bg-card border-2 border-primary/50 focus:border-primary text-foreground font-mono h-14 text-lg"
              max="2024-12-31"
              min="1900-01-01"
              required
            />
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-secondary/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔐</span>
              <div>
                <p className="text-sm font-orbitron text-secondary">Bônus de Desbloqueio</p>
                <p className="text-xs text-muted-foreground">
                  +R$ 1.000 ao completar esta etapa
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!isValid}
            className="w-full text-lg font-orbitron bg-primary hover:bg-primary/80 text-primary-foreground border-2 border-primary shadow-lg hover:shadow-xl transition-all animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValid ? '🚀 Desbloquear DNA Financeiro' : nameError ? '⚠️ Nome inválido' : '⚠️ Preencha todos os campos'}
          </Button>
        </form>

        <div className="grid grid-cols-3 gap-3 pt-4">
          {['Seguro', 'Privado', 'Instantâneo'].map((feature, i) => (
            <div
              key={i}
              className="text-center p-3 bg-card/30 rounded-lg border border-primary/30"
            >
              <p className="text-xs text-primary font-orbitron">✓ {feature}</p>
            </div>
          ))}
        </div>
      </div>

      <NotificationBadge
        message="DNA Financeiro Desbloqueado"
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <WhatsAppModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        onConfirm={handleWhatsAppConfirm}
      />
    </div>
  );
};

export default Step4DataCollection;
