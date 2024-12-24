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
        className="bg-white dark:bg-[#161616] text-foreground dark:text-white border-border dark:border-border/10"
      />
      <Button 
        onClick={onApplyCoupon}
        disabled={isApplyingCoupon}
        variant="outline"
        className="dark:bg-[#161616] dark:hover:bg-[#1f1f1f] dark:border-border/10 dark:text-white"
      >
        {isApplyingCoupon ? 'Applying...' : 'Apply'}
      </Button>
    </div>
  );
}