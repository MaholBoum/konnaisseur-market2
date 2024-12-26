import { TronWindow } from '../types/tron';

const USDT_CONTRACT_ADDRESS = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';

export const getTronWeb = () => {
  const tronWindow = window as TronWindow;
  return tronWindow.tronWeb;
};

export const getUSDTBalance = async (address: string) => {
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

export const waitForTronWeb = (maxAttempts = 30, interval = 2000): Promise<boolean> => {
  return new Promise((resolve) => {
    let attempts = 0;
    
    const checkTronWeb = setInterval(() => {
      attempts++;
      console.log(`Checking for TronWeb... Attempt ${attempts}`);

      const tronWeb = getTronWeb();
      if (tronWeb?.defaultAddress?.base58) {
        clearInterval(checkTronWeb);
        resolve(true);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkTronWeb);
        resolve(false);
      }
    }, interval);
  });
};