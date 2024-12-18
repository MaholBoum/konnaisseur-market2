import { Product } from '@/types/product';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cake',
    description: 'Sweet and delicious',
    price: 1,
    image: '/placeholder.svg',
    category: 'Desserts',
    isNew: true
  },
  {
    id: '2',
    name: 'Burger',
    description: 'Classic burger with cheese',
    price: 4.99,
    image: '/placeholder.svg',
    category: 'Main'
  },
  {
    id: '3',
    name: 'Fries',
    description: 'Crispy golden fries',
    price: 1.49,
    image: '/placeholder.svg',
    category: 'Sides'
  },
  {
    id: '4',
    name: 'Hotdog',
    description: 'Classic hotdog',
    price: 3.49,
    image: '/placeholder.svg',
    category: 'Main'
  },
  {
    id: '5',
    name: 'Taco',
    description: 'Mucho más',
    price: 3.99,
    image: '/placeholder.svg',
    category: 'Main'
  },
  {
    id: '6',
    name: 'Pizza',
    description: 'Slice of heaven',
    price: 7.99,
    image: '/placeholder.svg',
    category: 'Main'
  },
  {
    id: '7',
    name: 'Donut',
    description: 'Hole included',
    price: 1.49,
    image: '/placeholder.svg',
    category: 'Desserts'
  },
  {
    id: '8',
    name: 'Popcorn',
    description: 'Lights, camera, corn',
    price: 1.99,
    image: '/placeholder.svg',
    category: 'Snacks'
  },
  {
    id: '9',
    name: 'Coke',
    description: 'Ice cold refreshment',
    price: 1.49,
    image: '/placeholder.svg',
    category: 'Drinks'
  },
  {
    id: '10',
    name: 'Icecream',
    description: 'Sweet and cold',
    price: 5.99,
    image: '/placeholder.svg',
    category: 'Desserts'
  },
  {
    id: '11',
    name: 'Cookie',
    description: 'Freshly baked',
    price: 3.99,
    image: '/placeholder.svg',
    category: 'Desserts'
  },
  {
    id: '12',
    name: 'Flan',
    description: 'Classic dessert',
    price: 7.99,
    image: '/placeholder.svg',
    category: 'Desserts'
  }
];

export function ProductCatalog() {
  const { items, addItem, updateQuantity } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    const existingItem = items.find(item => item.id === product.id);
    if (!existingItem) {
      addItem(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Durger King</h1>
        <span className="text-gray-500">mini app</span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 p-4">
        {PRODUCTS.map((product) => {
          const cartItem = items.find(item => item.id === product.id);
          
          return (
            <div key={product.id} className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover"
                />
                {product.isNew && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    NEW
                  </span>
                )}
                {cartItem?.quantity && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {cartItem.quantity}
                  </span>
                )}
              </div>
              
              <span className="text-sm font-medium mt-2">
                {product.name} · ${product.price.toFixed(2)}
              </span>

              {!cartItem ? (
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 bg-orange-500 hover:bg-orange-600 text-white w-full"
                >
                  ADD
                </Button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => updateQuantity(product.id, Math.max(0, cartItem.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg"
          onClick={() => navigate('/order-details')}
        >
          VIEW ORDER
        </Button>
      </div>
    </div>
  );
}
