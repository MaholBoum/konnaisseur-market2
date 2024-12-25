import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { WalletState, TronWindow } from './types';

const USDT_CONTRACT_ADDRESS = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj'; // Testnet USDT Contract

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

  const authenticateWithSupabase = async (address: string) => {
    try {
      console.log('Authenticating wallet address with Supabase:', address);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `${address.toLowerCase()}@wallet.auth`,
        password: `${address}_${Date.now()}`,
      });

      if (signUpError && !signUpError.message.includes('User already registered')) {
        console.error('Error signing up:', signUpError);
        throw signUpError;
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${address.toLowerCase()}@wallet.auth`,
        password: `${address}_${Date.now()}`,
      });

      if (signInError) {
        console.error('Error signing in:', signInError);
        throw signInError;
      }

      console.log('Successfully authenticated with Supabase');
      return signInData;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  const connectWallet = async () => {
    try {
      console.log('Starting wallet connection process...');
      const tronWindow = window as TronWindow;
      
      // Check if TronLink is available in any form (extension, mobile, or desktop)
      if (!tronWindow.tronWeb && !tronWindow.tronLink) {
        console.log('No TronLink detected, showing QR or download options');
        // Show different options based on platform
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          toast({
            title: "Open in TronLink Mobile",
            description: "Please open this page in TronLink Mobile browser",
            variant: "default",
          });
          
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
        } else {
          // Desktop without TronLink
          toast({
            title: "TronLink Not Found",
            description: "Please install TronLink wallet first",
            variant: "destructive",
          });
          setTimeout(() => {
            window.open('https://www.tronlink.org/', '_blank');
          }, 1500);
        }
        return;
      }

      console.log('TronLink detected, requesting account access...');
      
      try {
        // Try mobile-specific connection first
        if (tronWindow.tronLink?.tronWeb) {
          console.log('Using TronLink mobile connection method');
          await tronWindow.tronLink.request({ method: 'tron_requestAccounts' });
        } else {
          // Fallback to extension method
          console.log('Using TronLink extension connection method');
          await tronWindow.tronLink?.request({ method: 'tron_requestAccounts' });
        }
      } catch (error) {
        console.error('Error requesting account access:', error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to TronLink. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Wait for TronWeb injection
      let attempts = 0;
      const maxAttempts = 30;
      const interval = 2000;
      
      const waitForTronWeb = setInterval(async () => {
        attempts++;
        console.log(`Checking for TronWeb... Attempt ${attempts}`);

        const tronWeb = getTronWeb();
        if (tronWeb?.defaultAddress?.base58) {
          clearInterval(waitForTronWeb);
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
        } else if (attempts >= maxAttempts) {
          clearInterval(waitForTronWeb);
          console.error('TronWeb not found after', maxAttempts, 'attempts');
          toast({
            title: "Connection Failed",
            description: "Please make sure TronLink is unlocked and try again",
            variant: "destructive",
          });
        }
      }, interval);

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