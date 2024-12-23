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
      
      // First try to sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `${address.toLowerCase()}@wallet.auth`,
        password: `${address}_${Date.now()}`, // Use a unique password
      });

      if (signUpError && !signUpError.message.includes('User already registered')) {
        console.error('Error signing up:', signUpError);
        throw signUpError;
      }

      // If sign up succeeded or user exists, try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${address.toLowerCase()}@wallet.auth`,
        password: `${address}_${Date.now()}`, // Use the same password format
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
      // Check if TronLink is installed
      if (!window.tronLink) {
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

      // Request account access using TronLink's recommended method
      console.log('Requesting TronLink access...');
      await window.tronLink.request({ method: 'tron_requestAccounts' });
      
      // Wait for TronWeb injection with increased timeout and attempts
      let attempts = 0;
      const maxAttempts = 30; // Increased from 20 to 30
      const interval = 2000; // Increased from 1s to 2s between attempts
      
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
          throw new Error('TronWeb not found after multiple attempts');
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