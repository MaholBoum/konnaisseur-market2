import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';

interface PaymentButtonProps {
  total: number;
  isProcessing: boolean;
  onPayment: () => Promise<void>;
}

export const PaymentButton = ({ total, isProcessing, onPayment }: PaymentButtonProps) => {
  const { toast } = useToast();
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();

  const handlePayment = async () => {
    try {
      if (!isConnected) {
        await open();
        return;
      }

      await onPayment();
    } catch (error) {
      console.error('Payment process error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
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
        {!isConnected ? 'Connect Wallet' : isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </div>
  );
};