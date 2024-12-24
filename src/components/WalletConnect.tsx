import { Button } from '@/components/ui/button';
import { Moon, Sun, Wallet } from 'lucide-react';
import { useWalletConnection } from './wallet/useWalletConnection';
import { useEffect, useState } from 'react';

export function WalletConnect() {
  const { address, balance, connectWallet } = useWalletConnection();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is already enabled
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="fixed top-2 right-2 flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="bg-background"
        onClick={toggleDarkMode}
      >
        {isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
      {!address ? (
        <Button variant="outline" size="sm" className="bg-background" onClick={connectWallet}>
          <Wallet className="w-4 h-4" />
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs bg-background px-2 py-1 rounded-md">
            {balance} USDT
          </span>
          <span className="text-xs bg-background px-2 py-1 rounded-md">
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
}