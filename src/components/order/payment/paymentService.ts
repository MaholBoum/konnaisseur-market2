import { supabase } from '@/integrations/supabase/client';

export const processPaymentTransaction = async (amount: number): Promise<string> => {
  console.log('Processing CryptoBot payment for amount:', amount);
  
  if (!window.Telegram?.WebApp) {
    throw new Error('Telegram WebApp is not initialized');
  }

  try {
    // Format amount to TON format (2 decimal places)
    const formattedAmount = amount.toFixed(2);
    
    // Initiate CryptoBot payment
    window.Telegram.WebApp.openInvoice(`ton_${formattedAmount}`);
    
    // Return a placeholder transaction hash
    // In a real implementation, you would get this from the payment callback
    return `payment_${Date.now()}`;
  } catch (error) {
    console.error('Payment processing error:', error);
    throw new Error('Payment processing failed');
  }
};