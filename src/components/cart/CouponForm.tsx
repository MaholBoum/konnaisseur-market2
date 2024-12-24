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
        className="bg-card text-card-foreground border-border"
      />
      <Button 
        onClick={onApplyCoupon}
        disabled={isApplyingCoupon}
        variant="outline"
        className="bg-card hover:bg-muted text-card-foreground"
      >
        {isApplyingCoupon ? 'Applying...' : 'Apply'}
      </Button>
    </div>
  );
}