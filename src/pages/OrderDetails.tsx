import { useCart } from '@/store/useCart';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { OrderHeader } from '@/components/order/OrderHeader';
import { OrderSummary } from '@/components/order/OrderSummary';
import { PaymentButton } from '@/components/order/PaymentButton';
import { CouponInput } from '@/components/order/CouponInput';
import { PhoneInput } from '@/components/order/PhoneInput';
import { PaymentProcessor } from '@/components/order/PaymentProcessor';

export default function OrderDetails() {
  const { items, applyCoupon, couponCode, discount, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discount * subtotal;
  const total = subtotal - discountAmount;
  const orderId = Math.floor(Math.random() * 100000000);

  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
  };

  const { processPayment, isProcessing } = PaymentProcessor({
    items,
    subtotal,
    discountAmount,
    total,
    phoneNumber,
    couponCode,
    onSuccess: () => {
      clearCart();
      navigate('/');
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <OrderHeader />
      
      <OrderSummary 
        items={items}
        subtotal={subtotal}
        discount={discount}
        discountAmount={discountAmount}
        total={total}
        orderId={orderId}
      />

      <div className="bg-white rounded-lg shadow-sm m-4">
        <div className="p-4 space-y-4">
          <CouponInput
            couponInput={couponInput}
            onCouponChange={setCouponInput}
            onApplyCoupon={handleApplyCoupon}
          />

          <PhoneInput
            phoneNumber={phoneNumber}
            onPhoneChange={setPhoneNumber}
          />
        </div>
      </div>

      <PaymentButton 
        total={total}
        isProcessing={isProcessing}
        onPayment={processPayment}
      />
    </div>
  );
}