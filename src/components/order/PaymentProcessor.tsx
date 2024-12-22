import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TronWindow } from '@/components/wallet/types';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/product';

const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const MERCHANT_ADDRESS = 'TTLxUTKUeqYJzE48CCPmJ2tESrnfrTW8XK';

interface PaymentProcessorProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  phoneNumber: string;
  couponCode: string | null;
  onSuccess: () => void;
}

export const PaymentProcessor = ({
  items,
  subtotal,
  discountAmount,
  total,
  phoneNumber,
  couponCode,
  onSuccess
}: PaymentProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const createOrder = async (transactionHash: string) => {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        total_amount: subtotal,
        discount_amount: discountAmount,
        final_amount: total,
        coupon_code: couponCode,
        phone_number: phoneNumber,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw new Error('Failed to create order items');
    }

    return order;
  };

  const processPayment = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number for delivery coordination",
        variant: "destructive",
      });
      return;
    }

    const tronWindow = window as TronWindow;
    if (!tronWindow.tronWeb) {
      toast({
        title: "Error",
        description: "Please install TronLink to make payments",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const address = tronWindow.tronWeb?.defaultAddress?.base58;
      if (!address) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          variant: "destructive",
        });
        return;
      }

      const contract = await tronWindow.tronWeb?.contract().at(USDT_CONTRACT_ADDRESS);
      if (!contract) {
        throw new Error('Failed to load USDT contract');
      }

      const amount = (total * 1e6).toString();

      console.log('Initiating transaction:', {
        from: address,
        to: MERCHANT_ADDRESS,
        amount: amount,
        phoneNumber: phoneNumber
      });

      const transaction = await contract.transfer(
        MERCHANT_ADDRESS,
        amount
      ).send();

      console.log('Transaction hash:', transaction);

      await createOrder(transaction);
      
      toast({
        title: "Success",
        description: "Payment processed successfully!",
      });

      onSuccess();
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: error.message || "Payment failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { processPayment, isProcessing };
};