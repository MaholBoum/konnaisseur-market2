import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWalletConnection } from './wallet/useWalletConnection';

export function WalletConnect() {
  const { address, balance, connectWallet } = useWalletConnection();

  return (
    <div className="fixed top-4 right-4 flex flex-col items-end gap-2">
      {address ? (
        <div className="flex flex-col items-end gap-1">
          <Button variant="outline" className="font-mono">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </Button>
          {balance && (
            <span className="text-sm text-gray-600">
              Balance: {balance} USDT
            </span>
          )}
        </div>
      ) : (
        <Button onClick={connectWallet} className="bg-primary hover:bg-primary/90">
          <Wallet className="w-4 h-4 mr-2" />
          Connect TronLink
        </Button>
      )}
    </div>
  );
}