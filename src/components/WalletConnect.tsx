import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface ChainConfig {
  name: string;
  chainId: string;
  rpcUrl: string;
}

const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    name: 'Ethereum',
    chainId: '0x1',
    rpcUrl: 'https://mainnet.infura.io/v3/your-project-id'
  },
  {
    name: 'Binance Smart Chain',
    chainId: '0x38',
    rpcUrl: 'https://bsc-dataseed.binance.org'
  },
  {
    name: 'Polygon',
    chainId: '0x89',
    rpcUrl: 'https://polygon-rpc.com'
  }
];

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkWalletConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(chainId);
          await getBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAddress(accounts[0]);
      getBalance(accounts[0]);
    } else {
      setAddress(null);
      setBalance(null);
    }
  };

  const handleChainChanged = (newChainId: string) => {
    setChainId(newChainId);
    if (address) {
      getBalance(address);
    }
  };

  const getBalance = async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
      setBalance(balanceInEth.toFixed(4));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAddress(accounts[0]);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);
        await getBalance(accounts[0]);
        
        // Create or update user authentication in Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: `${accounts[0].toLowerCase()}@wallet.auth`,
          password: accounts[0],
        });

        if (authError && authError.message.includes('Invalid login credentials')) {
          // If login fails, create a new account
          const { error: signUpError } = await supabase.auth.signUp({
            email: `${accounts[0].toLowerCase()}@wallet.auth`,
            password: accounts[0],
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

      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast({
          title: "Error",
          description: "Failed to connect wallet",
          variant: "destructive",
        });
      }
    } else {
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  const switchChain = async (chainConfig: ChainConfig) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainConfig.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainConfig.chainId,
                rpcUrls: [chainConfig.rpcUrl],
                chainName: chainConfig.name,
                nativeCurrency: {
                  name: chainConfig.name,
                  symbol: chainConfig.name.substring(0, 3).toUpperCase(),
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding chain:', addError);
        }
      }
      console.error('Error switching chain:', error);
    }
  };

  return (
    <div className="fixed top-4 right-4 flex flex-col items-end gap-2">
      {address ? (
        <>
          <div className="flex flex-col items-end gap-1">
            <Button variant="outline" className="font-mono">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </Button>
            {balance && (
              <span className="text-sm text-gray-600">
                Balance: {balance} {chainId === '0x1' ? 'ETH' : chainId === '0x38' ? 'BNB' : 'MATIC'}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {SUPPORTED_CHAINS.map((chain) => (
              <Button
                key={chain.chainId}
                variant="outline"
                size="sm"
                onClick={() => switchChain(chain)}
                className={chainId === chain.chainId ? 'border-green-500' : ''}
              >
                {chain.name.split(' ')[0]}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <Button onClick={connectWallet} className="bg-primary hover:bg-primary/90">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}