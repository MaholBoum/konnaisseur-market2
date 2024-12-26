import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import OrderDetails from './pages/OrderDetails';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  // Check if running in Telegram WebApp
  const isTelegramWebApp = Boolean(window.Telegram?.WebApp);

  if (!isTelegramWebApp) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div>
          <h1 className="text-xl font-bold mb-2">Telegram Mini App</h1>
          <p>Please open this application in Telegram.</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/order-details" element={<OrderDetails />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;