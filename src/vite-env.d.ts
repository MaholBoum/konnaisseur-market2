/// <reference types="vite/client" />

interface Window {
  Telegram?: {
    WebApp: {
      initData: string;
      ready: () => void;
      expand: () => void;
      showPaymentModal: () => void;
      openInvoice: (invoiceId: string) => void;
    };
  };
}