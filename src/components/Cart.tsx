import { useCart } from '@/store/useCart';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CartItem } from './cart/CartItem';
import { CartSummary } from './cart/CartSummary';
import { CouponForm } from './cart/CouponForm';
import { CheckoutButton } from './cart/CheckoutButton';
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Cart</h2>
          
          {items.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty</p>
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

                <CheckoutButton
                  isProcessing={isProcessing}
                  onCheckout={handleCheckout}
                  disabled={items.length === 0}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}