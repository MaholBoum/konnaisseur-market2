import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/product';

const MERCHANT_ADDRESS = 'TTLxUTKUeqYJzE48CCPmJ2tESrnfrTW8XK';

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
  console.log('Creating order with params:', {
    items,
    subtotal,
    discountAmount,
    total,
    phoneNumber,
    couponCode,
  });

  if (!items.length) {
    console.error('No items provided for order');
    throw new Error('No items provided for order');
  }

  try {
    // Create order
    console.log('Creating order record...');
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        total_amount: subtotal,
        discount_amount: discountAmount,
        final_amount: total,
        coupon_code: couponCode,
        phone_number: phoneNumber,
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order: ' + orderError.message);
    }

    if (!order) {
      console.error('Order was not created (no data returned)');
      throw new Error('Order was not created');
    }

    console.log('Order created successfully:', order);

    // Create order items
    console.log('Creating order items...');
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
      throw new Error('Failed to create order items: ' + itemsError.message);
    }

    console.log('Order items created successfully');

    // Create payment request
    console.log('Creating payment request...');
    const { data: paymentRequest, error: paymentError } = await supabase
      .from('payment_requests')
      .insert([{
        order_id: order.id,
        amount: total,
        wallet_address: MERCHANT_ADDRESS,
        status: 'pending',
        expiry: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour expiry
      }])
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment request:', paymentError);
      throw new Error('Failed to create payment request: ' + paymentError.message);
    }

    if (!paymentRequest) {
      console.error('Payment request was not created (no data returned)');
      throw new Error('Payment request was not created');
    }

    console.log('Payment request created successfully:', paymentRequest);

    return { order, paymentRequest };
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};