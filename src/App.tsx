import { BrowserRouter } from 'react-router-dom';
import { Web3Provider } from './components/providers/Web3Provider';
import { Toaster } from './components/ui/toaster';
import { Cart } from './components/Cart';
import OrderDetails from './pages/OrderDetails';

function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
        <Cart />
        <OrderDetails />
      </BrowserRouter>
      <Toaster />
    </Web3Provider>
  );
}

export default App;
