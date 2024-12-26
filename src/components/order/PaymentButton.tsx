import { Button } from '@/components/ui/button';
import { TronWindow } from '@/components/wallet/types';

interface PaymentButtonProps {
  total: number;
  isProcessing: boolean;
  onPayment: () => Promise<void>;
}

export const PaymentButton = ({ total, isProcessing, onPayment }: PaymentButtonProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4">
      <Button 
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg"
        onClick={onPayment}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay ${total.toFixed(2)} USDT`}
      </Button>
    </div>
  );
};