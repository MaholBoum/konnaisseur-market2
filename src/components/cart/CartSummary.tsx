interface CartSummaryProps {
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
}

export function CartSummary({ subtotal, discount, discountAmount, total, couponCode }: CartSummaryProps) {
  return (
    <div className="space-y-2 p-4 rounded-lg bg-gray-50 dark:bg-[#161616] border border-border dark:border-border/10">
      <div className="flex justify-between text-foreground dark:text-gray-200">
        <span>Subtotal</span>
        <span>{subtotal.toFixed(2)} USDT</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-green-500 dark:text-green-400">
          <span>Discount ({couponCode})</span>
          <span>-{discountAmount.toFixed(2)} USDT</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-foreground dark:text-white pt-2 border-t border-border dark:border-border/10">
        <span>Total</span>
        <span>{total.toFixed(2)} USDT</span>
      </div>
    </div>
  );
}