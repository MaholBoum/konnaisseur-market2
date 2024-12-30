import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CartItem } from './cart/CartItem';
import { CartSummary } from './cart/CartSummary';
import { CouponForm } from './cart/CouponForm';
import { usePaymentProcessor } from '@/components/order/payment/usePaymentProcessor';
import { PaymentButton } from '@/components/order/PaymentButton';

export function Cart() {
  const { items, removeItem, updateQuantity, applyCoupon, couponCode, discount, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('');
  const { toast } = useToast();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discount * subtotal;
  const total = subtotal - discountAmount;

  const { processPayment, isProcessing, paymentRequest } = usePaymentProcessor({
    items,
    subtotal,
    discountAmount,
    total,
    telegramUsername,
    couponCode,
    onSuccess: () => {
      clearCart();
      toast({
        title: "Payment Completed",
        description: "Your payment has been processed successfully.",
      });
    }
  });

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mb-24">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      
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

            <div className="space-y-2">
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
                Telegram Username
              </label>
              <input
                type="text"
                id="telegram"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your Telegram username"
              />
            </div>

            <CartSummary
              subtotal={subtotal}
              discount={discount}
              discountAmount={discountAmount}
              total={total}
              couponCode={couponCode}
            />
          </div>
        </>
      )}

      <PaymentButton
        total={total}
        isProcessing={isProcessing}
        onPayment={processPayment}
        paymentRequest={paymentRequest}
      />
    </div>
  );
}