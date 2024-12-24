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
    <div className="flex flex-col items-center bg-white rounded-lg p-2">
      <div className="relative w-full aspect-square mb-2">
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {product.is_new && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            NEW
          </span>
        )}
        {cartQuantity && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
            {cartQuantity}
          </span>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-1 w-full">
        <span className="text-sm font-medium text-center">
          {product.name}
        </span>
        <span className="text-sm text-gray-600">
          ${Number(product.price).toFixed(2)}
        </span>

        {!cartQuantity ? (
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white rounded-xl mt-1"
          >
            ADD
          </Button>
        ) : (
          <div className="flex gap-2 w-full mt-1">
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 bg-red-400 hover:bg-red-500"
              onClick={() => onUpdateQuantity?.(product.id, Math.max(0, cartQuantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 bg-orange-400 hover:bg-orange-500 text-white"
              onClick={() => onUpdateQuantity?.(product.id, cartQuantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}