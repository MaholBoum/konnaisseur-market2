import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrderDetails() {
  const { items } = useCart();
  const navigate = useNavigate();
  
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6 text-purple-500" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Durger King</h1>
            <p className="text-gray-500 text-sm">mini app</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-6 w-6" />
        </Button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">YOUR ORDER</h2>
          <Button variant="ghost" className="text-green-500">
            Edit
          </Button>
        </div>

        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-bold">
                    {item.name} <span className="text-orange-500">{item.quantity}x</span>
                  </h3>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <p className="text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Textarea 
            placeholder="Add comment..."
            className="w-full mb-2"
          />
          <p className="text-gray-500 text-sm">
            Any special requests, details, final wishes etc.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4">
        <Button 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg"
        >
          PAY ${total.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}