import { ProductCatalog } from '@/components/ProductCatalog';
import { WalletConnect } from '@/components/WalletConnect';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WalletConnect />
      <ProductCatalog />
    </div>
  );
};

export default Index;