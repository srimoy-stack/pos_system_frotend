import { LayoutDashboard, History, Package, User, ShieldCheck } from 'lucide-react';
import { usePOS } from '../context/POSContext';
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
            "flex flex-col items-center justify-center py-6 w-full transition-all relative group",
            active
                ? "text-blue-500"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
        )}
    >
        <Icon className={cn("h-7 w-7 mb-1 transition-transform group-active:scale-90", active ? "stroke-[2.5]" : "stroke-[2]")} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        {active && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500 rounded-l-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        )}
    </button>
);

interface LayoutProps {
    children: React.ReactNode;
    currentView: 'pos' | 'history' | 'inventory';
    onViewChange: (view: 'pos' | 'history' | 'inventory') => void;
}

export const Layout = ({ children, currentView, onViewChange }: LayoutProps) => {
    const { setShowReadinessView } = usePOS();
    return (
        <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
            {/* Ultra-Thin Sidebar Navigation (Far Left) */}
            <nav className="w-20 lg:w-24 bg-slate-950 flex flex-col items-center shrink-0 z-30">
                <div className="py-8">
                    <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] rotate-3">
                        <LayoutDashboard className="h-7 w-7 stroke-[3]" />
                    </div>
                </div>

                <div className="flex-1 w-full space-y-0">
                    <NavItem
                        icon={LayoutDashboard}
                        label="POS"
                        active={currentView === 'pos'}
                        onClick={() => onViewChange('pos')}
                    />
                    <NavItem
                        icon={History}
                        label="History"
                        active={currentView === 'history'}
                        onClick={() => onViewChange('history')}
                    />
                    <NavItem
                        icon={Package}
                        label="Stock"
                        active={currentView === 'inventory'}
                        onClick={() => onViewChange('inventory')}
                    />

                    {/* Operational Readiness Trigger */}
                    <button
                        onClick={() => setShowReadinessView(true)}
                        className="flex flex-col items-center justify-center py-6 w-full text-amber-500 hover:bg-amber-500/10 transition-all group"
                    >
                        <ShieldCheck className="h-7 w-7 mb-1 stroke-[2.5]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-amber-500">Readiness</span>
                    </button>
                </div>

                <div className="mt-auto pb-8 flex flex-col items-center gap-6">
                    <button className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <User className="h-6 w-6" />
                    </button>
                    <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest vertical-text">
                        v2.4.0
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
