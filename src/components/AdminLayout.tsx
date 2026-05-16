import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Scissors, DollarSign, LogOut, Menu, X, Scissors as ScissorsIcon } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Agendamentos', path: '/admin/agendamentos' },
    { icon: Users, label: 'Clientes', path: '/admin/clientes' },
    { icon: Scissors, label: 'Barbeiros', path: '/admin/barbeiros' },
    { icon: DollarSign, label: 'Financeiro', path: '/admin/financeiro' },
  ];

  return (
    <div class="min-h-screen bg-matte-black text-white flex">
      {/* Sidebar Desktop */}
      <aside class="hidden lg:flex flex-col w-64 bg-surface-dark border-r border-border-dim flex flex-col">
        <div class="p-8">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-premium-gold to-[#8E6E17] rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/20">
              <span class="text-black font-black text-xl">H</span>
            </div>
            <div>
              <h1 class="text-sm font-bold tracking-widest uppercase">Hudson</h1>
              <p class="text-[10px] text-gold-accent tracking-tighter font-medium uppercase leading-none">Premium Barber</p>
            </div>
          </div>
        </div>
        
        <nav class="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold text-sm ${
                location.pathname === item.path 
                ? 'bg-surface-light text-gold-accent border border-border-accent' 
                : 'text-neutral-400 hover:bg-surface-light transition-colors'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div class="p-6">
          <div class="bg-surface-light border border-border-accent rounded-2xl p-4">
            <p class="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 leading-none">Status Mensal</p>
            <p class="text-lg font-bold">R$ 14.820</p>
            <div class="w-full bg-[#333] h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="bg-gold-accent w-3/4 h-full"></div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-xl text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-widest mt-6 w-full"
          >
            <LogOut size={16} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <ScissorsIcon className="text-premium-gold" size={20} />
          <span className="font-black uppercase text-sm tracking-tighter">Hudson</span>
        </div>
        <button onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm p-6 flex flex-col animate-in fade-in">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <ScissorsIcon className="text-premium-gold" size={24} />
              <span className="text-xl font-black uppercase tracking-tighter">Hudson Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all uppercase text-xs font-black tracking-widest ${
                  location.pathname === item.path ? 'bg-premium-gold text-matte-black' : 'text-gray-500'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 border border-red-500/20 uppercase text-xs font-black tracking-widest mt-auto"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 pt-24 lg:pt-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
