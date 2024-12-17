import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Wallet } from 'lucide-react';

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAddress(accounts[0]);
        console.log('Wallet connected:', accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  return (
    <div className="fixed top-4 right-4">
      {address ? (
        <Button variant="outline" className="font-mono">
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </Button>
      ) : (
        <Button onClick={connectWallet} className="bg-primary hover:bg-primary/90">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}