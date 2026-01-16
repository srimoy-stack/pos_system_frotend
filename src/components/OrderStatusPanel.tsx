import React from 'react';
import { usePOS, type Order } from '../context/POSContext';
import { Timer, LayoutDashboard, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const OrderStatusPanel: React.FC<{ onSelectOrder: (order: Order) => void }> = ({ onSelectOrder }) => {
    const { liveOrders } = usePOS();

    if (liveOrders.length === 0) return null;

    return (
        <div className="bg-white border-b border-slate-100 h-24 flex items-center px-8 gap-6 overflow-x-auto no-scrollbar shrink-0 shadow-sm">
            <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
                <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                    <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Live Status</h3>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{liveOrders.length} Tracks</p>
                </div>
            </div>

            <div className="flex gap-4 items-center h-full">
                {liveOrders.map((order) => {
                    const isReady = order.items.every(i => i.status === 'Ready');
                    const progress = order.items.filter(i => i.status === 'Ready').length / order.items.length;

                    return (
                        <motion.button
                            layout
                            key={order.orderId}
                            onClick={() => onSelectOrder(order)}
                            className={cn(
                                "h-14 min-w-[200px] flex items-center justify-between px-5 bg-slate-50 border border-slate-100 rounded-2xl transition-all group hover:bg-white hover:border-blue-200 hover:shadow-lg",
                                isReady && "border-green-200 bg-green-50"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-xs uppercase text-slate-900">{order.tokenNumber}</span>
                                        {isReady ? (
                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                                        )}
                                    </div>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                                        {isReady ? 'READY TO PACK' : `${Math.ceil(order.estimatedRemainingMinutes)}min left`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative h-8 w-8">
                                    <svg className="h-full w-full -rotate-90">
                                        <circle
                                            cx="16" cy="16" r="14"
                                            fill="none" strokeWidth="3"
                                            className="stroke-slate-200"
                                        />
                                        <motion.circle
                                            cx="16" cy="16" r="14"
                                            fill="none" strokeWidth="3"
                                            strokeDasharray="88"
                                            animate={{ strokeDashoffset: 88 - (88 * progress) }}
                                            className={cn("stroke-blue-600 transition-all duration-1000", isReady && "stroke-green-500")}
                                        />
                                    </svg>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
