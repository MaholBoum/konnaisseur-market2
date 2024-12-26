export interface TronLinkWindow {
  tronLink?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    tronWeb?: any;
  };
}

export interface TronWebWindow {
  tronWeb?: {
    defaultAddress?: {
      base58: string;
    };
    contract?: () => {
      at: (address: string) => Promise<any>;
    };
    fullNode?: {
      getNetwork: () => Promise<{ name: string }>;
    };
  };
}

export type TronWindow = TronLinkWindow & TronWebWindow;