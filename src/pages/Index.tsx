import { ProductCatalog } from '@/components/ProductCatalog';
import { Cart } from '@/components/Cart';
import { WalletConnect } from '@/components/WalletConnect';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WalletConnect />
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Crypto Burger</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductCatalog />
          </div>
          <div className="lg:col-span-1">
            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;