import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Web3Provider } from '@/components/providers/Web3Provider';
import { Router } from './Router';

function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
        <Router />
        <Toaster />
      </BrowserRouter>
    </Web3Provider>
  );
}

export default App;