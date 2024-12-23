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
      const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
      console.log('TronLink response:', res);

      // Wait for TronWeb injection
      let attempts = 0;
      const maxAttempts = 10;
      
      const waitForTronWeb = setInterval(async () => {
        attempts++;
        console.log(`Checking for TronWeb... Attempt ${attempts}`);

        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          clearInterval(waitForTronWeb);
          const address = window.tronWeb.defaultAddress.base58;
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
          throw new Error('TronWeb not found after multiple attempts');
        }
      }, 500);

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