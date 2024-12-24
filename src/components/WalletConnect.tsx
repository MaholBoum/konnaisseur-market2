import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWalletConnection } from './wallet/useWalletConnection';

export function WalletConnect() {
  const { address, balance, connectWallet } = useWalletConnection();

  return (
    <div className="fixed top-2 right-2 flex items-center gap-2">
      {!address ? (
        <Button variant="outline" size="sm" className="bg-white" onClick={connectWallet}>
          <Wallet className="w-4 h-4" />
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white px-2 py-1 rounded-md">
            {balance} USDT
          </span>
          <span className="text-xs bg-white px-2 py-1 rounded-md">
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
}