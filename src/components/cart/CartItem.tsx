import { CartItem as CartItemType } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  return (
    <div className="flex items-center py-4 border-b border-gray-200 dark:border-gray-700">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded bg-gray-100 dark:bg-[#161616]"
      />
      <div className="ml-4 flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.price} USDT</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
          className="bg-white dark:bg-[#161616] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] border-gray-200 dark:border-gray-700"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="bg-white dark:bg-[#161616] hover:bg-gray-50 dark:hover:bg-[#1f1f1f] border-gray-200 dark:border-gray-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveItem(item.id)}
          className="hover:bg-gray-50 dark:hover:bg-[#1f1f1f]"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}