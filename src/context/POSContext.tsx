import { createContext, useContext, useState, type ReactNode, useMemo } from 'react';
import { type Product, PRODUCTS, TOPPINGS, PIZZA_OPTIONS, DEFAULT_PIZZA_CUSTOMIZATION, ORDER_TEMPLATES } from '../data/mockData';

export type Portion = 'Full' | 'Left' | 'Right' | 'Quarter';
export type Quantity = 0 | 0.5 | 1 | 2 | 3;

export interface ToppingStatus {
    id: string;
    stockStatus: 'available' | 'low' | 'out';
}

export interface SelectedTopping {
    toppingId: string;
    side: Portion;
    quantity: Quantity;
    priority?: 'top' | 'under';
    isBaseIngredient?: boolean;
}

export interface PizzaCustomization {
    sizeId: string;
    crustId: string;
    sauce: { id: string; side: Portion; quantity: number; isDrizzle: boolean; };
    cheese: { id: string; side: Portion; quantity: number; };
    toppings: SelectedTopping[];
    cooking: { bake: string; cut: string; slices: number; };
    instructions: string[];
}

export interface CartItem {
    cartId: string;
    productId: string;
    name: string;
    price: number;
    basePrice: number;
    quantity: number;
    customization?: PizzaCustomization;
    category: string;
    image: string;
}

export type ItemStatus = 'Queued' | 'Preparing' | 'Baking' | 'Packing' | 'Ready';

export interface StationProgress {
    dough: 'pending' | 'in-progress' | 'completed';
    toppings: 'pending' | 'in-progress' | 'completed';
    oven: 'pending' | 'in-progress' | 'completed';
    packing: 'pending' | 'in-progress' | 'completed';
}

export interface Order {
    orderId: string;
    tokenNumber: string;
    orderType: 'Dine-in' | 'Takeaway';
    items: (CartItem & { status: ItemStatus })[];
    subtotal: number;
    tax: number;
    total: number;
    timestamp: string;
    paymentMethod: 'cash' | 'card' | 'mobile';
    estimatedRemainingMinutes: number;
    stationProgress: StationProgress;
    delayReason?: string;
}

interface ConfidenceFlag {
    type: 'warning' | 'info';
    message: string;
    field?: string;
}

interface POSContextType {
    products: Product[];
    cart: CartItem[];
    orders: Order[];

    // High-Volume Scaling & Tabs
    ordersTabs: { id: string; name: string; items: CartItem[] }[];
    activeTabIndex: number;
    setActiveTabIndex: (index: number) => void;
    addNewTab: () => void;
    closeTab: (index: number) => void;

    // Queue Handling
    heldOrders: { id: string; items: CartItem[]; reason: string; heldAt: Date }[];
    holdOrder: (reason: string) => void;
    resumeOrder: (id: string) => void;

    // Role-Aware UI
    userRole: 'junior' | 'senior';
    setUserRole: (role: 'junior' | 'senior') => void;

    // Parallel Customization (Tabs)
    customizingItems: { product: Product; customization?: PizzaCustomization; tempId: string }[];
    activeCustomizationIndex: number;
    setActiveCustomizationIndex: (index: number) => void;
    startCustomizing: (product: Product) => void;
    startEditing: (item: CartItem) => void;
    cancelCustomizing: (tempId: string) => void;

    addToCart: (product: Product, customization?: PizzaCustomization) => void;
    applyTemplate: (templateId: string) => void;
    updateCartItem: (cartId: string, customization: PizzaCustomization) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    duplicateItem: (cartId: string) => void;
    undoLastAction: () => void;
    clearCart: () => void;
    processTransaction: (paymentMethod: 'cash' | 'card' | 'mobile') => void;

    recentlyOrdered: string[];

    // Settings & Intelligence
    isRushMode: boolean;
    setRushMode: (mode: boolean) => void;
    kitchenLoad: 'normal' | 'busy' | 'extreme';
    stationLoads: { pizza: number; oven: number; fryer: number };
    activeOrdersCount: number;
    showReadinessView: boolean;
    setShowReadinessView: (show: boolean) => void;
    confidenceFlags: ConfidenceFlag[];

    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    updateStock: (id: string, amount: number) => void;
    subtotal: number;
    tax: number;
    total: number;
    toppings: (typeof TOPPINGS);
    updateToppingStatus: (id: string, status: 'available' | 'low' | 'out') => void;
    liveOrders: Order[];
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>(PRODUCTS);
    const [toppings, setToppings] = useState(TOPPINGS);
    const [orders, setOrders] = useState<Order[]>([]);
    const [liveOrders, setLiveOrders] = useState<Order[]>([]);
    const [userRole, setUserRole] = useState<'junior' | 'senior'>('senior');

