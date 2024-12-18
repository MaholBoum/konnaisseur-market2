/// <reference types="vite/client" />

// Add Ethereum provider type declaration
interface Window {
  ethereum?: {
    request: (request: { method: string }) => Promise<string[]>;
    isMetaMask?: boolean;
  }
}