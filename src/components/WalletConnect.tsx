import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export function WalletConnect() {
  return (
    <div className="fixed top-2 right-2">
      <Button variant="outline" size="sm" className="bg-white">
        <Wallet className="w-4 h-4" />
      </Button>
    </div>
  );
}