import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePOS } from '../context/POSContext';
import { Button } from './ui/button';
import { Check, CreditCard, Banknote, Smartphone, X, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
}

export const CheckoutModal = ({ isOpen, onClose, total }: CheckoutModalProps) => {
    const { processTransaction } = usePOS();
    const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
    const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | 'mobile' | null>(null);

    const handlePayment = async () => {
        if (!selectedMethod) return;

        setStep('processing');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        processTransaction(selectedMethod);
        setStep('success');
    };

    const handleClose = () => {
        if (step === 'success') {
            setStep('method'); // Reset for next time
            setSelectedMethod(null);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-bold">Checkout</h2>
                        {step !== 'processing' && (
                            <Button size="icon" variant="ghost" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="mb-6 text-center">
                            <p className="text-muted-foreground mb-1">Total Amount</p>
                            <div className="text-4xl font-bold text-primary">${total.toFixed(2)}</div>
                        </div>

                        {step === 'method' && (
                            <div className="space-y-3">
                                <button
                                    onClick={() => setSelectedMethod('card')}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                        selectedMethod === 'card'
                                            ? "border-primary bg-primary/5 shadow-inner"
                                            : "border-muted hover:border-primary/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <span className="font-semibold">Credit/Debit Card</span>
                                    </div>
                                    {selectedMethod === 'card' && <Check className="h-5 w-5 text-primary" />}
                                </button>

                                <button
                                    onClick={() => setSelectedMethod('cash')}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                        selectedMethod === 'cash'
                                            ? "border-primary bg-primary/5 shadow-inner"
                                            : "border-muted hover:border-primary/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300">
                                            <Banknote className="h-5 w-5" />
                                        </div>
                                        <span className="font-semibold">Cash</span>
                                    </div>
                                    {selectedMethod === 'cash' && <Check className="h-5 w-5 text-primary" />}
                                </button>

                                <button
                                    onClick={() => setSelectedMethod('mobile')}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                        selectedMethod === 'mobile'
                                            ? "border-primary bg-primary/5 shadow-inner"
                                            : "border-muted hover:border-primary/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                                            <Smartphone className="h-5 w-5" />
                                        </div>
                                        <span className="font-semibold">Mobile Payment</span>
                                    </div>
                                    {selectedMethod === 'mobile' && <Check className="h-5 w-5 text-primary" />}
                                </button>
                            </div>
                        )}

                        {step === 'processing' && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                                <p className="text-lg font-medium">Processing Transaction...</p>
                                <p className="text-sm text-muted-foreground">Please wait</p>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 mb-4">
                                    <Check className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                                <p className="text-muted-foreground mb-6">Receipt has been generated.</p>
                                <Button className="w-full" onClick={handleClose}>
                                    Start New Order
                                </Button>
                            </div>
                        )}
                    </div>

                    {step === 'method' && (
                        <div className="p-6 border-t bg-muted/20">
                            <Button
                                className="w-full h-12 text-lg"
                                disabled={!selectedMethod}
                                onClick={handlePayment}
                            >
                                Complete Payment
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
