import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // Get pending payment requests
    const { data: pendingPayments, error: fetchError } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('status', 'pending')

    if (fetchError) {
      throw new Error(`Error fetching pending payments: ${fetchError.message}`)
    }

    console.log(`Found ${pendingPayments?.length || 0} pending payments to check`)

    // Process each pending payment
    const updates = await Promise.all((pendingPayments || []).map(async (payment) => {
      try {
        // Here we would check the TRON blockchain for the transaction
        // This is a placeholder for the actual TRON API call
        const transactionFound = false // Replace with actual TRON API check
        
        if (transactionFound) {
          return {
            id: payment.id,
            status: 'completed',
            transaction_hash: 'sample_hash' // Replace with actual transaction hash
          }
        }
        
        // If payment is too old (e.g., > 1 hour), mark as failed
        const paymentAge = Date.now() - new Date(payment.created_at).getTime()
        if (paymentAge > 3600000) { // 1 hour
          return {
            id: payment.id,
            status: 'error'
          }
        }

        return null
      } catch (error) {
        console.error(`Error processing payment ${payment.id}:`, error)
        return null
      }
    }))

    // Update payment statuses in database
    const validUpdates = updates.filter(Boolean)
    if (validUpdates.length > 0) {
      const { error: updateError } = await supabase
        .from('payment_requests')
        .upsert(validUpdates)

      if (updateError) {
        throw new Error(`Error updating payment statuses: ${updateError.message}`)
      }

      console.log(`Updated ${validUpdates.length} payment requests`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: pendingPayments?.length || 0,
        updated: validUpdates.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in check-payments function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})