    // Multi-Tab Order State
    const [ordersTabs, setOrdersTabs] = useState<{ id: string; name: string; items: CartItem[] }[]>([
        { id: Math.random().toString(36).substr(2, 9), name: "Table 1 / Order 1", items: [] }
    ]);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [heldOrders, setHeldOrders] = useState<{ id: string; items: CartItem[]; reason: string; heldAt: Date }[]>([]);

    // Dynamic Cart derived from active tab
    const cart = useMemo(() => ordersTabs[activeTabIndex]?.items || [], [ordersTabs, activeTabIndex]);
    const setCart = (newItems: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
        setOrdersTabs(prev => {
            const next = [...prev];
            if (!next[activeTabIndex]) return prev;
            if (typeof newItems === 'function') {
                next[activeTabIndex].items = newItems(next[activeTabIndex].items);
            } else {
                next[activeTabIndex].items = newItems;
            }
            return next;
        });
    };

    const [previousCart, setPreviousCart] = useState<CartItem[] | null>(null);
    const [recentlyOrdered, setRecentlyOrdered] = useState<string[]>([]);
    const [customizingItems, setCustomizingItems] = useState<{ product: Product; customization?: PizzaCustomization; tempId: string }[]>([]);
    const [activeCustomizationIndex, setActiveCustomizationIndex] = useState(0);

    const [isRushMode, setRushMode] = useState(false);
    const [kitchenLoad] = useState<'normal' | 'busy' | 'extreme'>('busy');
    const [stationLoads] = useState({ pizza: 85, oven: 40, fryer: 15 });
    const [activeOrdersCount] = useState(12);
    const [showReadinessView, setShowReadinessView] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("top-sellers");

    const calculateItemPrice = (productPrice: number, customization?: PizzaCustomization) => {
        if (!customization) return productPrice;
        const size = PIZZA_OPTIONS.sizes.find(s => s.id === customization.sizeId);
        const crust = PIZZA_OPTIONS.crusts.find(c => c.id === customization.crustId);
        const sauce = PIZZA_OPTIONS.sauces.find(s => s.id === customization.sauce.id);
        const cheese = PIZZA_OPTIONS.cheeses.find(c => c.id === customization.cheese.id);

        let price = productPrice;
        if (size) price *= size.priceMultiplier;
        if (crust) price += crust.extraPrice;
        if (sauce) {
            price += sauce.extraPrice;
            if (customization.sauce.quantity > 1) price += 0.50;
        }
        if (cheese) {
            price += cheese.extraPrice;
            if (customization.cheese.quantity > 1) price += 1.50;
        }

        customization.toppings.forEach(st => {
            const topping = toppings.find(t => t.id === st.toppingId);
            if (topping && st.quantity > 0) {
                let factor = st.side === 'Full' ? 1 : (st.side === 'Quarter' ? 0.25 : 0.5);
                if (st.isBaseIngredient && st.quantity <= 1) return;
                price += topping.price * (st.isBaseIngredient ? st.quantity - 1 : st.quantity) * factor;
            }
        });
        return Number(price.toFixed(2));
    };

    const startCustomizing = (product: Product) => {
        const tempId = Math.random().toString(36).substr(2, 9);
        setCustomizingItems(prev => {
            const next = [...prev, { product, tempId }];
            setActiveCustomizationIndex(next.length - 1);
            return next;
        });
    };

    const startEditing = (item: CartItem) => {
        const product = products.find(p => p.id === item.productId)!;
        setCustomizingItems(prev => {
            const next = [...prev, { product, customization: item.customization, tempId: item.cartId }];
            setActiveCustomizationIndex(next.length - 1);
            return next;
        });
    };

    const cancelCustomizing = (tempId: string) => {
        setCustomizingItems(prev => {
            const next = prev.filter(i => i.tempId !== tempId);
            setActiveCustomizationIndex(curr => Math.min(curr, Math.max(0, next.length - 1)));
            return next;
        });
    };

