import { Button } from '@/components/ui/button';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

interface PaymentButtonProps {
  total: number;
  isProcessing: boolean;
  onPayment: () => Promise<void>;
}

export const PaymentButton = ({ total, isProcessing, onPayment }: PaymentButtonProps) => {
  const handlePayment = async () => {
    console.log('Initiating CryptoBot payment...');
    if (window.Telegram?.WebApp) {
      const formattedAmount = total.toFixed(2);
      window.Telegram.WebApp.openInvoice(`ton_${formattedAmount}`);
    }
    await onPayment();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4">
      <Button 
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay ${total.toFixed(2)} TON`}
      </Button>
    </div>
  );
};