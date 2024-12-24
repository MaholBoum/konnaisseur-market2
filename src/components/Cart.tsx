import { useCart } from '@/store/useCart';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CartItem } from './cart/CartItem';
import { CartContainer } from './cart/CartContainer';
import { CartHeader } from './cart/CartHeader';
import { EmptyCart } from './cart/EmptyCart';
import { CartActions } from './cart/CartActions';
import { createOrder } from './cart/orderService';

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

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      await createOrder({
        items,
        subtotal,
        discountAmount,
        total,
        couponCode,
        onSuccess: () => {
          clearCart();
          toast({
            title: "Order placed successfully!",
            description: "Your order has been created and is being processed.",
          });
          navigate('/order-details');
        }
      });
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
    <CartContainer>
      <CartHeader />
      {items.length === 0 ? (
        <EmptyCart />
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
          
          <CartActions
            subtotal={subtotal}
            discount={discount}
            discountAmount={discountAmount}
            total={total}
            couponCode={couponCode}
            couponInput={couponInput}
            isApplyingCoupon={isApplyingCoupon}
            isProcessing={isProcessing}
            onCouponInputChange={setCouponInput}
            onApplyCoupon={handleApplyCoupon}
            onCheckout={handleCheckout}
          />
        </>
      )}
    </CartContainer>
  );
}