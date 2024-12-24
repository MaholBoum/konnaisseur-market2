interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  // Add other WebApp properties as needed
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegramApp = () => {
  const webApp = window.Telegram?.WebApp;

  const initWebApp = () => {
    if (webApp) {
      webApp.ready();
      webApp.expand();
    } else {
      console.warn('Telegram WebApp is not available');
    }
  };

  return {
    webApp,
    initWebApp,
  };
};