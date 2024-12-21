import { Product } from '@/types/product';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';

async function fetchProducts() {
  console.log('Fetching products from Supabase...');
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  console.log('Products fetched successfully:', data);
  return data;
}

export function ProductCatalog() {
  const { items, addItem, updateQuantity } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Konnaisseur Market</h1>
      </div>
      
      <div className="grid grid-cols-2 gap-4 p-4">
        {products?.map((product) => {
          const cartItem = items.find(item => item.id === product.id);
          
          return (
            <div key={product.id} className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 flex items-center justify-center text-6xl bg-gray-100 rounded-lg">
                  {product.image}
                </div>
                {product.is_new && (
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
              
              <span className="text-sm font-medium mt-2 text-center">
                {product.name}
              </span>
              <span className="text-sm text-gray-600">
                ${Number(product.price).toFixed(2)}
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