import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

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
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-32 h-32 flex items-center justify-center text-6xl bg-gray-100 rounded-lg">
          {product.image}
        </div>
        {product.is_new && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            NEW
          </span>
        )}
        {cartQuantity && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            {cartQuantity}
          </span>
        )}
      </div>
      
      <span className="text-sm font-medium mt-2 text-center">
        {product.name}
      </span>
      <span className="text-sm text-gray-600">
        ${Number(product.price).toFixed(2)}
      </span>

      {!cartQuantity ? (
        <Button
          onClick={() => onAddToCart(product)}
          className="mt-2 bg-orange-500 hover:bg-orange-600 text-white w-full"
        >
          ADD
        </Button>
      ) : (
        <div className="flex gap-2 mt-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onUpdateQuantity?.(product.id, Math.max(0, cartQuantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onUpdateQuantity?.(product.id, cartQuantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}