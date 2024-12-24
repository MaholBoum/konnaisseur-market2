import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import OrderDetails from './pages/OrderDetails';
import './App.css';
import { useTelegramApp } from './hooks/useTelegramApp';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  const { initWebApp } = useTelegramApp();

  useEffect(() => {
    initWebApp();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/order-details" element={<OrderDetails />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App;