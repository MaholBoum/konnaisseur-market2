import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { createPayment } from '@/services/cryptoBot';
import { useToast } from '@/components/ui/use-toast';

export function WalletConnect() {
  const { toast } = useToast();

  const handlePaymentClick = async () => {
    console.log('Opening CryptoBot payment interface...');
    
    // Create a test payment for 1 TON
    const response = await createPayment(1, 'test-payment');
    
    if (response.success && response.paymentUrl) {
      window.open(response.paymentUrl, '_blank');
    } else {
      toast({
        title: "Payment Error",
        description: response.error || "Failed to create payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed top-2 right-2 flex items-center gap-2">
      <Button variant="outline" size="sm" className="bg-white" onClick={handlePaymentClick}>
        <Wallet className="w-4 h-4 mr-2" />
        Pay with TON
      </Button>
    </div>
  );
}