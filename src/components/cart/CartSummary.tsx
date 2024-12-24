interface CartSummaryProps {
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
}

export function CartSummary({ subtotal, discount, discountAmount, total, couponCode }: CartSummaryProps) {
  return (
    <div className="space-y-2 p-4 rounded-lg bg-background dark:bg-secondary/50 border border-border dark:border-border/50">
      <div className="flex justify-between text-foreground">
        <span>Subtotal</span>
        <span>{subtotal.toFixed(2)} USDT</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-green-500 dark:text-green-400">
          <span>Discount ({couponCode})</span>
          <span>-{discountAmount.toFixed(2)} USDT</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border dark:border-border/50">
        <span>Total</span>
        <span>{total.toFixed(2)} USDT</span>
      </div>
    </div>
  );
}