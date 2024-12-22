import { Input } from '@/components/ui/input';

interface CouponInputProps {
  couponInput: string;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
}

export const CouponInput = ({ 
  couponInput, 
  onCouponChange, 
  onApplyCoupon 
}: CouponInputProps) => {
  return (
    <div className="space-y-2">
      <Input
        placeholder="Enter coupon code"
        value={couponInput}
        onChange={(e) => onCouponChange(e.target.value)}
        className="mb-2"
      />
      <button 
        onClick={onApplyCoupon}
        className="text-purple-500 text-sm font-medium"
      >
        Apply Coupon
      </button>
    </div>
  );
};