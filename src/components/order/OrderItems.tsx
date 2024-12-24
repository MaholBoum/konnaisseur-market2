import { CartItem } from '@/types/product';

interface OrderItemsProps {
  items: CartItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              {item.name} x{item.quantity}
            </span>
          </div>
          <span>{item.price.toFixed(2)} USDT</span>
        </div>
      ))}
    </div>
  );
}