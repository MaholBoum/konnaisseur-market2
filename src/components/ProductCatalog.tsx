import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from './product/ProductCard';

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

  const handleAddToCart = (product) => {
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex justify-between items-center px-4 py-3 bg-white">
        <h1 className="text-xl font-semibold">Konnaisseur Market</h1>
      </div>
      
      <div className="grid grid-cols-3 gap-4 p-4 pb-24">
        {products?.map((product) => {
          const cartItem = items.find(item => item.id === product.id);
          return (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={cartItem?.quantity}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={updateQuantity}
            />
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        <Button 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg rounded-xl"
          onClick={() => navigate('/order-details')}
        >
          VIEW ORDER
        </Button>
      </div>
    </div>
  );
}