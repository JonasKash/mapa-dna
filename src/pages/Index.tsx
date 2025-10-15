import { FunnelProvider, useFunnel } from '@/contexts/FunnelContext';
import MatrixRain from '@/components/MatrixRain';
import Step1Welcome from '@/components/steps/Step1Welcome';
import Step4DataCollection from '@/components/steps/Step4DataCollection';
import Step6Payment from '@/components/steps/Step6Payment';

const FunnelContent = () => {
  const { data } = useFunnel();

  const renderStep = () => {
    switch (data.currentStep) {
      case 1:
        return <Step1Welcome />;
      case 2:
        return <Step4DataCollection />;
      case 3:
        return <Step6Payment />;
      default:
        return <Step1Welcome />;
    }
  };

  return (
    <>
      <MatrixRain />
      <div className="relative z-10">
        {renderStep()}
      </div>
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
