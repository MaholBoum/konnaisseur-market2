import { Button } from '@/components/ui/button';
import { createPayment } from '@/services/cryptoBot';
import { useToast } from '@/components/ui/use-toast';

interface PaymentButtonProps {
  total: number;
  isProcessing: boolean;
  onPayment: () => Promise<void>;
  orderId?: string;
}

const TON_TO_USD_RATE = 2.5; // Example fixed rate, in production this should come from an API

export const PaymentButton = ({ total, isProcessing, onPayment, orderId }: PaymentButtonProps) => {
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "Order ID is required for payment",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Converting USD to TON...', { usdAmount: total });
      const tonAmount = total / TON_TO_USD_RATE;
      console.log('Initiating Crypto Pay payment...', { tonAmount, orderId });
      
      const response = await createPayment(tonAmount, orderId);
      
      if (response.success && response.paymentUrl) {
        console.log('Payment URL generated:', response.paymentUrl);
        window.open(response.paymentUrl, '_blank');
        await onPayment();
      } else {
        console.error('Payment creation failed:', response.error);
        toast({
          title: "Payment Error",
          description: response.error || "Failed to create payment",
          variant: "destructive",
        });
      }
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
        disabled={isProcessing || !orderId}
      >
        {isProcessing ? 'Processing...' : `Pay ~${(total / TON_TO_USD_RATE).toFixed(2)} TON ($${total.toFixed(2)})`}
      </Button>
    </div>
  );
};