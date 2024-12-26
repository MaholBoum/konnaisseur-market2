import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/product';
import { createOrder } from './payment/orderService';

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

  // Poll payment status
  useEffect(() => {
    if (!paymentRequest?.id) return;

    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('status')
        .eq('id', paymentRequest.id)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        return;
      }

      if (data.status === 'completed') {
        clearInterval(interval);
        toast({
          title: "Payment Confirmed!",
          description: "Your payment has been confirmed and your order is being processed.",
        });
        onSuccess();
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [paymentRequest?.id, onSuccess, toast]);

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