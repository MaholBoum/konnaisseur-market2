import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export function Cart() {
  const { items, removeItem, updateQuantity, applyCoupon, couponCode, discount, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discount * subtotal;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const result = await applyCoupon(couponInput.trim());
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      console.log('Creating order with items:', items);

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_amount: subtotal,
          discount_amount: discountAmount,
          final_amount: total,
          coupon_code: couponCode,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw orderError;
      }

      console.log('Order created:', order);

      // Create order items
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
        throw itemsError;
      }

      console.log('Order items created successfully');
      
      // Clear the cart and show success message
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "Your order has been created and is being processed.",
      });
      
      // Navigate to order details
      navigate('/order-details');
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error creating order",
        description: "There was a problem creating your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="flex items-center py-4 border-b">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.price} ETH</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                disabled={isApplyingCoupon}
              />
              <Button 
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon}
              >
                {isApplyingCoupon ? 'Applying...' : 'Apply'}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(4)} ETH</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponCode})</span>
                  <span>-{discountAmount.toFixed(4)} ETH</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{total.toFixed(4)} ETH</span>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={createOrder}
              disabled={isProcessing || items.length === 0}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}