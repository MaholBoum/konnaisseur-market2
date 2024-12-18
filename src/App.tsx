import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import OrderDetails from '@/pages/OrderDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/order-details" element={<OrderDetails />} />
      </Routes>
    </Router>
  );
}

export default App;