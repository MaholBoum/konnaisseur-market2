import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types/product';
import { createOrder } from './orderService';

interface UsePaymentProcessorProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  phoneNumber: string;
  couponCode: string | null;
  onSuccess: () => void;
}

export const usePaymentProcessor = ({
  items,
  subtotal,
  discountAmount,
  total,
  phoneNumber,
  couponCode,
  onSuccess
}: UsePaymentProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const { toast } = useToast();

  const processPayment = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number for delivery coordination",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const { paymentRequest: newPaymentRequest } = await createOrder({
        items,
        subtotal,
        discountAmount,
        total,
        phoneNumber,
        couponCode,
      });

      setPaymentRequest(newPaymentRequest);
      
      toast({
        title: "Order Created",
        description: "Please send the exact amount of USDT to the provided wallet address.",
      });
      
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

  return { processPayment, isProcessing, paymentRequest };
};