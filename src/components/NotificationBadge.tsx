import { useEffect, useState } from 'react';

interface NotificationBadgeProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const NotificationBadge = ({ message, show, onClose }: NotificationBadgeProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-24 right-4 z-50 transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-card border-2 border-primary rounded-lg p-4 shadow-lg cyber-glow animate-slide-down">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-orbitron text-sm text-primary matrix-glow">
              Conquista Desbloqueada!
            </p>
            <p className="text-xs text-foreground mt-1">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBadge;
