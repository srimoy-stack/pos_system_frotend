import React from 'react';
import { usePOS } from '../context/POSContext';
import { LayoutDashboard, History, ShoppingBag, Package } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => (
    <button
        onClick={onClick}
        className={cn(
            "flex flex-col items-center justify-center p-4 w-full transition-colors",
            active
                ? "bg-primary/10 text-primary border-r-4 border-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
    >
        <Icon className="h-6 w-6 mb-1" />
        <span className="text-xs font-medium">{label}</span>
    </button>
);

interface LayoutProps {
    children: React.ReactNode;
    currentView: 'pos' | 'history' | 'inventory';
    onViewChange: (view: 'pos' | 'history' | 'inventory') => void;
}

export const Layout = ({ children, currentView, onViewChange }: LayoutProps) => {
    const { cart } = usePOS();
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* Sidebar Navigation */}
            <nav className="w-20 lg:w-24 border-r bg-card flex flex-col items-center py-4 z-20 shadow-sm">
                <div className="mb-8 p-2 bg-primary rounded-xl relative">
                    <ShoppingBag className="h-8 w-8 text-white" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-card">
                            {itemCount}
                        </span>
                    )}
                </div>

                <div className="flex-1 w-full space-y-2">
                    <NavItem
                        icon={LayoutDashboard}
                        label="POS"
                        active={currentView === 'pos'}
                        onClick={() => onViewChange('pos')}
                    />
                    <NavItem
                        icon={History}
                        label="Orders"
                        active={currentView === 'history'}
                        onClick={() => onViewChange('history')}
                    />
                    <NavItem
                        icon={Package}
                        label="Inventory"
                        active={currentView === 'inventory'}
                        onClick={() => onViewChange('inventory')}
                    />
                </div>

                <div className="mt-auto mb-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                        JD
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                {children}
            </main>
        </div>
    );
};
