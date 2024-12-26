import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        ready: () => void;
        expand: () => void;
        showPaymentModal: () => void;
      };
    };
  }
}

export const useTelegramWebApp = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initData, setInitData] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initTelegramWebApp = () => {
      if (window.Telegram?.WebApp) {
        console.log('Initializing Telegram WebApp...');
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        setInitData(window.Telegram.WebApp.initData);
        setIsInitialized(true);
      } else {
        console.log('Telegram WebApp not available');
        toast({
          title: "Not in Telegram",
          description: "Please open this app in Telegram",
          variant: "destructive",
        });
      }
    };

    initTelegramWebApp();
  }, []);

  const showPayment = () => {
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.showPaymentModal();
      } catch (error) {
        console.error('Payment modal error:', error);
        toast({
          title: "Payment Error",
          description: "Unable to open payment interface",
          variant: "destructive",
        });
      }
    }
  };

  return {
    isInitialized,
    initData,
    showPayment,
  };
};