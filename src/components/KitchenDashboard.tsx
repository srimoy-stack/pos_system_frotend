import { usePOS } from '../context/POSContext';
import { Card } from './ui/card';
import {
    Clock,
    Zap,
    AlertCircle,
    CheckCircle2,
    Flame,
    Activity,
    ArrowRight,
    ChefHat,
    Waves
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PIZZA_OPTIONS } from '../data/mockData';
import { motion } from 'framer-motion';

export const KitchenDashboard = () => {
    const {
        kitchenLoad,
        stationLoads,
        activeOrdersCount,
        setShowReadinessView,
        products,
        toppings,
        updateToppingStatus
    } = usePOS();

    const categories = [
        { name: 'Crusts', items: PIZZA_OPTIONS.crusts.map(c => ({ name: c.name, status: 'available' })) },
        { name: 'Cheese', items: PIZZA_OPTIONS.cheeses.map(c => ({ name: c.name, status: 'available' })) },
        { name: 'Sauces', items: PIZZA_OPTIONS.sauces.map(s => ({ name: s.name, status: 'available' })) },
        { name: 'Veg Toppings', items: toppings.filter(t => t.category === 'veg') },
        { name: 'Protein Lineup', items: toppings.filter(t => t.category === 'non-veg') },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'out': return <AlertCircle className="h-4 w-4 text-red-500" />;
            case 'low': return <Activity className="h-4 w-4 text-amber-500 animate-pulse" />;
            default: return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'out': return "bg-red-50 border-red-100";
            case 'low': return "bg-amber-50 border-amber-100";
            default: return "bg-green-50 border-green-100 shadow-sm";
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-100 flex flex-col p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Control Tower Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Kitchen Command Center</div>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Real-Time Operational Audit</div>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Kitchen Readiness</h2>
                </div>
                <button
                    onClick={() => setShowReadinessView(false)}
                    className="px-8 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-xl group"
                >
                    Return to Terminal <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
                {/* 1. Operational Summary Bar (Left Side) */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                    <Card className="p-8 bg-slate-900 text-white border-none rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Activity className="h-32 w-32" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Overall Intensity</p>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg",
                                    kitchenLoad === 'extreme' ? "bg-red-500 shadow-red-500/40" : kitchenLoad === 'busy' ? "bg-amber-500 shadow-amber-500/40" : "bg-green-500 shadow-green-500/40"
                                )}>
                                    <Flame className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{kitchenLoad}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Operational</p>
                                </div>
                            </div>

                            <div className="space-y-6 border-t border-white/10 pt-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Average Wait</p>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-blue-400" />
                                        <span className="text-2xl font-black">{activeOrdersCount * 2 + 5} MIN</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Queue</p>
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-amber-400" />
                                        <span className="text-2xl font-black">{activeOrdersCount} ORDERS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Station Load Indicators */}
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { name: 'Pizza Station', value: stationLoads.pizza, icon: <ChefHat className="h-4 w-4" /> },
                            { name: 'Oven Capacity', value: stationLoads.oven, icon: <Flame className="h-4 w-4" /> },
                            { name: 'Fryer Station', value: stationLoads.fryer, icon: <Waves className="h-4 w-4" /> },
                        ].map((station) => (
                            <Card key={station.name} className="p-6 rounded-[2rem] border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                            {station.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{station.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-900">{station.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${station.value}%` }}
                                        className={cn(
                                            "h-full rounded-full transition-all duration-1000",
                                            station.value > 80 ? "bg-red-500" : station.value > 60 ? "bg-amber-500" : "bg-green-500"
                                        )}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 2. Availability Grid (Center/Right) */}
                <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-8 overflow-y-auto pr-4 no-scrollbar pb-32">
                    {categories.map((cat, idx) => (
                        <div key={cat.name} className={cn("col-span-12", idx < 3 ? "lg:col-span-4" : "lg:col-span-6")}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-8 w-8 bg-white border border-slate-200 text-slate-900 rounded-xl flex items-center justify-center font-black text-xs shadow-sm">{idx + 1}</div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em]">{cat.name}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {cat.items.map((item: any) => (
                                    <div
                                        key={item.id || item.name}
                                        onClick={() => {
                                            const id = item.id || toppings.find(t => t.name === item.name)?.id;
                                            if (id) {
                                                const currentStatus = item.stockStatus || item.status;
                                                const nextStatus = currentStatus === 'available' ? 'low' : currentStatus === 'low' ? 'out' : 'available';
                                                updateToppingStatus(id, nextStatus as any);
                                            }
                                        }}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer active:scale-95",
                                            getStatusBg(item.stockStatus || item.status)
                                        )}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-black text-[10px] uppercase tracking-tighter text-slate-900 group-hover:translate-x-1 transition-transform">{item.name}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                                {item.stockStatus === 'out' ? 'CRITICAL OUT' : item.stockStatus === 'low' ? 'RESTOCKING' : 'OPERATIONAL'}
                                            </span>
                                        </div>
                                        {getStatusIcon(item.stockStatus || item.status)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Item-Level Capability Section */}
                    <div className="col-span-12 pt-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-8 w-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-blue-200">★</div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.4em]">Capability Audit: Signature Items</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.slice(0, 5).map(p => {
                                const isOut = p.stockStatus === 'out';
                                const isLow = p.stockStatus === 'low';
                                return (
                                    <div key={p.id} className={cn(
                                        "p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-4",
                                        isOut ? "bg-red-50 border-red-200 opacity-60" : "bg-white border-slate-100 shadow-sm"
                                    )}>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-black text-sm uppercase tracking-tight text-slate-900">{p.name}</h4>
                                            <div className={cn(
                                                "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                                isOut ? "bg-red-100 text-red-700 border-red-200" : isLow ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-green-100 text-green-700 border-green-200"
                                            )}>
                                                {isOut ? 'DO NOT SELL' : isLow ? 'LIMITED' : 'READY'}
                                            </div>
                                        </div>
                                        {isOut && <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest italic">Reason: Critical ingredients out of stock</p>}
                                        {!isOut && kitchenLoad === 'extreme' && <p className="text-[8px] font-bold text-amber-600 uppercase tracking-widest animate-pulse">Rush Push: Fast prep recommended</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Heartbeat Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-between items-center px-12 z-[110]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Live Heartbeat Active</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Last synced: Just now</span>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Suggested Action:</p>
                    <div className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                        PROMOTE FAST-PATH MARGHERITA DURING RUSH
                    </div>
                </div>
            </div>
        </div>
    );
};
