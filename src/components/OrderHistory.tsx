import { usePOS, type Order } from '../context/POSContext';
import { Card } from './ui/card';
import { Clock, Calendar, Activity, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export const OrderHistory = ({ onSelectOrder }: { onSelectOrder: (order: Order) => void }) => {
    const { orders, liveOrders } = usePOS();

    const allOrders = [...liveOrders, ...orders];

    return (
        <div className="flex-1 h-full bg-muted/30 p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Order Repository</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-3">Visual Audit of All Active & Past Transactions</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                        <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{liveOrders.length} ACTIVE PREPS</span>
                    </div>
                </div>

                {allOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-300">
                        <Clock className="h-20 w-20 mb-6 opacity-10" />
                        <p className="text-xl font-black uppercase tracking-widest opacity-20">Archive is empty</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {allOrders.map((order) => {
                            const isInPrep = liveOrders.some(lo => lo.orderId === order.orderId);
                            return (
                                <Card key={order.orderId} className="group relative overflow-hidden bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] hover:border-blue-200 transition-all hover:shadow-2xl hover:shadow-blue-900/5">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                        <div className="flex gap-6">
                                            <div className={cn(
                                                "h-16 w-16 rounded-3xl flex flex-col items-center justify-center font-black transition-all group-hover:scale-110 group-hover:rotate-3",
                                                isInPrep ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400"
                                            )}>
                                                <span className="text-[8px] uppercase opacity-60">Token</span>
                                                <span className="text-xl leading-none">{order.tokenNumber.split('-')[1]}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                                                        Token {order.tokenNumber}
                                                    </h3>
                                                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{order.orderType}</span>
                                                    {isInPrep && (
                                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full text-[9px] font-black text-amber-600 uppercase tracking-widest animate-pulse border border-amber-100">
                                                            <div className="h-1 w-1 rounded-full bg-amber-600" />
                                                            In Prep
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 px-1">
                                                    <span className="flex items-center gap-2">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(order.timestamp).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="mt-6 flex flex-wrap gap-2">
                                                    {order.items.map(item => (
                                                        <div key={item.cartId} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                                            {item.quantity}x {item.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 lg:border-l lg:border-slate-100 lg:pl-8">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                                <div className="text-3xl font-black text-slate-950 flex items-center justify-end">
                                                    <span className="text-sm self-start mt-1.5 mr-0.5">$</span>
                                                    {order.total.toFixed(2)}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onSelectOrder(order)}
                                                className="h-14 w-14 lg:h-16 lg:w-48 bg-slate-900 text-white rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl group/btn"
                                            >
                                                <Activity className="h-5 w-5 lg:h-4 lg:w-4 group-hover/btn:animate-pulse" />
                                                <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest">Track Status</span>
                                                <ChevronRight className="hidden lg:inline h-4 w-4 opacity-40 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
