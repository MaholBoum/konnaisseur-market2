import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/product';

interface CreateOrderParams {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  phoneNumber: string;
  couponCode: string | null;
  transactionHash: string;
}

export const createOrder = async ({
  items,
  subtotal,
  discountAmount,
  total,
  phoneNumber,
  couponCode,
  transactionHash
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

  return order;
};