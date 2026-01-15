import { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Package, AlertTriangle, CheckCircle2, Search, Save, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const InventoryDashboard = () => {
    const { products, updateStock } = usePOS();
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startEdit = (id: string, currentStock: number) => {
        setEditingId(id);
        setEditValue(currentStock);
    };

    const saveEdit = (id: string) => {
        updateStock(id, editValue);
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'text-destructive bg-destructive/10', icon: AlertTriangle };
        if (stock < 10) return { label: 'Low Stock', color: 'text-amber-500 bg-amber-500/10', icon: AlertTriangle };
        return { label: 'In Stock', color: 'text-green-600 bg-green-600/10', icon: CheckCircle2 };
    };

    return (
        <div className="flex-1 h-full bg-muted/30 p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="h-6 w-6 text-primary" />
                        Inventory Management
                    </h1>
                    <p className="text-muted-foreground text-sm">Monitor and update product stock levels</p>
                </div>

                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search inventory..."
                        className="w-full pl-10 h-10 rounded-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="flex-1 overflow-auto shadow-sm">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock Level</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {filteredProducts.map((product) => {
                            const status = getStockStatus(product.stock);
                            const StatusIcon = status.icon;
                            const isEditing = editingId === product.id;

                            return (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-10 w-10 rounded-md object-cover bg-muted"
                                            />
                                            <span className="font-medium">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle capitalize">{product.category}</td>
                                    <td className="p-4 align-middle">${product.price.toFixed(2)}</td>
                                    <td className="p-4 align-middle font-mono">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-20 rounded border border-input bg-background px-2 py-1 text-sm text-center"
                                                value={editValue}
                                                onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="font-bold">{product.stock}</span>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1", status.color)}>
                                            <StatusIcon className="h-3 w-3" />
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        {isEditing ? (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-8 w-8 p-0 text-muted-foreground">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" onClick={() => saveEdit(product.id)} className="h-8 w-8 p-0">
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => startEdit(product.id, product.stock)}
                                            >
                                                Adjust
                                            </Button>
                                        )}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
