import { useFunnel } from '@/contexts/FunnelContext';
import { Button } from '@/components/ui/button';

const WebhookTest = () => {
  const { sendWebhookWithData, data } = useFunnel();

  const testWebhook = async () => {
    console.log('Testing webhook with data:', data);
    const success = await sendWebhookWithData('data_collected', data);
    console.log('Webhook test result:', success);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={testWebhook}
        className="bg-red-500 hover:bg-red-600 text-white text-xs"
      >
        Test Webhook
      </Button>
    </div>
  );
};

export default WebhookTest;
