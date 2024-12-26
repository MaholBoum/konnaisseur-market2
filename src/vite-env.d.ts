/// <reference types="vite/client" />

interface Window {
  Telegram?: {
    WebApp: {
      initData: string;
      ready: () => void;
      expand: () => void;
      showPaymentModal: () => void;
      openInvoice: (invoiceId: string, options?: { callback?: (status: string) => void }) => void;
    };
  };
}