import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Percent } from 'lucide-react';

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
      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={couponInput}
          onChange={(e) => onCouponChange(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={onApplyCoupon}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Percent className="h-4 w-4 mr-2" />
          Apply
        </Button>
      </div>
    </div>
  );
};