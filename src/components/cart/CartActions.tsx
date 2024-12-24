import { CheckoutButton } from './CheckoutButton';
import { CouponForm } from './CouponForm';
import { CartSummary } from './CartSummary';

interface CartActionsProps {
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
  couponInput: string;
  isApplyingCoupon: boolean;
  isProcessing: boolean;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
  onCheckout: () => void;
}

export function CartActions({
  subtotal,
  discount,
  discountAmount,
  total,
  couponCode,
  couponInput,
  isApplyingCoupon,
  isProcessing,
  onCouponInputChange,
  onApplyCoupon,
  onCheckout
}: CartActionsProps) {
  return (
    <div className="mt-6 space-y-4">
      <CouponForm
        couponInput={couponInput}
        isApplyingCoupon={isApplyingCoupon}
        onCouponInputChange={onCouponInputChange}
        onApplyCoupon={onApplyCoupon}
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
        onCheckout={onCheckout}
        disabled={false}
      />
    </div>
  );
}