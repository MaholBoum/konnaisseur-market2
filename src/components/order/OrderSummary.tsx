import { CartItem } from '@/types/product';
import { useEffect, useState } from 'react';
import { Gauge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  orderId: number;
  phoneNumber?: string;
}

export const OrderSummary = ({ 
  items, 
  subtotal, 
  discount, 
  discountAmount, 
  total, 
  orderId,
  phoneNumber
}: OrderSummaryProps) => {
  const [estimatedGas, setEstimatedGas] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch current gas price from Tron network
    const fetchGasPrice = async () => {
      try {
        const tronWeb = (window as any).tronWeb;
        if (tronWeb) {
          const currentBlock = await tronWeb.trx.getCurrentBlock();
          const gasPrice = 420; // Base gas price in SUN
          const gasLimit = 150000; // Standard gas limit for token transfers
          const estimatedFeeInSun = gasPrice * gasLimit;
          const estimatedFeeInTrx = estimatedFeeInSun / 1_000_000; // Convert to TRX
          setEstimatedGas(estimatedFeeInTrx);
        }
      } catch (error) {
        console.error('Error fetching gas price:', error);
        setEstimatedGas(0.1); // Fallback value
      }
    };

    fetchGasPrice();
  }, []);

  useEffect(() => {
    if (phoneNumber) {
      toast({
        title: "Order Placed Successfully! 🎉",
        description: "Thank you for your order! Our team will call you shortly at " + phoneNumber + " to confirm delivery details.",
        duration: 6000,
      });
    }
  }, [phoneNumber, toast]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm m-4">
      <div className="flex items-start gap-4 border-b pb-4">
        <img
          src="/lovable-uploads/80299426-225e-4da8-a7ca-fcc09a931f22.png"
          alt="Konnaisseur Market"
          className="w-20 h-20 rounded-lg"
        />
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
    </div>
  );
}