import { Button } from '@/components/ui/button';
import { Moon, Sun, Wallet } from 'lucide-react';
import { useWalletConnection } from './wallet/useWalletConnection';
import { useEffect, useState } from 'react';

export function WalletConnect() {
  const { address, balance, connectWallet } = useWalletConnection();
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme');
    if (stored) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply the theme on mount and when it changes
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
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