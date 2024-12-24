import { CartItem as CartItemType } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-800">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {item.price.toFixed(2)} USDT
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-8 text-center text-sm text-gray-900 dark:text-white">
          {item.quantity}
        </span>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          onClick={() => onRemoveItem(item.id)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}