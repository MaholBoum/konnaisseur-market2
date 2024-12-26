export interface WalletState {
  address: string | null;
  balance: string | null;
}

export interface TronWindow extends Window {
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
  tronLink?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    tronWeb?: any;
  };
}