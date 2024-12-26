import { Button } from '@/components/ui/button';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

interface PaymentButtonProps {
  total: number;
  isProcessing: boolean;
  onPayment: () => Promise<void>;
}

export const PaymentButton = ({ total, isProcessing, onPayment }: PaymentButtonProps) => {
  const { open } = useWeb3Modal()
  const { address } = useAccount()

  const handlePayment = async () => {
    if (!address) {
      await open()
      return
    }
    await onPayment()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4">
      <Button 
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {!address ? 'Connect Wallet' : isProcessing ? 'Processing...' : `Pay ${total.toFixed(2)} USDT`}
      </Button>
    </div>
  );
};