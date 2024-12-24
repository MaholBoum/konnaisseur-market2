import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CouponFormProps {
  couponInput: string;
  isApplyingCoupon: boolean;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
}

export function CouponForm({ 
  couponInput, 
  isApplyingCoupon, 
  onCouponInputChange, 
  onApplyCoupon 
}: CouponFormProps) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="Enter coupon code"
        value={couponInput}
        onChange={(e) => onCouponInputChange(e.target.value)}
        disabled={isApplyingCoupon}
        className="bg-white dark:bg-[#161616] text-gray-900 dark:text-white border-gray-200 dark:border-gray-800"
      />
      <Button 
        onClick={onApplyCoupon}
        disabled={isApplyingCoupon}
        variant="outline"
        className="bg-white dark:bg-[#161616] hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
      >
        {isApplyingCoupon ? 'Applying...' : 'Apply'}
      </Button>
    </div>
  );
}