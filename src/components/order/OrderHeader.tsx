import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface OrderHeaderProps {
  orderId: number;
}

export function OrderHeader({ orderId }: OrderHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="p-4 border-b">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
    </div>
  );
}