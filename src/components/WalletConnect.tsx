import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

export function WalletConnect() {
  const { isInitialized, initData, showPayment } = useTelegramWebApp();

  const handlePaymentClick = () => {
    console.log('Opening CryptoBot payment interface...');
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openInvoice('ton_1.00'); // Example 1 TON payment
    } else {
      console.log('Telegram WebApp not available, showing alternative payment UI');
      showPayment();
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