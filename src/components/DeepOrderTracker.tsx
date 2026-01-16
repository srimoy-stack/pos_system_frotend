import React from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Clock,
    CheckCircle2,
    Timer,
    UtensilsCrossed,
    Flame,
    PackageCheck,
    Activity,
    Info,
    AlertCircle,
    ChevronRight,
    ChefHat,
    Waves
} from 'lucide-react';
import { cn } from '../lib/utils';
import { type Order, type ItemStatus } from '../context/POSContext';

interface DeepOrderTrackerProps {
    order: Order;
    onClose: () => void;
}

const StatusConfig: Record<ItemStatus, { label: string, color: string, icon: any }> = {
    'Queued': { label: 'In Queue', color: 'text-slate-400', icon: Clock },
    'Preparing': { label: 'Prepping', color: 'text-blue-500', icon: ChefHat },
    'Baking': { label: 'In Oven', color: 'text-orange-500', icon: Flame },
    'Packing': { label: 'Packing', color: 'text-purple-500', icon: PackageCheck },
    'Ready': { label: 'Ready', color: 'text-green-500', icon: CheckCircle2 }
};

export const DeepOrderTracker: React.FC<DeepOrderTrackerProps> = ({ order, onClose }) => {
    const isDelayed = order.estimatedRemainingMinutes > 15;

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-[450px] h-full bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-[150] flex flex-col border-l border-slate-100"
        >
            {/* Header */}
            <div className="p-8 bg-slate-950 text-white flex justify-between items-start shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{order.orderType}</span>
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{order.orderId}</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">{order.tokenNumber}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-all"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* 1. Customer Summary Card (Quick Explanation View) */}
                <section className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Activity className="h-24 w-24" />
                    </div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Info className="h-3 w-3" />
                        Customer Summary Mode
                    </p>
                    <h3 className="text-2xl font-black text-blue-900 leading-tight">
                        {order.items.every(i => i.status === 'Ready')
                            ? "All items ready! Order is at the pickup counter."
                            : order.stationProgress.oven === 'in-progress'
                                ? "Almost done. Your pizza is currently in the oven."
                                : "Your order is actively being prepared by our chefs."}
                    </h3>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-blue-100">
                            <Timer className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-900 font-black text-xs uppercase tracking-widest">
                                Est. {Math.ceil(order.estimatedRemainingMinutes)} - {Math.ceil(order.estimatedRemainingMinutes + 2)} MIN
                            </span>
                        </div>
                        <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                            Updated just now
                        </div>
                    </div>
                </section>

                {/* 2. Station Progress Analysis */}
                <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Production Pipeline</h4>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { id: 'dough', label: 'Dough', icon: ChefHat },
                            { id: 'toppings', label: 'Toppings', icon: UtensilsCrossed },
                            { id: 'oven', label: 'Oven', icon: Flame },
                            { id: 'packing', label: 'Packing', icon: PackageCheck }
                        ].map((station) => {
                            const status = order.stationProgress[station.id as keyof typeof order.stationProgress];
                            return (
                                <div key={station.id} className="flex flex-col items-center gap-3">
                                    <div className={cn(
                                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-all",
                                        status === 'completed' ? "bg-green-100 text-green-600" : status === 'in-progress' ? "bg-blue-100 text-blue-600 animate-pulse" : "bg-slate-50 text-slate-300"
                                    )}>
                                        <station.icon className="h-6 w-6" />
                                    </div>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-widest text-center",
                                        status === 'completed' ? "text-green-600" : status === 'in-progress' ? "text-blue-600" : "text-slate-400"
                                    )}>{status.replace('-', ' ')}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 3. Item-Level Status */}
                <section>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Item-Specific States</h4>
                    <div className="space-y-4">
                        {order.items.map((item, idx) => {
                            const Config = StatusConfig[item.status];
                            return (
                                <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-blue-200 transition-all cursor-default">
                                    <div className="flex gap-4 items-center">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-sm", Config.color.replace('text', 'bg').replace('500', '100'))}>
                                            <Config.icon className={cn("h-5 w-5", Config.color)} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black uppercase text-slate-900 leading-none">{item.name}</span>
                                                <span className="text-[10px] font-black text-slate-300">x{item.quantity}</span>
                                            </div>
                                            {item.customization && (
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {item.customization.sizeId} • {item.customization.crustId}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest", Config.color)}>{item.status}</span>
                                        <div className="h-1 w-20 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: item.status === 'Ready' ? '100%' :
                                                        item.status === 'Packing' ? '80%' :
                                                            item.status === 'Baking' ? '60%' :
                                                                item.status === 'Preparing' ? '30%' : '5%'
                                                }}
                                                className={cn("h-full", Config.color.replace('text', 'bg'))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 4. Delay Management (Conditional) */}
                {isDelayed && (
                    <section className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex gap-4 items-start">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                        <div>
                            <h5 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Confidential Delay Notice</h5>
                            <p className="text-[10px] font-bold text-amber-600 leading-relaxed uppercase">
                                High kitchen load is impacting times. Your order is prioritised in the oven queue.
                            </p>
                        </div>
                    </section>
                )}
            </div>

            {/* Footer Action */}
            <div className="p-8 border-t border-slate-100 shrink-0">
                <button
                    onClick={onClose}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                    Hide Details <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
};
