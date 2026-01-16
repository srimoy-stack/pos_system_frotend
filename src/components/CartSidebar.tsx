import { useState, useMemo } from 'react';
import { usePOS } from '../context/POSContext';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Copy, Edit2, RotateCcw, ChevronDown, Star, BadgeCheck, Pause, Play, Zap } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';
import { motion, AnimatePresence } from 'framer-motion';
import { PIZZA_OPTIONS, PRODUCTS } from '../data/mockData';
import { cn } from '../lib/utils';

export const CartSidebar = () => {
    const {
        cart,
        updateQuantity,
        removeFromCart,
        duplicateItem,
        startEditing,
        undoLastAction,
        clearCart,
        subtotal,
        tax,
        total,
        holdOrder,
        resumeOrder,
        heldOrders,
        kitchenLoad,
        userRole,
        toppings
    } = usePOS();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const getToppingName = (id: string) => toppings.find(t => t.id === id)?.name || id;
    const getSizeName = (id: string) => PIZZA_OPTIONS.sizes.find(s => s.id === id)?.name || id;
    const getCrustName = (id: string) => PIZZA_OPTIONS.crusts.find(c => c.id === id)?.name || id;

    // Smart Upsell Suggestion
    const upsellItem = useMemo(() => PRODUCTS.find(p => p.category === 'sides' || p.category === 'beverages'), []);

    const slaStatus = useMemo(() => {
        if (kitchenLoad === 'extreme') return { label: 'AT RISK', color: 'text-red-600', bg: 'bg-red-50', icon: Zap };
        if (kitchenLoad === 'busy') return { label: 'WARNING', color: 'text-amber-600', bg: 'bg-amber-50', icon: RotateCcw };
        return { label: 'ON TRACK', color: 'text-green-600', bg: 'bg-green-50', icon: BadgeCheck };
    }, [kitchenLoad]);

    const renderCustomizationBrief = (item: any) => {
        if (!item.customization) return null;
        const c = item.customization;
        const criticals = [];

        criticals.push(getSizeName(c.sizeId));
        if (c.crustId !== 'hand-tossed') criticals.push(getCrustName(c.crustId));

        const addedToppings = c.toppings.filter((t: any) => t.quantity > 1 || !t.isBaseIngredient);
        const removedToppings = c.toppings.filter((t: any) => t.isBaseIngredient && t.quantity === 0);

        if (addedToppings.length > 0) criticals.push(`+${addedToppings.length} Add`);
        if (removedToppings.length > 0) criticals.push(`-${removedToppings.length} Rem`);

        return criticals.join(' • ');
    };

    return (
        <>
            <div className="w-[480px] bg-white border-l border-slate-200 flex flex-col h-full shadow-[-40px_0_80px_-40px_rgba(0,0,0,0.1)] z-20 overflow-hidden">
                {/* Revenue Header */}
                <div className="p-8 border-b border-slate-100 flex flex-col gap-6 bg-white shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl rotate-3">
                                <ShoppingCart className="h-7 w-7" />
                            </div>
                            <div>
                                <h2 className="font-black text-xl uppercase tracking-tighter text-slate-900 leading-none">Cart Detail</h2>
                                <div className={cn("flex items-center gap-2 mt-2 px-2 py-0.5 rounded-full inline-flex", slaStatus.bg)}>
                                    <slaStatus.icon className={cn("h-3 w-3", slaStatus.color)} />
                                    <span className={cn("text-[8px] font-black uppercase tracking-widest", slaStatus.color)}>SLA: {slaStatus.label}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={undoLastAction} className="h-10 w-10 flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm" title="Undo"><RotateCcw className="h-4 w-4" /></button>
                            <button onClick={() => holdOrder('Queue Management')} disabled={cart.length === 0} className="h-10 w-10 flex items-center justify-center bg-amber-50 text-amber-500 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-sm disabled:opacity-20" title="Hold Order"><Pause className="h-4 w-4" /></button>
                            <button onClick={clearCart} className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" title="Clear"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    </div>

                    {heldOrders.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                            {heldOrders.map(order => (
                                <button
                                    key={order.id}
                                    onClick={() => resumeOrder(order.id)}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0 animate-in slide-in-from-left"
                                >
                                    <Play className="h-3 w-3 fill-current text-amber-500" /> Resume #{order.id.slice(-4)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50/50 custom-scrollbar">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-6 opacity-20 grayscale">
                                <ShoppingCart className="h-24 w-24 stroke-[1]" />
                                <div className="text-center">
                                    <p className="text-2xl font-black uppercase tracking-tighter">Cart is Vacant</p>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Start adding items</p>
                                </div>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <motion.div
                                    key={item.cartId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={cn(
                                        "bg-white rounded-3xl border-2 transition-all duration-300 overflow-hidden group",
                                        expandedItems.includes(item.cartId) ? "border-blue-600 shadow-xl" : "border-slate-100 shadow-sm"
                                    )}
                                >
                                    <div className="p-5 flex gap-4">
                                        <div className="relative shrink-0">
                                            <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover bg-slate-100" />
                                            <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white">
                                                {item.quantity}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div className="min-w-0">
                                                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight truncate leading-tight">{item.name}</h4>
                                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                                                        {renderCustomizationBrief(item) || 'STANDARD'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-black text-slate-900 text-sm block">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                                                    <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-900 hover:text-white transition-all" onClick={() => updateQuantity(item.cartId, item.quantity - 1)}><Minus className="h-3 w-3" /></button>
                                                    <span className="text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
                                                    <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-900 hover:text-white transition-all" onClick={() => updateQuantity(item.cartId, item.quantity + 1)}><Plus className="h-3 w-3" /></button>
                                                </div>

                                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => toggleExpand(item.cartId)} className={cn("p-2 rounded-xl transition-all", expandedItems.includes(item.cartId) ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400")}><ChevronDown className={cn("h-4 w-4", expandedItems.includes(item.cartId) && "rotate-180")} /></button>
                                                    {item.customization && <button onClick={() => startEditing(item)} className="p-2 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"><Edit2 className="h-4 w-4" /></button>}
                                                    <button onClick={() => duplicateItem(item.cartId)} className="p-2 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"><Copy className="h-4 w-4" /></button>
                                                    <button onClick={() => removeFromCart(item.cartId)} className="p-2 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Detail */}
                                    <AnimatePresence>
                                        {expandedItems.includes(item.cartId) && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50">
                                                <div className="p-6 pt-0 space-y-4">
                                                    {item.customization ? (
                                                        <div className="grid grid-cols-1 gap-3 text-[9px] font-black uppercase">
                                                            <div className="flex justify-between items-center text-slate-400">
                                                                <span>Dough/Base</span>
                                                                <span className="text-slate-900">{getSizeName(item.customization.sizeId)} ({getCrustName(item.customization.crustId)})</span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-slate-400">
                                                                <span>Sauce/Qty</span>
                                                                <span className="text-slate-900">{item.customization.sauce.id} ({item.customization.sauce.quantity}x)</span>
                                                            </div>
                                                            <div className="border-t border-slate-200 pt-2">
                                                                {item.customization.toppings.filter((t: any) => t.quantity !== 1 || !t.isBaseIngredient).map((t: any) => (
                                                                    <div key={t.toppingId + t.side} className="flex justify-between mb-1">
                                                                        <span className={cn(t.quantity === 0 ? "text-red-500" : "text-green-600")}>{t.quantity === 0 ? '-' : '+'} {getToppingName(t.toppingId)}</span>
                                                                        <span className="text-slate-400">{t.side}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[9px] text-center text-slate-400 uppercase font-black">Standard Production Build</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                    {/* Upsell Engine */}
                    {cart.length > 0 && upsellItem && !cart.find(i => i.productId === upsellItem.id) && (
                        <div className="px-8 pb-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900 border-4 border-blue-600 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group cursor-pointer active:scale-95 transition-transform"
                                onClick={() => usePOS().addToCart(upsellItem)}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-45 transition-transform"><Star className="h-20 w-20 text-white" /></div>
                                <div className="relative z-10 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1">Revenue Opportunity</p>
                                        <h5 className="font-black text-white text-lg uppercase tracking-tight leading-none">Add {upsellItem.name}?</h5>
                                        <p className="text-[10px] font-bold text-white/40 mt-2">One-tap High-Margin Add-on</p>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                        <Plus className="h-8 w-8 stroke-[4]" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Final Checkout */}
                <div className="p-8 bg-white border-t border-slate-200 space-y-6 shadow-2xl shrink-0">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                        </div>
                        {userRole === 'senior' && subtotal > 50 && (
                            <div className="flex justify-between text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-lg">
                                <span>Senior Discount (10%)</span>
                                <span>-${(subtotal * 0.1).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-end pt-4 border-t-2 border-slate-100">
                            <span className="text-xs font-black uppercase text-slate-900 tracking-widest">Grand Total</span>
                            <span className="text-5xl font-black text-slate-950 tracking-tighter">${(userRole === 'senior' && subtotal > 50 ? subtotal * 0.9 + tax : total).toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        className="w-full h-20 bg-blue-600 text-white text-lg font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-blue-500/20 hover:bg-slate-900 transition-all disabled:opacity-20 flex items-center justify-center gap-4 group"
                        disabled={cart.length === 0}
                        onClick={() => setIsCheckoutOpen(true)}
                    >
                        PAYMENT
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </button>

                    <div className="flex justify-center gap-4">
                        <div className="flex items-center gap-1.5 grayscale opacity-30">
                            <Star className="h-2 w-2 fill-current" />
                            <span className="text-[7px] font-black uppercase tracking-widest">Store 404-PX</span>
                        </div>
                    </div>
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                total={userRole === 'senior' && subtotal > 50 ? subtotal * 0.9 + tax : total}
            />
        </>
    );
};
