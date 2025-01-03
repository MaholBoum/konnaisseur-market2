import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types/product';
import { createOrder } from './orderService';

interface UsePaymentProcessorProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  telegramUsername: string;
  couponCode: string | null;
  onSuccess: () => void;
}

export const usePaymentProcessor = ({
  items,
  subtotal,
  discountAmount,
  total,
  telegramUsername,
  couponCode,
  onSuccess
}: UsePaymentProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const { toast } = useToast();

  const processPayment = async () => {
    console.log('Starting payment process with:', {
      items,
      subtotal,
      discountAmount,
      total,
      telegramUsername,
      couponCode
    });

    if (!telegramUsername?.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Telegram username for delivery coordination",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Creating order and payment request...');
      
      const { order, paymentRequest: newPaymentRequest } = await createOrder({
        items,
        subtotal,
        discountAmount,
        total,
        telegramUsername,
        couponCode,
      });

      console.log('Order created:', order);
      console.log('Payment request created:', newPaymentRequest);
      
      setPaymentRequest(newPaymentRequest);
      
      toast({
        title: "Order Created",
        description: "Please send the exact amount of USDT to the provided wallet address.",
      });
      
    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast({
        title: "Error",
        description: error.message || "Payment failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { processPayment, isProcessing, paymentRequest };
};