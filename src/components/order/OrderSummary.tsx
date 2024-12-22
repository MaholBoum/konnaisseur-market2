import { CartItem } from '@/types/product';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  orderId: number;
}

export const OrderSummary = ({ 
  items, 
  subtotal, 
  discount, 
  discountAmount, 
  total, 
  orderId 
}: OrderSummaryProps) => {
  return (
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

        {discount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span>Discount</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total</span>
            <span className="text-xl font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};