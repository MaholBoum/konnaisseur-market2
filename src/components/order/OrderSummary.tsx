import { CartItem } from '@/types/product';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { OrderHeader } from './OrderHeader';
import { OrderItems } from './OrderItems';
import { OrderTotals } from './OrderTotals';

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
    const fetchGasPrice = async () => {
      try {
        const tronWeb = (window as any).tronWeb;
        if (tronWeb) {
          const currentBlock = await tronWeb.trx.getCurrentBlock();
          const gasPrice = 420;
          const gasLimit = 150000;
          const estimatedFeeInSun = gasPrice * gasLimit;
          const estimatedFeeInTrx = estimatedFeeInSun / 1_000_000;
          setEstimatedGas(estimatedFeeInTrx);
        }
      } catch (error) {
        console.error('Error fetching gas price:', error);
        setEstimatedGas(0.1);
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
      <OrderHeader orderId={orderId} />
      <div className="py-4">
        <OrderItems items={items} />
        <OrderTotals
          estimatedGas={estimatedGas}
          discount={discount}
          discountAmount={discountAmount}
          total={total}
        />
      </div>
    </div>
  );
};