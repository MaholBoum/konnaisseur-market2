import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

export function WalletConnect() {
  const { isInitialized, initData, showPayment } = useTelegramWebApp();

  const handlePaymentClick = () => {
    console.log('Opening Telegram payment interface...');
    showPayment();
  };

  return (
    <div className="fixed top-2 right-2 flex items-center gap-2">
      {!isInitialized ? (
        <Button variant="outline" size="sm" className="bg-white" onClick={handlePaymentClick}>
          <Wallet className="w-4 h-4" />
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white px-2 py-1 rounded-md">
            Telegram User
          </span>
        </div>
      )}
    </div>
  );
}