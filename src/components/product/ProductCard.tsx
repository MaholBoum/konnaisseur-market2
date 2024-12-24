import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

// Map product categories to emojis
const categoryEmojis: Record<string, string> = {
  'food': '🍔',
  'drink': '🥤',
  'dessert': '🍰',
  'snack': '🍿',
  'default': '📦'
};

interface ProductCardProps {
  product: Product;
  cartQuantity?: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
}

export function ProductCard({ 
  product, 
  cartQuantity, 
  onAddToCart, 
  onUpdateQuantity 
}: ProductCardProps) {
  // Get emoji based on category or use default
  const emoji = categoryEmojis[product.category.toLowerCase()] || categoryEmojis.default;

  return (
    <div className="flex flex-col items-center bg-white rounded-lg p-1.5">
      <div className="relative w-full aspect-square mb-1 flex items-center justify-center bg-gray-50 rounded-lg">
        <span className="text-6xl">{emoji}</span>
        {product.is_new && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            NEW
          </span>
        )}
        {cartQuantity && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartQuantity}
          </span>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-0.5 w-full">
        <span className="text-sm font-medium text-center">
          {product.name}
        </span>
        <span className="text-sm text-gray-600">
          {Number(product.price).toFixed(2)} ETH
        </span>

        {!cartQuantity ? (
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white rounded-xl mt-1 h-8 text-sm"
          >
            ADD
          </Button>
        ) : (
          <div className="flex gap-1 w-full mt-1">
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 bg-red-400 hover:bg-red-500 h-8"
              onClick={() => onUpdateQuantity?.(product.id, Math.max(0, cartQuantity - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 bg-orange-400 hover:bg-orange-500 text-white h-8"
              onClick={() => onUpdateQuantity?.(product.id, cartQuantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}