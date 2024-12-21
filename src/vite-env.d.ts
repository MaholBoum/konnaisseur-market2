/// <reference types="vite/client" />

// Add Ethereum provider type declaration
interface Window {
  ethereum?: {
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    isMetaMask?: boolean;
  }
}