import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Product, PRODUCTS } from '../data/mockData';

export interface CartItem extends Product {
    quantity: number;
}

export interface Order {
    orderId: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    timestamp: string;
    paymentMethod: 'cash' | 'card' | 'mobile';
}

interface POSContextType {
    products: Product[];
    cart: CartItem[];
    orders: Order[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    processTransaction: (paymentMethod: 'cash' | 'card' | 'mobile') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    updateStock: (productId: string, newStock: number) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>(PRODUCTS);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            // Check stock before adding
            const currentQty = existing ? existing.quantity : 0;
            if (currentQty + 1 > product.stock) {
                // Ideally show a toast here, for now we just return
                return prev;
            }

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        // Check stock limit
        const product = products.find(p => p.id === productId);
        if (product && quantity > product.stock) {
            return; // Cap at max stock
        }

        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateStock = (productId: string, newStock: number) => {
        setProducts(prev => prev.map(p =>
            p.id === productId ? { ...p, stock: newStock } : p
        ));
    };

    const processTransaction = (paymentMethod: 'cash' | 'card' | 'mobile') => {
        if (cart.length === 0) return;

        // Deduct stock
        setProducts(prev => prev.map(product => {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem) {
                return { ...product, stock: Math.max(0, product.stock - cartItem.quantity) };
            }
            return product;
        }));

        const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tax = subtotal * 0.1; // 10% tax example
        const total = subtotal + tax;

        const newOrder: Order = {
            orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
            items: [...cart],
            subtotal,
            tax,
            total,
            timestamp: new Date().toISOString(),
            paymentMethod,
        };

        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
    };

    return (
        <POSContext.Provider
            value={{
                products,
                cart,
                orders,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                processTransaction,
                searchQuery,
                setSearchQuery,
                selectedCategory,
                setSelectedCategory,
                updateStock,
            }}
        >
            {children}
        </POSContext.Provider>
    );
};

export const usePOS = () => {
    const context = useContext(POSContext);
    if (context === undefined) {
        throw new Error('usePOS must be used within a POSProvider');
    }
    return context;
};
