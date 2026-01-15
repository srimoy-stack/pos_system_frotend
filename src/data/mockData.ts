export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    stock: number;
}

export const CATEGORIES = [
    { id: "all", name: "All Items" },
    { id: "food", name: "Food" },
    { id: "beverages", name: "Beverages" },
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
];

export const PRODUCTS: Product[] = [
    // Food
    {
        id: "f1",
        name: "Classic Burger",
        category: "food",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
        description: "Juicy beef patty with fresh lettuce, tomato, and cheese.",
        stock: 50,
    },
    {
        id: "f2",
        name: "Margherita Pizza",
        category: "food",
        price: 12.50,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60",
        description: "Traditional Italian pizza with basil and mozzarella.",
        stock: 30,
    },
    {
        id: "f3",
        name: "Caesar Salad",
        category: "food",
        price: 7.95,
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60",
        description: "Crisp romaine lettuce with parmesan and croutons.",
        stock: 25,
    },
    {
        id: "f4",
        name: "Spicy Tacos (3pcs)",
        category: "food",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=60",
        description: "Authentic Mexican tacos with spicy salsa.",
        stock: 40,
    },
    {
        id: "f5",
        name: "Sushi Platter",
        category: "food",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60",
        description: "Assorted fresh sushi rolls.",
        stock: 15,
    },

    // Beverages
    {
        id: "b1",
        name: "Iced Coffee",
        category: "beverages",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1517701604599-bb29b5c5090c?w=500&auto=format&fit=crop&q=60",
        description: "Cold brewed coffee with milk and ice.",
        stock: 100,
    },
    {
        id: "b2",
        name: "Berry Smoothie",
        category: "beverages",
        price: 5.95,
        image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500&auto=format&fit=crop&q=60",
        description: "Fresh mixed berries blended with yogurt.",
        stock: 45,
    },
    {
        id: "b3",
        name: "Green Tea",
        category: "beverages",
        price: 3.00,
        image: "https://images.unsplash.com/photo-1627435601361-ec25481c3db6?w=500&auto=format&fit=crop&q=60",
        description: "Hot organic green tea.",
        stock: 80,
    },
    {
        id: "b4",
        name: "Cola",
        category: "beverages",
        price: 2.50,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60",
        description: "Refreshing carbonated soft drink.",
        stock: 120,
    },
    {
        id: "b5",
        name: "Fresh Orange Juice",
        category: "beverages",
        price: 4.75,
        image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60",
        description: "Freshly squeezed oranges.",
        stock: 60,
    },

    // Electronics
    {
        id: "e1",
        name: "Wireless Headphones",
        category: "electronics",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        description: "High-quality noise cancelling headphones.",
        stock: 12,
    },
    {
        id: "e2",
        name: "USB-C Cable",
        category: "electronics",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1585800473941-ad6b92df7869?w=500&auto=format&fit=crop&q=60",
        description: "Durable braided fast charging cable.",
        stock: 200,
    },
    {
        id: "e3",
        name: "Power Bank",
        category: "electronics",
        price: 29.95,
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=60",
        description: "10000mAh portable charger.",
        stock: 35,
    },
    {
        id: "e4",
        name: "Bluetooth Speaker",
        category: "electronics",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60",
        description: "Waterproof portable speaker.",
        stock: 18,
    },
    {
        id: "e5",
        name: "Phone Case",
        category: "electronics",
        price: 15.00,
        image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500&auto=format&fit=crop&q=60",
        description: "Protective silicone case.",
        stock: 50,
    },

    // Clothing
    {
        id: "c1",
        name: "Cotton T-Shirt",
        category: "clothing",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60",
        description: "Basic white cotton t-shirt.",
        stock: 150,
    },
    {
        id: "c2",
        name: "Denim Jeans",
        category: "clothing",
        price: 49.50,
        image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&auto=format&fit=crop&q=60",
        description: "Classic blue denim jeans.",
        stock: 40,
    },
    {
        id: "c3",
        name: "Sneakers",
        category: "clothing",
        price: 65.00,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
        description: "Comfortable casual sneakers.",
        stock: 25,
    },
    {
        id: "c4",
        name: "Baseball Cap",
        category: "clothing",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60",
        description: "Adjustable cotton cap.",
        stock: 60,
    },
    {
        id: "c5",
        name: "Hoodie",
        category: "clothing",
        price: 35.00,
        image: "https://images.unsplash.com/photo-1556906781-9a412961d28c?w=500&auto=format&fit=crop&q=60",
        description: "Warm fleece hoodie.",
        stock: 30,
    },
];
