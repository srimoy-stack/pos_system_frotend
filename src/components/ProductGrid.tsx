import { usePOS } from '../context/POSContext';
import { Card } from './ui/card';
import { Settings2, Users, AlertTriangle, Clock, Zap, Plus, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ORDER_TEMPLATES } from '../data/mockData';

export const ProductGrid = () => {
    const {
        products,
        addToCart,
        startCustomizing,
        selectedCategory,
        applyTemplate,
        isRushMode,
        kitchenLoad,
        userRole,
        recentlyOrdered
    } = usePOS();

    // 1. Mission-Critical Filtering (Role + Category)
    const filteredProducts = products.filter((p) => {
        // Junior role restricts to safe categories or top sellers unless searching
        if (userRole === 'junior' && selectedCategory === 'all') {
            return p.category === 'pizzas' || p.id.includes('v');
        }

        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'bundles') return false;
        if (selectedCategory === 'top-sellers') return p.id.includes('v') || p.id.includes('s');
        return p.category === selectedCategory;
    });

    const recentItems = products.filter(p => recentlyOrdered.includes(p.id));

    const getStockBadge = (status: string) => {
        switch (status) {
            case 'low': return <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">🟡 RE-STOCKING</div>;
            case 'out': return <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">🔴 DE-LISTED</div>;
            default: return <div className="bg-green-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">🟢 READY</div>;
        }
    };

    const getPrepIndicator = (baseTime: number) => {
        let actualTime = baseTime;
        if (kitchenLoad === 'busy') actualTime += 5;
        if (kitchenLoad === 'extreme') actualTime += 15;
        return actualTime;
    };

    return (
        <div className="space-y-12">
            {/* Recent & Promoted Section (Dynamic Scaling) */}
            {selectedCategory === 'all' && recentItems.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <History className="h-4 w-4 text-slate-400" />
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rapid Recall: Recently Ordered</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {recentItems.map(p => (
                            <button
                                key={`recent-${p.id}`}
                                onClick={() => addToCart(p)}
                                className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
                            >
                                <img src={p.image} className="w-12 h-12 rounded-xl object-cover group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase truncate w-24">{p.name}</p>
                                    <p className="text-[8px] font-bold text-blue-600 uppercase mt-0.5">$ {p.price.toFixed(2)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedCategory === 'bundles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ORDER_TEMPLATES.map(t => (
                        <Card
                            key={t.id}
                            className="p-8 bg-slate-950 text-white border-none rounded-[3rem] group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden"
                            onClick={() => applyTemplate(t.id)}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                                <Users className="h-32 w-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                                        <Zap className="h-6 w-6 stroke-[3]" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Rush Hour Weapon</span>
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{t.name}</h3>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{t.description}</p>
                                <div className="mt-8 flex items-center gap-4">
                                    <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-colors">Apply Rapid Order</button>
                                    <span className="text-blue-500 font-black text-lg">$ {t.price.toFixed(2)}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <div className={cn(
                "grid gap-8",
                isRushMode ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            )}>
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => {
                        const prepTime = getPrepIndicator(product.prepTimeMin);
                        const isOut = product.stockStatus === 'out';
                        const isLow = product.stockStatus === 'low';

                        return (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                    transition: {
                                        delay: Math.min(index * 0.05, 0.5),
                                        duration: 0.4,
                                        ease: "circOut"
                                    }
                                }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="h-full"
                            >
                                <Card
                                    className={cn(
                                        "group relative overflow-hidden h-full rounded-[2.5rem] border-2 transition-all duration-300 flex flex-col transform",
                                        isOut ? "opacity-50 grayscale border-red-100 pointer-events-none" : "bg-white border-transparent hover:border-blue-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]",
                                        isRushMode && !isOut && "border-slate-100"
                                    )}
                                    onClick={() => !isOut && addToCart(product)}
                                >
                                    {isOut && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] p-6 text-center">
                                            <AlertTriangle className="h-10 w-10 text-red-600 mb-4" />
                                            <p className="font-black text-xs text-red-700 uppercase tracking-widest">Unavailable</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Suggested: {product.category === 'pizzas' ? 'Veggie Supreme' : 'Garlic Knots'}</p>
                                        </div>
                                    )}

                                    <div className={cn(
                                        "relative overflow-hidden shrink-0 transition-all",
                                        isRushMode ? "aspect-square" : "aspect-[4/3]"
                                    )}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                            {getStockBadge(product.stockStatus)}
                                            {isRushMode && prepTime < 10 && (
                                                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                                    <Zap className="h-3 w-3 fill-current" /> FAST-PREP
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 p-8 pt-20">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <h3 className="text-white font-black text-2xl leading-none uppercase tracking-tighter mb-1">{product.name}</h3>
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                        {product.category.replace('-', ' ')}
                                                        <span className="h-1 w-1 rounded-full bg-slate-700" />
                                                        <Clock className="h-3 w-3" /> {prepTime} MIN
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-blue-400 font-black text-xl leading-none">$ {product.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "p-4 flex flex-col gap-3 mt-auto",
                                        isRushMode ? "bg-slate-50" : "bg-white"
                                    )}>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                className={cn(
                                                    "flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95",
                                                    isRushMode
                                                        ? "bg-blue-600 border-2 border-blue-600 text-white hover:bg-slate-900"
                                                        : "bg-slate-900 border-2 border-slate-900 text-white hover:bg-transparent hover:text-slate-900"
                                                )}
                                            >
                                                {isRushMode ? <Zap className="h-4 w-4 fill-current" /> : <Plus className="h-4 w-4" />}
                                                {isRushMode ? 'RAPID ADD' : 'ADD TO ORDER'}
                                            </button>

                                            {product.isCustomizable && userRole === 'senior' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); startCustomizing(product); }}
                                                    className="w-16 bg-white hover:bg-slate-900 hover:text-white border-2 border-slate-200 rounded-2xl transition-all flex items-center justify-center group/btn shadow-md active:scale-95"
                                                    title="Kitchen Overrides"
                                                >
                                                    <Settings2 className="h-5 w-5 transition-transform group-hover/btn:rotate-90" />
                                                </button>
                                            )}
                                        </div>

                                        {isLow && (
                                            <div className="flex items-center gap-2 text-amber-600 animate-pulse">
                                                <AlertTriangle className="h-3 w-3" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-center w-full">Limited Stock - Suggest Alternates</span>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
