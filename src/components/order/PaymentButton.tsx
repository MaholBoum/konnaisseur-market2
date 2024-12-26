import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useWeb3Modal } from '@web3modal/wagmi';
import { useAccount, useBalance, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';

const USDT_CONTRACT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const MERCHANT_ADDRESS = '0xYourMerchantAddress'; // Replace with your wallet address

interface PaymentButtonProps {
  total: number;
  isProcessing: boolean;
  onPayment: () => Promise<void>;
}

export const PaymentButton = ({ total, isProcessing, onPayment }: PaymentButtonProps) => {
  const { toast } = useToast();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: USDT_CONTRACT as `0x${string}`
  });

  const { writeContract } = useWriteContract();

  const handlePayment = async () => {
    try {
      if (!isConnected) {
        await open();
        return;
      }

      if (!balance || balance.value < parseUnits(total.toString(), 6)) {
        toast({
          title: "Insufficient USDT balance",
          description: "Please make sure you have enough USDT in your wallet",
          variant: "destructive",
        });
        return;
      }

      console.log('Starting USDT transfer...', { total, address });

      writeContract({
        address: USDT_CONTRACT as `0x${string}`,
        abi: [{
          inputs: [
            { name: '_to', type: 'address' },
            { name: '_value', type: 'uint256' },
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function',
        }],
        functionName: 'transfer',
        args: [MERCHANT_ADDRESS as `0x${string}`, parseUnits(total.toString(), 6)],
      }, {
        onSuccess: async () => {
          console.log('USDT transfer successful');
          await onPayment();
          toast({
            title: "Payment Successful",
            description: "Your order has been placed successfully!",
          });
        },
        onError: (error) => {
          console.error('USDT transfer failed:', error);
          toast({
            title: "Payment Failed",
            description: "There was an error processing your payment. Please try again.",
            variant: "destructive",
          });
        },
      });
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
      {!isConnected ? (
        <Button 
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg rounded-xl"
          onClick={() => open()}
        >
          Connect Wallet
        </Button>
      ) : (
        <Button 
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg rounded-xl"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ${total.toFixed(2)} USDT`}
        </Button>
      )}
    </div>
  );
};