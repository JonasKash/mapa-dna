import { FunnelProvider, useFunnel } from '@/contexts/FunnelContext';
import MatrixRain from '@/components/MatrixRain';
import ProgressBar from '@/components/ProgressBar';
import Step1Welcome from '@/components/steps/Step1Welcome';
import Step2Question1 from '@/components/steps/Step2Question1';
import Step3Question2 from '@/components/steps/Step3Question2';
import Step4DataCollection from '@/components/steps/Step4DataCollection';
import Step5PreviewReport from '@/components/steps/Step5PreviewReport';
import Step6Payment from '@/components/steps/Step6Payment';
import Step7Upsell from '@/components/steps/Step7Upsell';
import WebhookTest from '@/components/WebhookTest';

const FunnelContent = () => {
  const { data } = useFunnel();

  const renderStep = () => {
    switch (data.currentStep) {
      case 1:
        return <Step1Welcome />;
      case 2:
        return <Step2Question1 />;
      case 3:
        return <Step3Question2 />;
      case 4:
        return <Step4DataCollection />;
      case 5:
        return <Step5PreviewReport />;
      case 6:
        return <Step6Payment />;
      case 7:
        return <Step7Upsell />;
      default:
        return <Step1Welcome />;
    }
  };

  return (
    <>
      <MatrixRain />
      {data.currentStep > 0 && <ProgressBar />}
      <div className="relative z-10 pt-20">
        {renderStep()}
      </div>
      {/* Webhook Test Component - Only visible in development */}
      {process.env.NODE_ENV === 'development' && <WebhookTest />}
    </>
  );
};

const Index = () => {
  return (
    <FunnelProvider>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="mobile-container">
          <FunnelContent />
        </div>
      </div>
    </FunnelProvider>
  );
};

export default Index;
