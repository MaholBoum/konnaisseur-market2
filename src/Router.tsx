import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import OrderDetails from './pages/OrderDetails';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/order-details" element={<OrderDetails />} />
    </Routes>
  );
};