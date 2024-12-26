const CRYPTO_PAY_API_URL = 'https://pay.crypt.bot/api';

interface CreateInvoiceResponse {
  ok: boolean;
  result?: {
    invoice_id: number;
    status: string;
    hash: string;
    asset: string;
    amount: string;
    pay_url: string;
  };
  error?: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  paymentUrl?: string;
  error?: string;
}

export const createPayment = async (amount: number, orderId: string): Promise<CreatePaymentResponse> => {
  try {
    console.log('Creating Crypto Pay payment for amount:', amount, 'orderId:', orderId);
    
    const response = await fetch(`${CRYPTO_PAY_API_URL}/createInvoice`, {
      method: 'POST',
      headers: {
        'Crypto-Pay-API-Token': '313364:AAiLXFumujTRlso53c3TMw3MV3aq5S5a5Pr',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        asset: 'TON',
        amount: amount.toString(),
        description: `Order #${orderId}`,
        hidden_message: 'Thank you for your purchase!',
        paid_btn_name: 'Return to Shop',
        paid_btn_url: `${window.location.origin}/order-success`,
        expires_in: 3600 // 1 hour expiration
      })
    });

    const data: CreateInvoiceResponse = await response.json();
    console.log('Crypto Pay API response:', data);

    if (!data.ok || !data.result) {
      throw new Error(data.error || 'Failed to create invoice');
    }

    return {
      success: true,
      paymentUrl: data.result.pay_url
    };
  } catch (error) {
    console.error('Error creating Crypto Pay payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment'
    };
  }
};

export const checkPaymentStatus = async (invoiceId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${CRYPTO_PAY_API_URL}/getInvoice`, {
      method: 'POST',
      headers: {
        'Crypto-Pay-API-Token': '313364:AAiLXFumujTRlso53c3TMw3MV3aq5S5a5Pr',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoice_id: invoiceId
      })
    });

    const data = await response.json();
    return data.ok && data.result?.status === 'paid';
  } catch (error) {
    console.error('Error checking payment status:', error);
    return false;
  }
};