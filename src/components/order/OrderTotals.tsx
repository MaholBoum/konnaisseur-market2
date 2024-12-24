import { Gauge } from 'lucide-react';

interface OrderTotalsProps {
  estimatedGas: number;
  discount: number;
  discountAmount: number;
  total: number;
}

export function OrderTotals({ estimatedGas, discount, discountAmount, total }: OrderTotalsProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-gray-500">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4" />
          <span>Network Fee (Gas)</span>
        </div>
        <span>~{estimatedGas.toFixed(4)} TRX</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between items-center text-green-600">
          <span>Discount</span>
          <span>-{discountAmount.toFixed(2)} USDT</span>
        </div>
      )}

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Total</span>
          <span className="text-xl font-bold">{total.toFixed(2)} USDT</span>
        </div>
      </div>
    </div>
  );
}