import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentButtonProps {
  total: number;
  isProcessing: boolean;
  onPayment: () => Promise<void>;
  paymentRequest: any;
}

export const PaymentButton = ({ 
  total, 
  isProcessing, 
  onPayment,
  paymentRequest 
}: PaymentButtonProps) => {
  const { toast } = useToast();

  const copyAddress = async () => {
    if (paymentRequest?.wallet_address) {
      try {
        await navigator.clipboard.writeText(paymentRequest.wallet_address);
        toast({
          title: "Address Copied!",
          description: "The wallet address has been copied to your clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Could not copy address. Please try copying manually.",
          variant: "destructive",
        });
      }
    }
  };

  if (paymentRequest) {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-md mx-auto space-y-4">
          {paymentRequest.status === 'error' && (
            <Alert variant="destructive">
              <AlertDescription>
                There was an error processing your payment. Please try again or contact support.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Send exactly</p>
              <p className="text-lg font-bold">{total.toFixed(2)} USDT</p>
              <p className="text-xs text-gray-500 break-all">{paymentRequest.wallet_address}</p>
            </div>
            <Button variant="outline" size="icon" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeSVG
              value={`tron:${paymentRequest.wallet_address}?amount=${total}`}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <p className="text-sm text-center text-gray-500">
            {paymentRequest.status === 'pending' 
              ? 'Waiting for payment confirmation...'
              : paymentRequest.status === 'completed'
              ? 'Payment confirmed!'
              : 'Payment status unknown'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4">
      <Button 
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg"
        onClick={onPayment}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay ${total.toFixed(2)} USDT`}
      </Button>
    </div>
  );
};