import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentRequest {
  id: string;
  status: string;
  transaction_hash: string | null;
  confirmed_at: string | null;
  webhook_url: string | null;
  retry_count: number;
}

export const usePaymentMonitor = (paymentRequestId: string | null) => {
  const { toast } = useToast();

  const { data: paymentRequest, error } = useQuery({
    queryKey: ['payment-request', paymentRequestId],
    queryFn: async () => {
      if (!paymentRequestId) return null;
      
      console.log('Fetching payment request:', paymentRequestId);
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('id', paymentRequestId)
        .single();

      if (error) {
        console.error('Error fetching payment request:', error);
        throw error;
      }

      return data as PaymentRequest;
    },
    enabled: !!paymentRequestId,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  useEffect(() => {
    if (paymentRequest?.status === 'completed') {
      toast({
        title: "Payment Confirmed!",
        description: "Your payment has been confirmed and your order is being processed.",
      });
    } else if (paymentRequest?.status === 'error') {
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  }, [paymentRequest?.status, toast]);

  return {
    paymentRequest,
    error,
    isLoading: !paymentRequest && !error,
  };
};