import { usePOS } from '../context/POSContext';
import { Card } from './ui/card';
import { Clock, DollarSign, Calendar } from 'lucide-react';

export const OrderHistory = () => {
    const { orders } = usePOS();

    return (
        <div className="flex-1 h-full bg-muted/30 p-6 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6">Order History</h1>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                    <Clock className="h-16 w-16 mb-4 opacity-20" />
                    <p className="text-lg">No orders yet</p>
                </div>
            ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                    {orders.map((order) => (
                        <Card key={order.orderId} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    #{order.orderId.slice(-3)}
                                </div>
                                <div>
                                    <h3 className="font-bold flex items-center gap-2">
                                        Order #{order.orderId}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(order.timestamp).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {new Date(order.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm">
                                        {order.items.map(item => (
                                            <span key={item.id} className="mr-3 inline-block bg-muted px-2 py-1 rounded text-xs">
                                                {item.quantity}x {item.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 text-right">
                                <div className="text-2xl font-bold flex items-center justify-end">
                                    <DollarSign className="h-5 w-5" />
                                    {order.total.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground capitalize">
                                    {order.paymentMethod} Payment
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