    const addToCart = (product: Product, customization?: PizzaCustomization) => {
        setPreviousCart([...cart]);
        const finalCustomization = (product.isCustomizable && !customization) ? {
            ...DEFAULT_PIZZA_CUSTOMIZATION,
            toppings: (product.baseIngredients || []).map(id => ({ toppingId: id, side: 'Full', quantity: 1, isBaseIngredient: true }))
        } : customization;

        const cartId = Math.random().toString(36).substr(2, 9);
        const newItem: CartItem = {
            cartId,
            productId: product.id,
            name: product.name,
            price: calculateItemPrice(product.price, finalCustomization as PizzaCustomization),
            basePrice: product.price,
            quantity: 1,
            customization: finalCustomization as PizzaCustomization,
            category: product.category,
            image: product.image,
        };
        setCart(prev => [...prev, newItem]);
        setRecentlyOrdered(prev => [product.id, ...prev.filter(id => id !== product.id)].slice(0, 10));
        setCustomizingItems(prev => prev.filter(i => i.product.id !== product.id || i.customization !== customization));
    };

    const applyTemplate = (templateId: string) => {
        const template = ORDER_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;
        setPreviousCart([...cart]);
        const newItems = template.items.map(ti => {
            const product = products.find(p => p.id === ti.productId)!;
            const cust = ti.customization || (product.isCustomizable ? {
                ...DEFAULT_PIZZA_CUSTOMIZATION,
                toppings: (product.baseIngredients || []).map(id => ({ toppingId: id, side: 'Full', quantity: 1, isBaseIngredient: true }))
            } : undefined);
            return {
                cartId: Math.random().toString(36).substr(2, 9),
                productId: product.id,
                name: product.name,
                price: calculateItemPrice(product.price, cust),
                basePrice: product.price,
                quantity: 1,
                customization: cust,
                category: product.category,
                image: product.image
            };
        });
        setCart(prev => [...prev, ...newItems]);
    };

    const updateCartItem = (cartId: string, customization: PizzaCustomization) => {
        setPreviousCart([...cart]);
        setCart(prev => prev.map(item => {
            if (item.cartId === cartId) {
                return { ...item, customization, price: calculateItemPrice(item.basePrice, customization) };
            }
            return item;
        }));
        setCustomizingItems(prev => prev.filter(i => i.tempId !== cartId));
    };

