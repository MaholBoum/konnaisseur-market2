import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { TronWeb } from 'https://esm.sh/tronweb@5.3.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  id: string;
  order_id: string;
  amount: number;
  wallet_address: string;
  status: string;
  created_at: string;
  webhook_url: string;
  retry_count: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize TronWeb
    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io'
    });

    console.log('Checking pending payments...');

    // Get pending payments
    const { data: pendingPayments, error: fetchError } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('status', 'pending')
      .filter('expiry', 'gte', new Date().toISOString());

    if (fetchError) {
      throw new Error(`Database error: ${fetchError.message}`);
    }

    console.log(`Found ${pendingPayments?.length || 0} pending payments`);

    // Process each payment
    const results = await Promise.all((pendingPayments || []).map(async (payment: PaymentRequest) => {
      try {
        console.log(`Processing payment ${payment.id}`);

        // Get transaction events
        const events = await tronWeb.getEventResult(payment.wallet_address, {
          eventName: 'Transfer',
          only_confirmed: true,
          min_block_timestamp: new Date(payment.created_at).getTime(),
        });

        // Find matching payment
        const matchingPayment = events.find((event: any) => {
          const amount = Number(tronWeb.fromSun(event.result.value));
          return Math.abs(amount - payment.amount) < 0.01;
        });

        if (matchingPayment) {
          console.log(`Found matching payment for ${payment.id}`);

          // Update payment status
          const { error: updateError } = await supabase
            .from('payment_requests')
            .update({
              status: 'completed',
              transaction_hash: matchingPayment.transaction,
              confirmed_at: new Date().toISOString()
            })
            .eq('id', payment.id);

          if (updateError) {
            throw new Error(`Status update error: ${updateError.message}`);
          }

          // Call webhook if configured
          if (payment.webhook_url) {
            try {
              const response = await fetch(payment.webhook_url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  payment_id: payment.id,
                  order_id: payment.order_id,
                  status: 'completed',
                  transaction_hash: matchingPayment.transaction,
                  amount: payment.amount,
                  currency: 'USDT',
                  network: 'TRC20'
                }),
              });

              if (!response.ok) {
                throw new Error(`Webhook failed with status ${response.status}`);
              }
            } catch (webhookError) {
              console.error(`Webhook error for payment ${payment.id}:`, webhookError);
              
              // Log webhook failure
              await supabase
                .from('webhook_failures')
                .insert([{
                  payment_id: payment.id,
                  webhook_url: payment.webhook_url,
                  error_message: webhookError.message,
                }]);
            }
          }

          return { success: true, payment_id: payment.id };
        }

        return { success: false, payment_id: payment.id, reason: 'No matching payment found' };
      } catch (error) {
        console.error(`Error processing payment ${payment.id}:`, error);
        
        // Log payment error
        await supabase
          .from('payment_request_errors')
          .insert([{
            payment_id: payment.id,
            error_message: error.message,
          }]);

        return { success: false, payment_id: payment.id, error: error.message };
      }
    }));

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in check-payments function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})