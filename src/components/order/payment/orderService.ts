import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/product';

interface CreateOrderParams {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  phoneNumber: string;
  couponCode: string | null;
}

export const createOrder = async ({
  items,
  subtotal,
  discountAmount,
  total,
  phoneNumber,
  couponCode,
}: CreateOrderParams) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      total_amount: subtotal,
      discount_amount: discountAmount,
      final_amount: total,
      coupon_code: couponCode,
      phone_number: phoneNumber,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error('Failed to create order');
  }

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    throw new Error('Failed to create order items');
  }

  // Create payment request
  const { data: paymentRequest, error: paymentError } = await supabase
    .from('payment_requests')
    .insert({
      order_id: order.id,
      amount: total,
      wallet_address: 'TTLxUTKUeqYJzE48CCPmJ2tESrnfrTW8XK', // Merchant wallet address
      status: 'pending'
    })
    .select()
    .single();

  if (paymentError) {
    console.error('Error creating payment request:', paymentError);
    throw new Error('Failed to create payment request');
  }

  return { order, paymentRequest };
};