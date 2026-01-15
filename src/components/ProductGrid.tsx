import { usePOS } from '../context/POSContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Search, Plus } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductGrid = () => {
    const {
        products,
        addToCart,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory
    } = usePOS();

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex-1 h-full flex flex-col bg-muted/30 p-4 md:p-6 overflow-hidden">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Menú</h1>
                    <p className="text-muted-foreground text-sm">Select items to add to order</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 h-10 rounded-full border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                            selectedCategory === category.id
                                ? "bg-primary text-white shadow-md shadow-primary/25"
                                : "bg-white text-foreground hover:bg-muted border border-border"
                        )}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                    <AnimatePresence>
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card
                                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-all group border-0 shadow-sm"
                                    onClick={() => addToCart(product)}
                                >
                                    <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        <Button
                                            size="icon"
                                            className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-base truncate">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10 text-xs">
                                            {product.description}
                                        </p>
                                        <div className="mt-2 text-primary font-bold">
                                            ${product.price.toFixed(2)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                {filteredProducts.length === 0 && (
                    <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="h-12 w-12 mb-4 opacity-20" />
                        <p>No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
};
