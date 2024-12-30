import { CartItem } from '@/types/product';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  orderId: number;
  telegramUsername?: string;
}

export const OrderSummary = ({ 
  items, 
  subtotal, 
  discount, 
  discountAmount, 
  total, 
  orderId,
  telegramUsername
}: OrderSummaryProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (telegramUsername) {
      toast({
        title: "Order Placed Successfully! 🎉",
        description: "Thank you for your order! Our team will contact you on Telegram at @" + telegramUsername + " to confirm delivery details.",
        duration: 6000,
      });
    }
  }, [telegramUsername, toast]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm m-4">
      <div className="flex items-start gap-4 border-b pb-4">
        <div className="w-20 h-20 flex items-center justify-center text-6xl">
          📦
        </div>
        <div>
          <h2 className="font-bold text-lg">Order #{orderId}</h2>
          <p className="text-lg">Perfect lunch from Durger King.</p>
          <p className="text-gray-500">Konnaisseur Market</p>
        </div>
      </div>

      <div className="py-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                {item.name} x{item.quantity}
              </span>
            </div>
            <span>{item.price.toFixed(2)} USDT</span>
          </div>
        ))}

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
    </div>
  );
}