    const removeFromCart = (cartId: string) => {
        setPreviousCart([...cart]);
        setCart(prev => prev.filter(i => i.cartId !== cartId));
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        setPreviousCart([...cart]);
        if (quantity <= 0) { removeFromCart(cartId); return; }
        setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity } : i));
    };

    const duplicateItem = (cartId: string) => {
        setPreviousCart([...cart]);
        const item = cart.find(i => i.cartId === cartId);
        if (item) {
            setCart(prev => [...prev, { ...item, cartId: Math.random().toString(36).substr(2, 9), quantity: 1 }]);
        }
    };

    const undoLastAction = () => { if (previousCart) { setCart(previousCart); setPreviousCart(null); } };
    const clearCart = () => { setPreviousCart([...cart]); setCart([]); };

    const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
    const tax = useMemo(() => subtotal * 0.05, [subtotal]);
    const total = useMemo(() => subtotal + tax, [subtotal, tax]);

    const confidenceFlags: ConfidenceFlag[] = useMemo(() => {
        const flags: ConfidenceFlag[] = [];
        cart.forEach(item => {
            if (item.price > item.basePrice * 3) {
                flags.push({ type: 'warning', message: `High Price Gap on ${item.name} (+$${(item.price - item.basePrice).toFixed(2)})` });
            }
            if (item.customization?.toppings.filter(t => t.quantity === 0).length ?? 0 > 3) {
                flags.push({ type: 'info', message: `${item.name} has multiple removals - double check with customer.` });
            }
        });
        return flags;
    }, [cart]);

    const addNewTab = () => {
        const id = Math.random().toString(36).substr(2, 9);
        setOrdersTabs(prev => [...prev, { id, name: `Order ${prev.length + 1}`, items: [] }]);
        setActiveTabIndex(ordersTabs.length);
    };

    const closeTab = (index: number) => {
        if (ordersTabs.length === 1) {
            setCart([]);
            return;
        }
        setOrdersTabs(prev => prev.filter((_, i) => i !== index));
        setActiveTabIndex(prev => Math.max(0, prev - 1));
    };

    const holdOrder = (reason: string) => {
        if (cart.length === 0) return;
        setHeldOrders(prev => [...prev, {
            id: ordersTabs[activeTabIndex].id,
            items: [...cart],
            reason,
            heldAt: new Date()
        }]);
        setCart([]);
    };

    const resumeOrder = (id: string) => {
        const held = heldOrders.find(h => h.id === id);
        if (!held) return;
        if (cart.length === 0) {
            setCart(held.items);
        } else {
            const tabId = Math.random().toString(36).substr(2, 9);
            setOrdersTabs(prev => [...prev, { id: tabId, name: `Resumed: ${held.reason}`, items: held.items }]);
            setActiveTabIndex(ordersTabs.length);
        }
        setHeldOrders(prev => prev.filter(h => h.id !== id));
    };

    const updateStock = (id: string, amount: number) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: amount, stockStatus: amount === 0 ? 'out' : amount < 10 ? 'low' : 'available' } : p));
    };

    const updateToppingStatus = (id: string, status: 'available' | 'low' | 'out') => {
        setToppings(prev => prev.map(t => t.id === id ? { ...t, stockStatus: status } : t));
    };

    const processTransaction = (paymentMethod: 'cash' | 'card' | 'mobile') => {
        if (cart.length === 0) return;
        const token = `T-${100 + orders.length + liveOrders.length}`;
        const newOrder: Order = {
            orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
            tokenNumber: token,
            orderType: Math.random() > 0.5 ? 'Dine-in' : 'Takeaway',
            items: cart.map(item => ({ ...item, status: 'Queued' })),
            subtotal,
            tax,
            total,
            timestamp: new Date().toISOString(),
            paymentMethod,
            estimatedRemainingMinutes: 12,
            stationProgress: {
                dough: 'in-progress',
                toppings: 'pending',
                oven: 'pending',
                packing: 'pending'
            }
        };
        setLiveOrders(prev => [newOrder, ...prev]);
        setCart([]);
    };

    // Simulate Kitchen Movement
    useMemo(() => {
        const interval = setInterval(() => {
            setLiveOrders(prev => prev.map(order => {
                const updatedOrder = { ...order };
                const rand = Math.random();

                // Progress Station
                if (updatedOrder.stationProgress.dough === 'in-progress' && rand > 0.7) {
                    updatedOrder.stationProgress.dough = 'completed';
                    updatedOrder.stationProgress.toppings = 'in-progress';
                    updatedOrder.items.forEach(i => i.status = 'Preparing');
                } else if (updatedOrder.stationProgress.toppings === 'in-progress' && rand > 0.7) {
                    updatedOrder.stationProgress.toppings = 'completed';
                    updatedOrder.stationProgress.oven = 'in-progress';
                    updatedOrder.items.forEach(i => i.status = 'Baking');
                } else if (updatedOrder.stationProgress.oven === 'in-progress' && rand > 0.7) {
                    updatedOrder.stationProgress.oven = 'completed';
                    updatedOrder.stationProgress.packing = 'in-progress';
                    updatedOrder.items.forEach(i => i.status = 'Packing');
                } else if (updatedOrder.stationProgress.packing === 'in-progress' && rand > 0.8) {
                    updatedOrder.stationProgress.packing = 'completed';
                    updatedOrder.items.forEach(i => i.status = 'Ready');
                }

                // Decay time
                if (updatedOrder.estimatedRemainingMinutes > 0) {
                    updatedOrder.estimatedRemainingMinutes -= 0.1;
                }

                return updatedOrder;
            }));

            // Move completed orders to permanent history
            setLiveOrders(prev => {
                const completed = prev.filter(o => o.items.every(i => i.status === 'Ready') && Math.random() > 0.95);
                if (completed.length > 0) {
                    setOrders(old => [...completed, ...old]);
                    return prev.filter(o => !completed.includes(o));
                }
                return prev;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <POSContext.Provider value={{
            products, cart, orders, customizingItems, activeCustomizationIndex, setActiveCustomizationIndex,
            startCustomizing, startEditing, cancelCustomizing, addToCart, applyTemplate, updateCartItem,
            removeFromCart, updateQuantity, duplicateItem, undoLastAction, clearCart, processTransaction,
            ordersTabs, activeTabIndex, setActiveTabIndex, addNewTab, closeTab,
            heldOrders, holdOrder, resumeOrder,
            userRole, setUserRole, recentlyOrdered,
            isRushMode, setRushMode, kitchenLoad, stationLoads, activeOrdersCount,
            showReadinessView, setShowReadinessView,
            confidenceFlags, searchQuery, setSearchQuery, liveOrders,
            selectedCategory, setSelectedCategory, updateStock,
            toppings, updateToppingStatus,
            subtotal, tax, total
        }}>
            {children}
        </POSContext.Provider>
    );
};

export const usePOS = () => {
    const context = useContext(POSContext);
    if (!context) throw new Error('usePOS must be used within a POSProvider');
    return context;
};
