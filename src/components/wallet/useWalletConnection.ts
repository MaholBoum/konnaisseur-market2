import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { TronWindow } from './types/tron';
import { isTronLinkInstalled, requestTronLinkAccounts } from './services/tronLinkService';
import { getUSDTBalance, getTronWeb, waitForTronWeb } from './services/tronWebService';

interface WalletState {
  address: string | null;
  balance: string | null;
}

export const useWalletConnection = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null
  });
  const { toast } = useToast();

  const checkWalletConnection = async () => {
    const tronWeb = getTronWeb();
    if (tronWeb?.defaultAddress?.base58) {
      const address = tronWeb.defaultAddress.base58;
      const balance = await getUSDTBalance(address);
      setWalletState({ address, balance });
    }
  };

  const authenticateWithSupabase = async (address: string) => {
    try {
      console.log('Authenticating wallet address with Supabase:', address);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `${address.toLowerCase()}@wallet.auth`,
        password: `${address}_${Date.now()}`,
      });

      if (signUpError && !signUpError.message.includes('User already registered')) {
        throw signUpError;
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${address.toLowerCase()}@wallet.auth`,
        password: `${address}_${Date.now()}`,
      });

      if (signInError) {
        throw signInError;
      }

      console.log('Successfully authenticated with Supabase');
      return signInData;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  const handleMobileRedirect = () => {
    console.log('Handling mobile redirect...');
    // Attempt to open in TronLink mobile if installed
    window.location.href = `tronlinkoutside://version?param=${encodeURIComponent(window.location.href)}`;
    
    // Fallback to app store after a short delay
    setTimeout(() => {
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      if (isIOS) {
        window.location.href = 'https://apps.apple.com/us/app/tronlink/id1453530188';
      } else {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.tronlinkpro.wallet';
      }
    }, 1500);
  };

  const connectWallet = async () => {
    try {
      console.log('Starting wallet connection process...');
      
      if (!isTronLinkInstalled()) {
        console.log('No TronLink detected, showing QR or download options');
        
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          toast({
            title: "Open in TronLink Mobile",
            description: "Please open this page in TronLink Mobile browser",
          });
          handleMobileRedirect();
          return;
        } else {
          toast({
            title: "TronLink Not Found",
            description: "Please install TronLink wallet first",
            variant: "destructive",
          });
          setTimeout(() => {
            window.open('https://www.tronlink.org/', '_blank');
          }, 1500);
          return;
        }
      }

      console.log('TronLink detected, requesting account access...');
      await requestTronLinkAccounts();
      
      const hasTronWeb = await waitForTronWeb();
      if (!hasTronWeb) {
        toast({
          title: "Connection Failed",
          description: "Please make sure TronLink is unlocked and try again",
          variant: "destructive",
        });
        return;
      }

      const tronWeb = getTronWeb();
      if (tronWeb?.defaultAddress?.base58) {
        const address = tronWeb.defaultAddress.base58;
        console.log('TronWeb found with address:', address);
        
        const balance = await getUSDTBalance(address);
        setWalletState({ address, balance });

        try {
          await authenticateWithSupabase(address);
          toast({
            title: "Success",
            description: "Wallet connected successfully!",
          });
        } catch (error: any) {
          console.error('Wallet authentication error:', error);
          toast({
            title: "Error",
            description: "Failed to authenticate wallet",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
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