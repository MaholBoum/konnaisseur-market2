import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CRYPTO_PAY_TOKEN = Deno.env.get('CRYPTO_PAY_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Check payments handler started');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if CRYPTO_PAY_TOKEN is configured
    if (!CRYPTO_PAY_TOKEN) {
      console.error('CRYPTO_PAY_TOKEN is not configured');
      throw new Error('Crypto payment service is not configured properly');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Fetch pending payment requests that haven't expired
    console.log('Fetching pending payment requests...');
    const { data: pendingPayments, error: fetchError } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('status', 'pending')
      .gt('expiry', new Date().toISOString())
      .lt('retry_count', 5);

    if (fetchError) {
      console.error('Error fetching pending payments:', fetchError);
      throw new Error('Failed to fetch pending payments');
    }

    console.log(`Found ${pendingPayments?.length || 0} pending payments to check`);

    if (!pendingPayments || pendingPayments.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending payments to check' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process each pending payment
    const results = await Promise.all(pendingPayments.map(async (payment) => {
      console.log(`Checking payment ${payment.id}...`);
      
      try {
        // Here you would typically check with your crypto payment provider using CRYPTO_PAY_TOKEN
        // For now, we'll just increment the retry count and log the attempt
        console.log(`Would check payment with CRYPTO_PAY_TOKEN: ${CRYPTO_PAY_TOKEN?.substring(0, 4)}...`);
        
        const { error: updateError } = await supabase
          .from('payment_requests')
          .update({
            retry_count: payment.retry_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.id);

        if (updateError) {
          throw updateError;
        }

        return {
          payment_id: payment.id,
          status: 'checked',
          message: 'Payment check completed'
        };
      } catch (error: any) {
        console.error(`Error processing payment ${payment.id}:`, error);
        return {
          payment_id: payment.id,
          status: 'error',
          message: error.message
        };
      }
    }));

    console.log('Payment check results:', results);
    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in check payments handler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);