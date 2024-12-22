import { useCart } from '@/store/useCart';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TronWindow } from '@/components/wallet/types';
import { OrderHeader } from '@/components/order/OrderHeader';
import { OrderSummary } from '@/components/order/OrderSummary';
import { PaymentButton } from '@/components/order/PaymentButton';
import { supabase } from '@/integrations/supabase/client';

const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

export default function OrderDetails() {
  const { items, applyCoupon, couponCode, discount, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discount * subtotal;
  const total = subtotal - discountAmount;
  const orderId = Math.floor(Math.random() * 100000000);

  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
  };

  const createOrder = async (transactionHash: string) => {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        total_amount: subtotal,
        discount_amount: discountAmount,
        final_amount: total,
        coupon_code: couponCode,
        phone_number: phoneNumber,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

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
      throw new Error('Failed to create order items');
    }

    return order;
  };

  const processPayment = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number for delivery coordination",
        variant: "destructive",
      });
      return;
    }

    const tronWindow = window as TronWindow;
    if (!tronWindow.tronWeb) {
      toast({
        title: "Error",
        description: "Please install TronLink to make payments",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const address = tronWindow.tronWeb?.defaultAddress?.base58;
      if (!address) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          variant: "destructive",
        });
        return;
      }

      // Get USDT contract instance
      const contract = await tronWindow.tronWeb?.contract().at(USDT_CONTRACT_ADDRESS);
      if (!contract) {
        throw new Error('Failed to load USDT contract');
      }

      // Convert total to USDT amount (6 decimals)
      const amount = (total * 1e6).toString();

      // Merchant address - replace with your actual merchant address
      const merchantAddress = 'YOUR_TRON_MERCHANT_ADDRESS';

      console.log('Initiating transaction:', {
        from: address,
        to: merchantAddress,
        amount: amount,
        phoneNumber: phoneNumber
      });

      // Send USDT
      const transaction = await contract.transfer(
        merchantAddress,
        amount
      ).send();

      console.log('Transaction hash:', transaction);

      // Create order in database
      await createOrder(transaction);
      
      toast({
        title: "Success",
        description: "Payment processed successfully!",
      });

      // Clear cart and redirect
      clearCart();
      navigate('/');
      
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <OrderHeader />
      
      <OrderSummary 
        items={items}
        subtotal={subtotal}
        discount={discount}
        discountAmount={discountAmount}
        total={total}
        orderId={orderId}
      />

      <div className="bg-white rounded-lg shadow-sm m-4">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="mb-2"
            />
            <button 
              onClick={handleApplyCoupon}
              className="text-purple-500 text-sm font-medium"
            >
              Apply Coupon
            </button>
          </div>

          <div className="space-y-2">
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mb-2"
            />
            <p className="text-sm text-gray-500 italic">
              Enter phone number to be called by an independent mailman
            </p>
          </div>
        </div>

        <button
          className="w-full p-4 flex justify-between items-center border-t"
        >
          <span className="text-lg">Pay with connected wallet</span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <PaymentButton 
        total={total}
        isProcessing={isProcessing}
        onPayment={processPayment}
      />
    </div>
  );
}