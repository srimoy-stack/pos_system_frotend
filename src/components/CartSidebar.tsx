import { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Button } from './ui/button';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';
import { motion, AnimatePresence } from 'framer-motion';

export const CartSidebar = () => {
    const { cart, updateQuantity, clearCart } = usePOS();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return (
        <>
            <div className="w-full md:w-96 bg-card border-l flex flex-col h-full shadow-xl">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Current Order</h2>
                            <p className="text-xs text-muted-foreground">Order #3425</p>
                        </div>
                    </div>
                    {cart.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearCart}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                    <AnimatePresence>
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4 opacity-50">
                                <ShoppingCart className="h-16 w-16" />
                                <p className="text-lg font-medium">Cart is empty</p>
                                <p className="text-sm text-center px-8">Select items from the menu to add them to this order.</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-background rounded-xl p-3 shadow-sm border flex gap-3"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-20 w-20 rounded-lg object-cover bg-muted"
                                    />
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                                                <button
                                                    className="h-6 w-6 flex items-center justify-center rounded-md bg-white shadow-sm hover:scale-110 transition-transform active:scale-90"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button
                                                    className="h-6 w-6 flex items-center justify-center rounded-md bg-white shadow-sm hover:scale-110 transition-transform active:scale-90"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div className="font-bold text-sm">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 bg-card border-t space-y-4 z-10">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax (10%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <Button
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all"
                        disabled={cart.length === 0}
                        onClick={() => setIsCheckoutOpen(true)}
                    >
                        Checkout <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                total={total}
            />
        </>
    );
};
