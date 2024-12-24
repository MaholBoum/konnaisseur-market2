import { Button } from '@/components/ui/button';

interface CheckoutButtonProps {
  isProcessing: boolean;
  onCheckout: () => void;
  disabled: boolean;
}

export function CheckoutButton({ isProcessing, onCheckout, disabled }: CheckoutButtonProps) {
  return (
    <Button 
      className="w-full bg-[#9b87f5] hover:bg-[#8b77e5] text-white py-6 text-lg transition-colors duration-200"
      onClick={onCheckout}
      disabled={isProcessing || disabled}
    >
      {isProcessing ? 'Processing...' : 'Place Order'}
    </Button>
  );
}