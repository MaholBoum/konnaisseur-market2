/// <reference types="vite/client" />

// Add TronLink type declaration
interface Window {
  ethereum?: {
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    isMetaMask?: boolean;
  };
  tronLink?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    tronWeb?: any;
  };
  tronWeb?: {
    defaultAddress?: {
      base58: string;
    };
    trx?: {
      getBalance: (address: string) => Promise<number>;
    };
    contract?: () => {
      at: (address: string) => Promise<any>;
    };
    fullNode?: {
      getNetwork: () => Promise<{ name: string }>;
    };
  };
}