import { TronWindow } from '../types/tron';

export const isTronLinkInstalled = () => {
  const tronWindow = window as TronWindow;
  return !!tronWindow.tronLink;
};

export const requestTronLinkAccounts = async () => {
  const tronWindow = window as TronWindow;
  console.log('Requesting TronLink accounts...');
  
  if (!tronWindow.tronLink) {
    throw new Error('TronLink not installed');
  }

  return tronWindow.tronLink.request({ method: 'tron_requestAccounts' });
};