import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderNotification {
  order_id: string;
  total_amount: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Notification handler started');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const notification: OrderNotification = await req.json();
    console.log('Received notification:', notification);

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          unit_price,
          total_price,
          products (
            name
          )
        )
      `)
      .eq('id', notification.order_id)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      throw new Error('Failed to fetch order details');
    }

    console.log('Order details:', order);

    // Format order items for email
    const itemsList = order.order_items
      .map((item: any) => 
        `${item.products.name} x${item.quantity} - ${item.total_price} USDT`
      )
      .join('<br>');

    // Create email HTML
    const emailHtml = `
      <h2>New Order Received!</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Phone Number:</strong> ${order.phone_number}</p>
      <p><strong>Items:</strong></p>
      ${itemsList}
      <br>
      <p><strong>Subtotal:</strong> ${order.total_amount} USDT</p>
      <p><strong>Discount:</strong> ${order.discount_amount} USDT</p>
      <p><strong>Final Amount:</strong> ${order.final_amount} USDT</p>
      <br>
      <p>Please process this order as soon as possible.</p>
    `;

    // Send email via Resend
    console.log('Sending email notification...');
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Konnaisseur Market <orders@resend.dev>',
        to: ['your-email@example.com'], // Replace with your email
        subject: `New Order #${order.id} - ${order.final_amount} USDT`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Error sending email:', error);
      throw new Error('Failed to send email notification');
    }

    console.log('Email notification sent successfully');
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in notification handler:', error);
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