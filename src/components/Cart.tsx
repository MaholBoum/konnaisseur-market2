import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CartItem } from './cart/CartItem';
import { CartSummary } from './cart/CartSummary';
import { CouponForm } from './cart/CouponForm';

export function Cart() {
  const { items, removeItem, updateQuantity, applyCoupon, couponCode, discount, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discount * subtotal;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const result = await applyCoupon(couponInput.trim());
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const createOrder = async () => {
    try {
      setIsProcessing(true);
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
      
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "Your order has been created and is being processed.",
      });
      
      navigate('/order-details');
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error creating order",
        description: "There was a problem creating your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background text-foreground rounded-lg shadow-lg p-6 max-w-md mx-auto border border-border">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      
      {items.length === 0 ? (
        <p className="text-muted-foreground text-center">Your cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
          ))}

          <div className="mt-6 space-y-4">
            <CouponForm
              couponInput={couponInput}
              isApplyingCoupon={isApplyingCoupon}
              onCouponInputChange={setCouponInput}
              onApplyCoupon={handleApplyCoupon}
            />

            <CartSummary
              subtotal={subtotal}
              discount={discount}
              discountAmount={discountAmount}
              total={total}
              couponCode={couponCode}
            />

            <Button 
              className="w-full"
              onClick={createOrder}
              disabled={isProcessing || items.length === 0}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}