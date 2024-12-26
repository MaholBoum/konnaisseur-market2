import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { createPayment } from '@/services/cryptoBot';
import { useToast } from '@/components/ui/use-toast';

export function WalletConnect() {
  const { toast } = useToast();

  const handlePaymentClick = async () => {
    try {
      console.log('Opening Crypto Pay payment interface...');
      
      // Create a test payment for 1 TON
      const response = await createPayment(1, 'test-payment');
      console.log('Payment creation response:', response);
      
      if (response.success && response.paymentUrl) {
        console.log('Opening payment URL:', response.paymentUrl);
        // Open in a new tab
        window.open(response.paymentUrl, '_blank');
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
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed top-2 right-2 flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-white hover:bg-gray-100" 
        onClick={handlePaymentClick}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Pay with TON
      </Button>
    </div>
  );
}