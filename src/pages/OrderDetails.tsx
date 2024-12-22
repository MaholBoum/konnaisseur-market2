import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function OrderDetails() {
  const { items, applyCoupon, couponCode, discount, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discount * subtotal;
  const total = subtotal - discountAmount;
  const orderId = Math.floor(Math.random() * 100000000);

  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
  };

  const processPayment = async () => {
    if (!window.ethereum) {
      toast({
        title: "Error",
        description: "Please install MetaMask to make payments",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (!accounts || accounts.length === 0) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          variant: "destructive",
        });
        return;
      }

      // Get the current chain ID
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      // Check if we're on the correct network (Ethereum Mainnet)
      if (chainId !== '0x1') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }], // Ethereum Mainnet
          });
        } catch (switchError: any) {
          toast({
            title: "Error",
            description: "Please switch to Ethereum Mainnet",
            variant: "destructive",
          });
          return;
        }
      }

      const fromAddress = accounts[0];
      // Convert total to Wei (1 ETH = 10^18 Wei)
      const amountInWei = `0x${(total * 1e18).toString(16)}`;

      // Merchant address - replace with your actual merchant address
      const merchantAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

      console.log('Initiating transaction:', {
        from: fromAddress,
        to: merchantAddress,
        value: amountInWei,
      });

      // Request payment transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAddress,
          to: merchantAddress,
          value: amountInWei,
          gas: '0x5208', // 21000 gas
        }],
      });

      console.log('Transaction hash:', txHash);
      
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 flex items-center justify-between border-b">
        <Button 
          variant="ghost" 
          className="text-purple-500"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold">Checkout</h1>
        <div className="w-16"></div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-sm m-4">
        <div className="flex items-start gap-4 border-b pb-4">
          <img
            src="/lovable-uploads/80299426-225e-4da8-a7ca-fcc09a931f22.png"
            alt="Konnaisseur Market"
            className="w-20 h-20 rounded-lg"
          />
          <div>
            <h2 className="font-bold text-lg">Order #{orderId}</h2>
            <p className="text-lg">Perfect lunch from Durger King.</p>
            <p className="text-gray-500">Konnaisseur Market</p>
          </div>
        </div>

        <div className="py-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  {item.name} x{item.quantity}
                </span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div className="flex justify-between items-center text-gray-500">
            <span>Network Fee (Gas)</span>
            <span>~$0.50</span>
          </div>

          {/* Coupon Code Section */}
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <Button onClick={handleApplyCoupon}>Apply</Button>
            </div>
            {couponCode && discount > 0 && (
              <div className="flex justify-between items-center text-green-600 mt-2">
                <span>Discount ({couponCode})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total</span>
            <span className="text-xl font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm m-4">
        <Button
          variant="ghost"
          className="w-full p-4 flex justify-between items-center"
        >
          <span className="text-lg">Pay with connected wallet</span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4">
        <Button 
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg"
          onClick={processPayment}
          disabled={isProcessing || items.length === 0}
        >
          {isProcessing ? 'Processing...' : `Pay ${total.toFixed(2)} ETH`}
        </Button>
      </div>
    </div>
  );
}