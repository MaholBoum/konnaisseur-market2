import { Product } from '@/types/product';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Our signature burger with cheese and special sauce',
    price: 0.005, // In ETH
    image: '/placeholder.svg',
    category: 'Burgers',
  },
  {
    id: '2',
    name: 'Crypto Fries',
    description: 'Golden crispy fries with secret seasoning',
    price: 0.002,
    image: '/placeholder.svg',
    category: 'Sides',
  },
  // Add more products as needed
];

export function ProductCatalog() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {PRODUCTS.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-primary font-bold">{product.price} ETH</span>
              <Button
                onClick={() => handleAddToCart(product)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}