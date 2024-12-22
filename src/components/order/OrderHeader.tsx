import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const OrderHeader = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};