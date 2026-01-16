export interface Topping {
    id: string;
    name: string;
    price: number;
    category: 'veg' | 'non-veg' | 'cheese' | 'sauce';
    isBaseIngredient?: boolean;
    tier?: 1 | 2 | 3;
    stockStatus: 'available' | 'low' | 'out';
}

export interface PizzaOptions {
    sizes: { id: string; name: string; priceMultiplier: number; supportedToppingTiers?: number[] }[];
    crusts: { id: string; name: string; extraPrice: number }[];
    sauces: { id: string; name: string; extraPrice: number; allowDrizzle?: boolean }[];
    cheeses: { id: string; name: string; extraPrice: number }[];
    cookingPreferences: {
        bakeLevels: string[];
        cutStyles: string[];
        sliceCounts: number[];
    };
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    stock: number;
    stockStatus: 'available' | 'low' | 'out';
    prepTimeMin: number;
    isCustomizable?: boolean;
    baseIngredients?: string[];
}

export interface OrderTemplate {
    id: string;
    name: string;
    items: { productId: string; customization?: any }[];
    description: string;
    price: number;
}

export const CATEGORIES = [
    { id: "top-sellers", name: "Top Sellers", icon: "Star" },
    { id: "veg-pizza", name: "Veg Pizza", icon: "Leaf" },
    { id: "non-veg-pizza", name: "Non-Veg Pizza", icon: "Flame" },
    { id: "sides", name: "Sides", icon: "Beef" },
    { id: "beverages", name: "Beverages", icon: "CupSoda" },
    { id: "desserts", name: "Desserts", icon: "IceCream" },
    { id: "bundles", name: "Family Bundles", icon: "Users" },
];

export const PIZZA_OPTIONS: PizzaOptions = {
    sizes: [
        { id: "regular", name: "Regular", priceMultiplier: 1, supportedToppingTiers: [1, 2] },
        { id: "medium", name: "Medium", priceMultiplier: 1.6, supportedToppingTiers: [1, 2, 3] },
        { id: "large", name: "Large", priceMultiplier: 2.2, supportedToppingTiers: [1, 2, 3] },
    ],
    crusts: [
        { id: "hand-tossed", name: "New Hand Tossed", extraPrice: 0 },
        { id: "wheat-thin", name: "Wheat Thin Crust", extraPrice: 1.50 },
        { id: "cheese-burst", name: "Cheese Burst", extraPrice: 2.50 },
        { id: "fresh-pan", name: "Fresh Pan Pizza", extraPrice: 1.00 },
    ],
    sauces: [
        { id: "classic", name: "Classic Tomato", extraPrice: 0, allowDrizzle: false },
        { id: "spicy", name: "Spicy Marinara", extraPrice: 0, allowDrizzle: false },
        { id: "bbq", name: "Smoky BBQ", extraPrice: 0, allowDrizzle: true },
        { id: "white", name: "Creamy Alfredo", extraPrice: 0.50, allowDrizzle: true },
    ],
    cheeses: [
        { id: "mozzarella", name: "Mozzarella", extraPrice: 0 },
        { id: "cheddar", name: "Cheddar", extraPrice: 1.50 },
        { id: "blend", name: "5-Cheese Blend", extraPrice: 2.50 },
    ],
    cookingPreferences: {
        bakeLevels: ["Light", "Normal", "Well Done"],
        cutStyles: ["Triangle", "Square", "Uncut"],
        sliceCounts: [4, 6, 8, 12]
    }
};

