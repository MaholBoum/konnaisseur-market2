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

    console.log('Starting payment status polling for:', paymentRequest.id);
    const interval = setInterval(async () => {
      try {
        console.log('Checking payment status for:', paymentRequest.id);
        const { data, error } = await supabase
          .from('payment_requests')
          .select('status, transaction_hash, confirmed_at')
          .eq('id', paymentRequest.id)
          .single();

        if (error) {
          console.error('Error checking payment status:', error);
          toast({
            title: "Error",
            description: "Failed to check payment status. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log('Payment status update:', data);

        if (data.status === 'completed') {
          clearInterval(interval);
          toast({
            title: "Payment Confirmed!",
            description: "Your payment has been confirmed and your order is being processed.",
          });
          onSuccess();
        } else if (data.status === 'error') {
          clearInterval(interval);
          toast({
            title: "Payment Failed",
            description: "There was an error processing your payment. Please try again.",
            variant: "destructive",
          });
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Error in payment status polling:', error);
        toast({
          title: "Error",
          description: "Failed to check payment status. Please try again.",
          variant: "destructive",
        });
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [paymentRequest?.id, onSuccess, toast]);

  const processPayment = async () => {
    console.log('Starting payment process with data:', {
      items,
      subtotal,
      discountAmount,
      total,
      phoneNumber,
      couponCode
    });
    
    if (!phoneNumber.trim()) {
      console.log('Phone number missing');
      toast({
        title: "Error",
        description: "Please enter your phone number for delivery coordination",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      console.log('No items in cart');
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
        phoneNumber,
        couponCode,
      });

      console.log('Order created successfully:', order);
      console.log('Payment request created successfully:', newPaymentRequest);
      
      setPaymentRequest(newPaymentRequest);
      
      toast({
        title: "Order Created",
        description: "Please send the exact amount of USDT to the provided wallet address.",
      });
      
    } catch (error: any) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: error.message || "Payment failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { processPayment, isProcessing, paymentRequest };
};