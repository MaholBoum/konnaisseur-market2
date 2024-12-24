import { CartItem } from '@/types/product';
import { supabase } from "@/integrations/supabase/client";

interface CreateOrderParams {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
  onSuccess: () => void;
}

export async function createOrder({
  items,
  subtotal,
  discountAmount,
  total,
  couponCode,
  onSuccess
}: CreateOrderParams) {
  console.log('Creating order with items:', items);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      total_amount: subtotal,
      discount_amount: discountAmount,
      final_amount: total,
      coupon_code: couponCode,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) throw orderError;

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

  if (itemsError) throw itemsError;
  
  onSuccess();
}