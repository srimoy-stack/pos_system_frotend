import { useState, useMemo } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Layout } from './components/Layout';
import { ProductGrid } from './components/ProductGrid';
import { CartSidebar } from './components/CartSidebar';
import { CustomizationPanel } from './components/CustomizationPanel';
import { OrderHistory } from './components/OrderHistory';
import { InventoryDashboard } from './components/InventoryDashboard';
import { CATEGORIES } from './data/mockData';
import { Star, Leaf, Flame, Beef, CupSoda, IceCream, ChevronRight, Users, Zap, AlertCircle, X, Plus, ShieldCheck } from 'lucide-react';
import { KitchenDashboard } from './components/KitchenDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { OrderStatusPanel } from './components/OrderStatusPanel';
import { DeepOrderTracker } from './components/DeepOrderTracker';
import { type Order } from './context/POSContext';

const CategoryIcon = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'Star': return <Star className={className} />;
    case 'Leaf': return <Leaf className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Beef': return <Beef className={className} />;
    case 'CupSoda': return <CupSoda className={className} />;
    case 'IceCream': return <IceCream className={className} />;
    case 'Users': return <Users className={className} />;
    default: return <ChevronRight className={className} />;
  }
};

function POSView({ onSelectOrder }: { onSelectOrder: (order: Order) => void }) {
  const {
    selectedCategory, setSelectedCategory,
    customizingItems, activeCustomizationIndex, setActiveCustomizationIndex,
    cancelCustomizing, isRushMode, setRushMode, kitchenLoad, confidenceFlags,
    showReadinessView,
    ordersTabs, activeTabIndex, setActiveTabIndex, addNewTab, closeTab,
    userRole, setUserRole, heldOrders
  } = usePOS();

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-slate-100">
      {/* 4. Kitchen Readiness Overlay */}
      {showReadinessView && <KitchenDashboard />}

      {/* 1. Left Panel - Categories */}
      <div className="w-72 bg-slate-950 flex flex-col h-full border-r border-white/5 shrink-0 relative overflow-hidden">
        {/* Abstract Background Element for Depth */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />

        <div className="p-8 border-b border-white/5 bg-slate-950 relative z-10">
          <h2 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">Menu</h2>
          <div className="flex items-center gap-2 mt-3">
            <div className={cn("h-1.5 w-1.5 rounded-full", kitchenLoad === 'extreme' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" : kitchenLoad === 'busy' ? "bg-amber-500" : "bg-green-500")} />
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Kitchen: {kitchenLoad}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-2 px-4 custom-scrollbar relative z-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-5 rounded-[2rem] transition-all duration-300 group relative overflow-hidden",
                selectedCategory === cat.id
                  ? "bg-white text-slate-950 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] translate-x-1"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner",
                selectedCategory === cat.id ? "bg-slate-900 text-white scale-110 rotate-3" : "bg-slate-900 group-hover:scale-110"
              )}>
                <CategoryIcon name={cat.icon || ''} className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-black text-xs uppercase tracking-tight">{cat.name}</span>
                {selectedCategory === cat.id && (
                  <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-[8px] font-bold opacity-40 uppercase tracking-widest mt-0.5">Active</motion.span>
                )}
              </div>
              {selectedCategory === cat.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-blue-600 rounded-r-full" />
              )}
            </button>
          ))}
        </div>

        {/* Rush Mode Toggle with Enhanced Visuals */}
        <div className="p-6 border-t border-white/5 relative z-10">
          <button
            onClick={() => setRushMode(!isRushMode)}
            className={cn(
              "w-full flex flex-col gap-4 p-6 rounded-[2.5rem] transition-all duration-500 group relative overflow-hidden",
              isRushMode ? "bg-amber-500 text-white shadow-[0_20px_50px_-10_rgba(245,158,11,0.5)]" : "bg-slate-900 border border-white/5 text-slate-400 hover:text-white"
            )}
          >
            <div className="flex justify-between items-center w-full">
              <Zap className={cn("h-6 w-6 transition-transform group-hover:scale-125", isRushMode && "fill-current animate-bounce")} />
              <div className={cn("h-6 w-12 rounded-full relative transition-colors duration-500", isRushMode ? "bg-white/30" : "bg-slate-800")}>
                <div className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-lg transition-all duration-500", isRushMode ? "left-7" : "left-1")} />
              </div>
            </div>
            <div className="text-left">
              <span className="block font-black text-[10px] uppercase tracking-widest">Rush Mode Optimizer</span>
              <span className="block text-[8px] font-bold opacity-60 uppercase tracking-widest mt-1">
                {isRushMode ? "Active • 20% Faster Build-Time" : "Inactive • Standard Build"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Center Panel - Main Content */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">

        {/* Top Operational Bar (Order Tabs & Role) */}
        <div className="bg-slate-900 h-14 shrink-0 flex items-center px-4 gap-1 border-b border-white/5 overflow-x-auto no-scrollbar">
          {ordersTabs.map((tab, idx) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabIndex(idx)}
              className={cn(
                "h-10 px-6 flex items-center gap-4 rounded-t-xl transition-all cursor-pointer group whitespace-nowrap",
                activeTabIndex === idx ? "bg-slate-50 text-slate-900" : "text-slate-500 hover:bg-white/5"
              )}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.name}</span>
              {ordersTabs.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(idx); }}
                  className="p-1 hover:bg-slate-200 rounded-md transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addNewTab}
            className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>

          <div className="ml-auto flex items-center gap-6">
            {heldOrders.length > 0 && (
              <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 animate-pulse">
                <div className="h-1.5 w-2 rounded-full bg-amber-500" />
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{heldOrders.length} HELD</span>
              </div>
            )}
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex bg-white/10 p-1 rounded-xl">
              <button
                onClick={() => setUserRole('junior')}
                className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", userRole === 'junior' ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-200")}
              >Junior</button>
              <button
                onClick={() => setUserRole('senior')}
                className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", userRole === 'senior' ? "bg-white text-slate-900 shadow-lg" : "text-slate-500 hover:text-slate-200")}
              >Senior</button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {customizingItems.length > 0 ? (
            <motion.div
              key="customizer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative"
            >
              <div className="bg-slate-800 px-6 py-1 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 border-b border-white/5">
                {customizingItems.map((item, idx) => (
                  <div
                    key={item.tempId}
                    onClick={() => setActiveCustomizationIndex(idx)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 rounded-t-2xl transition-all cursor-pointer whitespace-nowrap group relative",
                      activeCustomizationIndex === idx ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-white/5"
                    )}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.product.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); cancelCustomizing(item.tempId); }} className="hover:bg-red-500 hover:text-white rounded-lg transition-all p-1">
                      <X className="h-3 w-3" />
                    </button>
                    {activeCustomizationIndex === idx && (
                      <motion.div layoutId="activeCustTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex-1 overflow-hidden relative">
                {customizingItems[activeCustomizationIndex] ? (
                  <CustomizationPanel
                    key={customizingItems[activeCustomizationIndex].tempId}
                    product={customizingItems[activeCustomizationIndex].product}
                    initialCustomization={customizingItems[activeCustomizationIndex].customization}
                    cartId={customizingItems[activeCustomizationIndex].tempId}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <OrderStatusPanel onSelectOrder={onSelectOrder} />
              <div className="px-10 py-10 bg-white border-b border-slate-100 flex justify-between items-center shrink-0 shadow-sm relative z-10">
                <div>
                  <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Terminal 04</h1>
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2",
                      kitchenLoad === 'extreme' ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
                    )}>
                      {kitchenLoad === 'extreme' ? <Zap className="h-3 w-3 fill-current animate-pulse" /> : <ShieldCheck className="h-3 w-3" />}
                      SLA: {kitchenLoad === 'extreme' ? 'AT RISK' : 'ON TRACK'}
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Active Store Session • <span className="text-slate-950 font-black">L-404-PX</span> • <span className="text-blue-600 font-black">{userRole.toUpperCase()} ACCESS</span></p>
                </div>

                {confidenceFlags.length > 0 && (
                  <div className="flex gap-2">
                    {confidenceFlags.slice(0, 1).map((flag, i) => (
                      <div key={i} className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-right",
                        flag.type === 'warning' ? "bg-amber-50 border-amber-200 text-amber-700 shadow-lg shadow-amber-200/20" : "bg-blue-50 border-blue-200 text-blue-700 shadow-lg shadow-blue-200/20"
                      )}>
                        <AlertCircle className="h-3 w-3" />
                        {flag.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
                <ProductGrid />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Right Panel - Live Summary */}
      <CartSidebar />
    </div>
  );
}

function MainApp() {
  const { liveOrders } = usePOS();
  const [currentView, setCurrentView] = useState<'pos' | 'history' | 'inventory'>('pos');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  // Sync selected order if it updates in liveOrders
  const activeTrackedOrder = useMemo(() => {
    if (!selectedOrderForTracking) return null;
    return liveOrders.find(o => o.orderId === selectedOrderForTracking.orderId) || selectedOrderForTracking;
  }, [liveOrders, selectedOrderForTracking]);

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      <AnimatePresence>
        {activeTrackedOrder && (
          <DeepOrderTracker
            order={activeTrackedOrder}
            onClose={() => setSelectedOrderForTracking(null)}
          />
        )}
      </AnimatePresence>
      {currentView === 'pos' && <POSView onSelectOrder={(o) => setSelectedOrderForTracking(o)} />}
      {currentView === 'history' && <OrderHistory onSelectOrder={(o) => setSelectedOrderForTracking(o)} />}
      {currentView === 'inventory' && <InventoryDashboard />}
    </Layout>
  );
}

function App() {
  return (
    <POSProvider>
      <MainApp />
    </POSProvider>
  );
}

export default App;