export const TOPPINGS: Topping[] = [
    { id: "t1", name: "Onion", price: 0.99, category: "veg", tier: 1, stockStatus: 'available' },
    { id: "t2", name: "Capsicum", price: 0.99, category: "veg", tier: 1, stockStatus: 'available' },
    { id: "t3", name: "Tomato", price: 0.99, category: "veg", tier: 1, stockStatus: 'available' },
    { id: "t4", name: "Mushroom", price: 1.29, category: "veg", tier: 2, stockStatus: 'low' },
    { id: "t5", name: "Black Olives", price: 1.29, category: "veg", tier: 2, stockStatus: 'available' },
    { id: "t6", name: "Jalapenos", price: 1.29, category: "veg", tier: 2, stockStatus: 'available' },
    { id: "t7", name: "Sweet Corn", price: 0.99, category: "veg", tier: 1, stockStatus: 'out' },
    { id: "t8", name: "Paneer", price: 1.99, category: "veg", tier: 3, stockStatus: 'available' },
    { id: "t9", name: "Red Paprika", price: 1.29, category: "veg", tier: 2, stockStatus: 'available' },
    { id: "t10", name: "Pepper Barbecue Chicken", price: 2.49, category: "non-veg", tier: 3, stockStatus: 'available' },
    { id: "t11", name: "Peri-Peri Chicken", price: 2.49, category: "non-veg", tier: 3, stockStatus: 'available' },
    { id: "t12", name: "Grilled Chicken Rasher", price: 2.49, category: "non-veg", tier: 3, stockStatus: 'available' },
    { id: "t13", name: "Chicken Sausage", price: 1.99, category: "non-veg", tier: 2, stockStatus: 'low' },
    { id: "t14", name: "Chicken Tikka", price: 2.49, category: "non-veg", tier: 3, stockStatus: 'available' },
    { id: "t15", name: "Chicken Keema", price: 2.49, category: "non-veg", tier: 3, stockStatus: 'available' },
];

export const ORDER_TEMPLATES: OrderTemplate[] = [
    {
        id: "family-feast",
        name: "Typically Family Order",
        description: "2 Medium Pizzas + 2 Sides + 1.25L Pepsi",
        price: 34.99,
        items: [
            { productId: "v1", customization: { sizeId: "medium", toppings: [{ toppingId: "t1", side: "Full", quantity: 1 }] } },
            { productId: "v2", customization: { sizeId: "medium" } },
            { productId: "s1" },
            { productId: "s1" },
            { productId: "d1" }
        ]
    },
    {
        id: "duo-deal",
        name: "Duo Rapid Pack",
        description: "2 Regular Pizzas + Garlic Bread",
        price: 19.99,
        items: [
            { productId: "v1", customization: { sizeId: "regular" } },
            { productId: "v2", customization: { sizeId: "regular" } },
            { productId: "s1" }
        ]
    }
];

export const PRODUCTS: Product[] = [
    {
        id: "v1",
        name: "Margherita",
        category: "veg-pizza",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?w=500&auto=format&fit=crop&q=60",
        description: "Classic delight",
        stock: 999,
        stockStatus: 'available',
        prepTimeMin: 12,
        isCustomizable: true,
        baseIngredients: ["t1", "t2"]
    },
    {
        id: "v2",
        name: "Farmhouse",
        category: "veg-pizza",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&auto=format&fit=crop&q=60",
        description: "Combination of onion, capsicum, tomato & mushroom",
        stock: 999,
        stockStatus: 'available',
        prepTimeMin: 15,
        isCustomizable: true,
        baseIngredients: ["t1", "t2", "t3", "t4"]
    },
    {
        id: "nv1",
        name: "Chicken Supreme",
        category: "non-veg-pizza",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60",
        description: "Loaded with chicken",
        stock: 999,
        stockStatus: 'available',
        prepTimeMin: 18,
        isCustomizable: true
    },
    {
        id: "s1",
        name: "Garlic Breadsticks",
        category: "sides",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&auto=format&fit=crop&q=60",
        description: "Freshly baked",
        stock: 999,
        stockStatus: 'available',
        prepTimeMin: 8
    },
    {
        id: "d1",
        name: "Pepsi 500ml",
        category: "beverages",
        price: 1.99,
        image: "https://images.unsplash.com/photo-1629203851022-39c6f21c0192?w=500&auto=format&fit=crop&q=60",
        description: "Sparkling cola",
        stock: 999,
        stockStatus: 'available',
        prepTimeMin: 1
    }
];

export const PRESETS = [
    { id: "extra-cheese", name: "Cheese Lover", action: { cheeseQty: 2 } },
    { id: "no-onion", name: "No Onion", action: { removeToppings: ["t1"] } },
    { id: "spicy-special", name: "Spicy Special", action: { sauceId: "spicy", addToppings: ["t6", "t9"] } },
];

export const SPECIAL_INSTRUCTIONS = [
    "No cut", "Well baked", "Double bag", "Extra napkins", "Contactless"
];

export const DEFAULT_PIZZA_CUSTOMIZATION = {
    sizeId: "medium",
    crustId: "hand-tossed",
    sauce: { id: "classic", side: "Full", quantity: 1, isDrizzle: false },
    cheese: { id: "mozzarella", side: "Full", quantity: 1 },
    toppings: [],
    cooking: { bake: "Normal", cut: "Triangle", slices: 6 },
    instructions: []
};
