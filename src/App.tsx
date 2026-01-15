import { useState } from 'react';
import { Layout } from './components/Layout';
import { ProductGrid } from './components/ProductGrid';
import { CartSidebar } from './components/CartSidebar';
import { OrderHistory } from './components/OrderHistory';
import { InventoryDashboard } from './components/InventoryDashboard';

function App() {
  const [currentView, setCurrentView] = useState<'pos' | 'history' | 'inventory'>('pos');

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'pos' && (
        <>
          <ProductGrid />
          <CartSidebar />
        </>
      )}
      {currentView === 'history' && <OrderHistory />}
      {currentView === 'inventory' && <InventoryDashboard />}
    </Layout>
  );
}

export default App;
