import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface PaymentButtonProps {
  total: number;
  isProcessing: boolean;
  onPayment: () => Promise<void>;
}

const TON_TO_USD_RATE = 2.5;

export const PaymentButton = ({ total, isProcessing, onPayment }: PaymentButtonProps) => {
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      console.log('Starting payment process...', { total });
      
      // Check if we're in Telegram WebApp environment
      if (!window.Telegram?.WebApp) {
        console.error('Not in Telegram WebApp environment');
        toast({
          title: "Error",
          description: "Please open this app in Telegram",
          variant: "destructive",
        });
        return;
      }

      // Convert USD to TON
      const tonAmount = total / TON_TO_USD_RATE;
      console.log('Converted amount:', { usdAmount: total, tonAmount });

      // Call the parent's payment handler
      await onPayment();
      
      console.log('Payment handler completed successfully');
      
    } catch (error) {
      console.error('Payment process error:', error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred while processing payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
      <Button 
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg rounded-xl"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay ~${(total / TON_TO_USD_RATE).toFixed(2)} TON ($${total.toFixed(2)})`}
      </Button>
    </div>
  );
};