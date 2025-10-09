import { useState } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { Button } from '@/components/ui/button';

const WebhookTest = () => {
  const { sendWebhookWithData, data } = useFunnel();
  const [isTesting, setIsTesting] = useState(false);
  const [lastResult, setLastResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastTestTime, setLastTestTime] = useState<string>('');

  const testWebhook = async (eventType: 'data_collected' | 'oracle_generated' | 'payment_click' = 'data_collected') => {
    setIsTesting(true);
    setLastResult('idle');
    setLastTestTime(new Date().toLocaleTimeString());
    
    console.log('=== WEBHOOK TEST START ===');
    console.log('Event type:', eventType);
    console.log('Testing webhook with data:', data);
    
    try {
      const success = await sendWebhookWithData(eventType, data);
      console.log('Webhook test result:', success);
      setLastResult(success ? 'success' : 'error');
    } catch (error) {
      console.error('Webhook test error:', error);
      setLastResult('error');
    } finally {
      setIsTesting(false);
      console.log('=== WEBHOOK TEST END ===');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-primary rounded-lg p-3 shadow-lg">
      <div className="space-y-2">
        <div className="text-xs font-orbitron text-primary">Webhook Test</div>
        
        <div className="flex gap-1">
          <Button
            onClick={() => testWebhook('data_collected')}
            disabled={isTesting}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
          >
            Data
          </Button>
          
          <Button
            onClick={() => testWebhook('oracle_generated')}
            disabled={isTesting}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-2 py-1"
          >
            Oracle
          </Button>
          
          <Button
            onClick={() => testWebhook('payment_click')}
            disabled={isTesting}
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
          >
            Payment
          </Button>
        </div>
        
        {isTesting && (
          <div className="flex items-center gap-1 text-xs text-primary">
            <div className="animate-spin w-3 h-3 border border-primary border-t-transparent rounded-full"></div>
            Testing...
          </div>
        )}
        
        {lastResult !== 'idle' && !isTesting && (
          <div className="text-xs">
            <div className={`font-orbitron ${lastResult === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {lastResult === 'success' ? '✅ Success' : '❌ Failed'}
            </div>
            <div className="text-muted-foreground">{lastTestTime}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookTest;
