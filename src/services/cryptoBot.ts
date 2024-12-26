import CryptoBotAPI from 'crypto-bot-api';
import { supabase } from '@/integrations/supabase/client';

// Initialize CryptoBot API with your token
const cryptoBot = new CryptoBotAPI('YOUR_CRYPTOBOT_TOKEN');

export interface CreatePaymentResponse {
  success: boolean;
  paymentUrl?: string;
  error?: string;
}

export const createPayment = async (amount: number, orderId: string): Promise<CreatePaymentResponse> => {
  try {
    console.log('Creating CryptoBot payment for amount:', amount, 'orderId:', orderId);
    
    const payload = {
      amount: amount.toString(),
      asset: 'TON',
      description: `Order #${orderId}`,
      hidden_message: 'Thank you for your purchase!',
      paid_btn_name: 'Return to Shop',
      paid_btn_url: window.location.origin + '/order-success',
      expires_in: 3600 // 1 hour expiration
    };

    const invoice = await cryptoBot.createInvoice(payload);
    console.log('CryptoBot invoice created:', invoice);

    return {
      success: true,
      paymentUrl: invoice.pay_url
    };
  } catch (error) {
    console.error('Error creating CryptoBot payment:', error);
    return {
      success: false,
      error: 'Failed to create payment'
    };
  }
};

export const checkPaymentStatus = async (invoiceId: string): Promise<boolean> => {
  try {
    const invoice = await cryptoBot.getInvoice(invoiceId);
    return invoice.status === 'paid';
  } catch (error) {
    console.error('Error checking payment status:', error);
    return false;
  }
};