import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { WalletState, TronWindow } from './types';

const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

export const useWalletConnection = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null
  });
  const { toast } = useToast();

  const getTronWeb = () => {
    const tronWindow = window as TronWindow;
    return tronWindow.tronWeb;
  };

  const getUSDTBalance = async (address: string) => {
    const tronWeb = getTronWeb();
    if (!tronWeb?.contract) return '0';

    try {
      const contract = await tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
      const balance = await contract.balanceOf(address).call();
      return (parseInt(balance._hex, 16) / 1e6).toFixed(2);
    } catch (error) {
      console.error('Error getting USDT balance:', error);
      return '0';
    }
  };

  const checkWalletConnection = async () => {
    const tronWeb = getTronWeb();
    if (tronWeb?.defaultAddress?.base58) {
      const address = tronWeb.defaultAddress.base58;
      const balance = await getUSDTBalance(address);
      setWalletState({ address, balance });
    }
  };

  const connectWallet = async () => {
    // Check if TronLink is installed
    if (typeof window.tronLink === 'undefined') {
      toast({
        title: "TronLink Not Found",
        description: "Please install TronLink wallet first",
        variant: "destructive",
      });
      // Open in new tab after a short delay to ensure toast is visible
      setTimeout(() => {
        window.open('https://www.tronlink.org/', '_blank');
      }, 1500);
      return;
    }

    try {
      // Check if TronLink is already connected
      if (!window.tronWeb) {
        console.log('Requesting TronLink connection...');
        await window.tronLink.request({ method: 'tron_requestAccounts' });
      }

      // Wait a bit for TronWeb to be injected after connection
      setTimeout(async () => {
        const tronWeb = getTronWeb();
        
        if (!tronWeb?.defaultAddress?.base58) {
          throw new Error('Failed to connect wallet');
        }

        const address = tronWeb.defaultAddress.base58;
        const balance = await getUSDTBalance(address);
        setWalletState({ address, balance });

        // Create or update user authentication in Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: `${address.toLowerCase()}@wallet.auth`,
          password: address,
        });

        if (authError && authError.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: `${address.toLowerCase()}@wallet.auth`,
            password: address,
          });

          if (signUpError) {
            console.error('Error creating wallet auth:', signUpError);
            toast({
              title: "Error",
              description: "Failed to authenticate wallet",
              variant: "destructive",
            });
            return;
          }
        }

        toast({
          title: "Success",
          description: "Wallet connected successfully!",
        });
      }, 500);

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkWalletConnection();
    const interval = setInterval(checkWalletConnection, 2000);
    return () => clearInterval(interval);
  }, []);

  return {
    ...walletState,
    connectWallet,
  };
};