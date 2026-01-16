import React, { useState, useMemo } from 'react';
import { usePOS, type PizzaCustomization, type SelectedTopping, type Portion, type Quantity } from '../context/POSContext';
import { PIZZA_OPTIONS, type Product, PRESETS, SPECIAL_INSTRUCTIONS } from '../data/mockData';
import { X, Check, Save, ChevronDown, ChevronRight, Zap, Info, RotateCcw, Clock, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomizationPanelProps {
    product: Product;
    initialCustomization?: PizzaCustomization;
    cartId?: string;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ product, initialCustomization, cartId }) => {
    const { addToCart, updateCartItem, cancelCustomizing, isRushMode, kitchenLoad, userRole, toppings } = usePOS();

    // 1. Core State
    const [sizeId, setSizeId] = useState(initialCustomization?.sizeId || PIZZA_OPTIONS.sizes[1].id);
    const [crustId, setCrustId] = useState(initialCustomization?.crustId || PIZZA_OPTIONS.crusts[0].id);

    // 2. Sauce & Cheese State
    const [sauce, setSauce] = useState(initialCustomization?.sauce || { id: PIZZA_OPTIONS.sauces[0].id, side: 'Full' as Portion, quantity: 1, isDrizzle: false });
    const [cheese, setCheese] = useState(initialCustomization?.cheese || { id: PIZZA_OPTIONS.cheeses[0].id, side: 'Full' as Portion, quantity: 1 });

    // 3. Toppings State
    const [selectedToppings, setSelectedToppings] = useState<SelectedTopping[]>(() => {
        if (initialCustomization?.toppings) return initialCustomization.toppings;
        return (product.baseIngredients || []).map(id => ({
            toppingId: id,
            side: 'Full',
            quantity: 1,
            isBaseIngredient: true
        }));
    });

    // 4. Cooking & Instructions
    const [cooking, setCooking] = useState(initialCustomization?.cooking || { bake: 'Normal', cut: 'Triangle', slices: 6 });
    const [instructions, setInstructions] = useState<string[]>(initialCustomization?.instructions || []);

    // 5. UI State
    const [activeSide, setActiveSide] = useState<Portion>('Full');
    const [showAdvanced, setShowAdvanced] = useState(userRole === 'senior' && !isRushMode);

    const currentPrice = useMemo(() => {
        const size = PIZZA_OPTIONS.sizes.find(s => s.id === sizeId);
        const crust = PIZZA_OPTIONS.crusts.find(c => c.id === crustId);
        const sauceData = PIZZA_OPTIONS.sauces.find(s => s.id === sauce.id);
        const cheeseData = PIZZA_OPTIONS.cheeses.find(c => c.id === cheese.id);

        let price = product.price;
        if (size) price *= size.priceMultiplier;
        if (crust) price += crust.extraPrice;
        if (sauceData) {
            price += sauceData.extraPrice;
            if (sauce.quantity > 1) price += 0.50;
        }
        if (cheeseData) {
            price += cheeseData.extraPrice;
            if (cheese.quantity > 1) price += 1.50;
        }

        selectedToppings.forEach(st => {
            const topping = toppings.find(t => t.id === st.toppingId);
            if (topping && st.quantity > 0) {
                let portionFactor = st.side === 'Full' ? 1 : (st.side === 'Quarter' ? 0.25 : 0.5);
                if (st.isBaseIngredient) {
                    if (st.quantity > 1) price += topping.price * (st.quantity - 1) * portionFactor;
                } else {
                    price += topping.price * st.quantity * portionFactor;
                }
            }
        });

        return Number(price.toFixed(2));
    }, [sizeId, crustId, sauce, cheese, selectedToppings, product.price]);

    const applyPreset = (preset: any) => {
        if (preset.action.cheeseQty !== undefined) {
            setCheese(prev => ({ ...prev, quantity: preset.action.cheeseQty }));
        }
        if (preset.action.removeToppings) {
            setSelectedToppings(prev => prev.map(t => preset.action.removeToppings.includes(t.toppingId) ? { ...t, quantity: 0 as Quantity } : t));
        }
        if (preset.action.sauceId) {
            setSauce(prev => ({ ...prev, id: preset.action.sauceId }));
        }
        if (preset.action.addToppings) {
            preset.action.addToppings.forEach((id: string) => {
                setSelectedToppings(prev => {
                    if (prev.find(t => t.toppingId === id && t.side === 'Full')) return prev;
                    return [...prev, { toppingId: id, side: 'Full', quantity: 1 }];
                });
            });
        }
    };

    const toggleTopping = (toppingId: string) => {
        setSelectedToppings(prev => {
            const existing = prev.find(t => t.toppingId === toppingId && t.side === activeSide);
            if (existing) {
                if (existing.isBaseIngredient && existing.quantity > 0) {
                    return prev.map(t => (t.toppingId === toppingId && t.side === activeSide) ? { ...t, quantity: 0 as Quantity } : t);
                }
                const sequence: Quantity[] = [0, 0.5, 1, 2, 3];
                const nextIndex = (sequence.indexOf(existing.quantity) + 1) % sequence.length;
                const nextQty = sequence[nextIndex];

                if (nextQty === 0 && !existing.isBaseIngredient) {
                    return prev.filter(t => !(t.toppingId === toppingId && t.side === activeSide));
                }
                return prev.map(t => (t.toppingId === toppingId && t.side === activeSide) ? { ...t, quantity: nextQty } : t);
            } else {
                return [...prev, { toppingId, side: activeSide, quantity: 1 }];
            }
        });
    };

    const handleSave = () => {
        const customization: PizzaCustomization = {
            sizeId, crustId, sauce, cheese, toppings: selectedToppings, cooking, instructions
        };
        if (cartId && cartId.length > 0) {
            updateCartItem(cartId, customization);
        } else {
            addToCart(product, customization);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-950 px-8 py-6 text-white flex justify-between items-center z-20 shadow-xl border-b border-white/5">
                <div>
                    <div className="flex items-center gap-4">
                        <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Configurator</span>
                        <h2 className="text-3xl font-black uppercase tracking-tight">{product.name}</h2>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Store Price: <span className="text-white">${currentPrice.toFixed(2)}</span></p>
                        <div className="h-1 w-1 rounded-full bg-slate-500" />
                        <div className="flex items-center gap-2 text-blue-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Prep: {product.prepTimeMin + (kitchenLoad === 'busy' ? 5 : kitchenLoad === 'extreme' ? 15 : 0)} MIN</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => cancelCustomizing(cartId || 'new')} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all flex items-center gap-3 border border-white/10 group">
                        <X className="h-6 w-6" />
                    </button>
                    {(userRole === 'senior' || !isRushMode) && (
                        <button onClick={handleSave} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 font-black text-xs uppercase tracking-widest flex items-center gap-3">
                            <Save className="h-4 w-4" /> Save Order
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-100">
                <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 p-10 pb-40">

                    <div className="col-span-12 lg:col-span-9 space-y-12">
                        {/* 01. Presets */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-8 w-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-sm">01</div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Operational Presets</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {PRESETS.map(p => (
                                    <button
                                        key={p.name}
                                        onClick={() => applyPreset(p)}
                                        className="p-6 bg-white border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 rounded-[2rem] text-left group transition-all shadow-sm"
                                    >
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-600">Quick Config</p>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{p.name}</p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* 02. Size & Crust */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Global Size Matrix</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {PIZZA_OPTIONS.sizes.map(s => (
                                        <button key={s.id} onClick={() => setSizeId(s.id)} className={cn("py-6 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all", sizeId === s.id ? "bg-slate-900 border-slate-900 text-white shadow-xl" : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-300")}>
                                            {s.name}
                                            <span className="block text-[8px] mt-1 opacity-60">x{s.priceMultiplier}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                            <section className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Crust Engineering</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {PIZZA_OPTIONS.crusts.map(c => (
                                        <button key={c.id} onClick={() => setCrustId(c.id)} className={cn("py-4 px-2 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all", crustId === c.id ? "bg-slate-900 border-slate-900 text-white shadow-xl" : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-300")}>
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* 03. Sauces & Cheeses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-red-500/10 group-hover:bg-red-500 transition-colors" />
                                <div className="flex justify-between items-center mb-8 px-1">
                                    <h3 className="text-[10px] font-black text-red-600 uppercase tracking-widest">Sauce Matrix</h3>
                                    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl scale-75">
                                        {(['Full', 'Left', 'Right'] as Portion[]).map(p => (
                                            <button key={p} onClick={() => setSauce(prev => ({ ...prev, side: p }))} className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", sauce.side === p ? "bg-white text-red-600 shadow-sm" : "text-slate-500")}>{p}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex flex-wrap gap-2">
                                        {PIZZA_OPTIONS.sauces.map(s => (
                                            <button key={s.id} onClick={() => setSauce(prev => ({ ...prev, id: s.id }))} className={cn("px-5 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all", sauce.id === s.id ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-300")}>{s.name}</button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Intensity:</span>
                                        <div className="flex-1 flex gap-1">
                                            {[1, 2, 3].map(q => (
                                                <button key={q} onClick={() => setSauce(prev => ({ ...prev, quantity: q }))} className={cn("flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all border-2", sauce.quantity === q ? "bg-red-600 border-red-600 text-white shadow-md" : "bg-slate-50 border-slate-50 text-slate-400")}>{q === 1 ? 'Nml' : q === 2 ? 'Ext' : 'Dbl'}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500/10 group-hover:bg-blue-500 transition-colors" />
                                <div className="flex justify-between items-center mb-8 px-1">
                                    <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Cheese Matrix</h3>
                                    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl scale-75">
                                        {(['Full', 'Left', 'Right'] as Portion[]).map(p => (
                                            <button key={p} onClick={() => setCheese(prev => ({ ...prev, side: p }))} className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", cheese.side === p ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}>{p}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex flex-wrap gap-2">
                                        {PIZZA_OPTIONS.cheeses.map(c => (
                                            <button key={c.id} onClick={() => setCheese(prev => ({ ...prev, id: c.id }))} className={cn("px-5 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all", cheese.id === c.id ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-300")}>{c.name}</button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Volume:</span>
                                        <div className="flex-1 flex gap-1">
                                            {[1, 2, 3].map(q => (
                                                <button key={q} onClick={() => setCheese(prev => ({ ...prev, quantity: q }))} className={cn("flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all border-2", cheese.quantity === q ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-slate-50 border-slate-50 text-slate-400")}>{q === 1 ? 'Nml' : q === 2 ? 'Ext' : 'Dbl'}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Toppings Portals */}
                        <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Ingredient Inventory</h3>
                                <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
                                    {(['Left', 'Full', 'Right', 'Quarter'] as Portion[]).map(side => (
                                        <button key={side} onClick={() => setActiveSide(side)} className={cn("px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all", activeSide === side ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}>{side}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div>
                                    <h4 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-6">Vegetarian Lineup</h4>
                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                        {toppings.filter(t => t.category === 'veg').map(t => {
                                            const item = selectedToppings.find(st => st.toppingId === t.id && st.side === activeSide);
                                            const isOut = t.stockStatus === 'out';
                                            const isLow = t.stockStatus === 'low';
                                            return (
                                                <button
                                                    key={t.id}
                                                    disabled={isOut}
                                                    onClick={() => toggleTopping(t.id)}
                                                    className={cn(
                                                        "relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group",
                                                        item && item.quantity > 0
                                                            ? "bg-green-600 border-green-600 text-white shadow-lg"
                                                            : isLow ? "bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-400" : "bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200",
                                                        isOut && "opacity-20 grayscale cursor-not-allowed"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-1.5 min-h-[1.5rem]">
                                                        {isOut && <AlertTriangle className="h-3 w-3 text-red-500" />}
                                                        {isLow && <Activity className="h-3 w-3 text-amber-500 animate-pulse" />}
                                                        <span className="text-[9px] font-black text-center leading-tight">{t.name}</span>
                                                    </div>

                                                    {isLow && !item && <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 bg-amber-500 text-white text-[7px] font-black rounded-full shadow-sm">LOW</span>}

                                                    {item && item.quantity > 0 ? (
                                                        <span className="text-[8px] opacity-80 font-bold uppercase tracking-widest">{item.quantity === 0.5 ? 'Light' : item.quantity === 2 ? 'Extra' : item.quantity === 3 ? 'Double' : 'Done'}</span>
                                                    ) : isOut ? (
                                                        <span className="text-[7px] font-black text-red-600 uppercase">Unavailable</span>
                                                    ) : null}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-6">Protein Lineup</h4>
                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                        {toppings.filter(t => t.category === 'non-veg').map(t => {
                                            const item = selectedToppings.find(st => st.toppingId === t.id && st.side === activeSide);
                                            const isOut = t.stockStatus === 'out';
                                            const isLow = t.stockStatus === 'low';
                                            return (
                                                <button
                                                    key={t.id}
                                                    disabled={isOut}
                                                    onClick={() => toggleTopping(t.id)}
                                                    className={cn(
                                                        "relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group",
                                                        item && item.quantity > 0
                                                            ? "bg-orange-600 border-orange-600 text-white shadow-lg"
                                                            : isLow ? "bg-amber-50 border-amber-200 text-amber-900 hover:border-amber-400" : "bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200",
                                                        isOut && "opacity-20 grayscale cursor-not-allowed"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-1.5 min-h-[1.5rem]">
                                                        {isOut && <AlertTriangle className="h-3 w-3 text-red-500" />}
                                                        {isLow && <Activity className="h-3 w-3 text-amber-500 animate-pulse" />}
                                                        <span className="text-[9px] font-black text-center leading-tight">{t.name}</span>
                                                    </div>

                                                    {isLow && !item && <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 bg-amber-500 text-white text-[7px] font-black rounded-full shadow-sm">LOW</span>}

                                                    {item && item.quantity > 0 ? (
                                                        <span className="text-[8px] opacity-80 font-bold uppercase tracking-widest">{item.quantity === 0.5 ? 'Light' : item.quantity === 2 ? 'Extra' : item.quantity === 3 ? 'Double' : 'Done'}</span>
                                                    ) : isOut ? (
                                                        <span className="text-[7px] font-black text-red-600 uppercase">Unavailable</span>
                                                    ) : null}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 06. Senior Overrides */}
                        {userRole === 'senior' && (
                            <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm">
                                <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                                            <ChevronDown className={cn("h-6 w-6 transition-transform", showAdvanced && "rotate-180")} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Kitchen Overrides</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Bake Level, Cut Style, Slice Counts</p>
                                        </div>
                                    </div>
                                    {isRushMode && <span className="text-[10px] font-black text-amber-600 uppercase animate-pulse">Rush: Minimize Changes</span>}
                                </button>

                                <AnimatePresence>
                                    {showAdvanced && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="grid grid-cols-2 gap-8 pt-10 mt-10 border-t border-slate-50">
                                                <div>
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Bake Level</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {PIZZA_OPTIONS.cookingPreferences.bakeLevels.map(b => (
                                                            <button key={b} onClick={() => setCooking(prev => ({ ...prev, bake: b }))} className={cn("py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all", cooking.bake === b ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500")}>{b}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cut Style</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {PIZZA_OPTIONS.cookingPreferences.cutStyles.map(c => (
                                                            <button key={c} onClick={() => setCooking(prev => ({ ...prev, cut: c }))} className={cn("py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all", cooking.cut === c ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500")}>{c}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </section>
                        )}
                    </div>

                    {/* Right: Summary Portal */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl sticky top-8">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-1">Active Configuration</p>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Base Specs</p>
                                    <p className="text-xl font-black uppercase tracking-tighter mt-1">{sizeId} {crustId}</p>
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Ingredient Delta</p>
                                    <div className="space-y-3">
                                        {selectedToppings.filter(t => t.quantity !== 1 || !t.isBaseIngredient).map(st => {
                                            const t = toppings.find(to => to.id === st.toppingId);
                                            return (
                                                <div key={st.toppingId} className="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase">{t?.name}</span>
                                                        <span className="text-[8px] text-slate-500 font-bold uppercase">{st.side}</span>
                                                    </div>
                                                    <span className={cn("text-[10px] font-black", st.quantity === 0 ? "text-red-500" : "text-green-500")}>{st.quantity === 0 ? 'REMOVE' : st.quantity + 'x'}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 pt-10 border-t border-white/20">
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Calculated Total</span>
                                    <span className="text-4xl font-black">${currentPrice.toFixed(2)}</span>
                                </div>
                                <button onClick={handleSave} className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                                    Accept Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
