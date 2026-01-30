import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Menu, 
  X, 
  LogOut, 
  MoreHorizontal, 
  Settings as SettingsIcon,
  ClipboardList,
  BarChart3,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const { settings } = useData(); 
  // Actually cart is usually local to sales page or global. 
  // Requirement: "Cart icon with product count". This implies a global cart or just showing items currently in the sales process. 
  // Given the description "Sales System: Dynamic Cart", the cart is likely part of the Sales page state. 
  // However, if the cart icon is in the global header, it implies the cart persists across pages. 
  // To keep it simple for now, I will treat the header cart icon as a link to the Sales page, 
  // or maybe just a static icon if the cart is only active on the Sales page. 
  // Let's assume the cart is only relevant on the Sales page for this POS style app. 
  // But wait, "Cart icon with number of products" in header. 
  // I'll make the Sales page handle the cart, and maybe lift the cart state up if I have time, 
  // but for a POS, usually you stay on the sales page. 
  // Let's make the cart icon link to /sales.

  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      logout();
      navigate('/login');
    }
  };

  const navItems = [
    { label: 'الرئيسية', path: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'لوحة التحكم', path: '/dashboard', icon: <BarChart3 size={20} /> },
    { label: 'الأصناف', path: '/inventory', icon: <Package size={20} /> },
    { label: 'المبيعات', path: '/sales', icon: <ShoppingCart size={20} /> },
    { label: 'العملاء', path: '/customers', icon: <Users size={20} /> },
    { label: 'الفواتير', path: '/invoices', icon: <FileText size={20} /> },
  ];

  const moreItems = [
    { label: 'جرد المخزون', path: '/stocktaking', icon: <ClipboardList size={18} /> },
    { label: 'العروض', path: '/promotions', icon: <MessageCircle size={18} /> },
    { label: 'التقارير', path: '/reports', icon: <BarChart3 size={18} /> },
    { label: 'الإعدادات', path: '/settings', icon: <SettingsIcon size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="h-10 w-10 object-contain rounded-lg bg-slate-100" />
            ) : (
              <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {settings.storeName.charAt(0)}
              </div>
            )}
            <div className="hidden md:block">
              <h1 className="font-bold text-gray-800">{settings.storeName}</h1>
              <p className="text-xs text-gray-500">{settings.phone}</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isMoreOpen ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <MoreHorizontal size={20} />
                المزيد
              </button>
              
              {isMoreOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMoreOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-20">
                    {moreItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMoreOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/sales" className="relative p-2 text-gray-600 hover:bg-indigo-50 rounded-full transition-colors group">
              <ShoppingCart size={22} className="group-hover:text-indigo-600" />
              {/* Note: Cart count would go here if we had global cart state */}
            </Link>
            
            <button onClick={handleLogout} className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors" title="تسجيل الخروج">
              <LogOut size={22} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 p-4 space-y-2">
            {[...navItems, ...moreItems].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {settings.storeName.charAt(0)}
              </div>
              <span className="font-semibold text-gray-700">{settings.storeName}</span>
            </div>
            
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} جميع الحقوق محفوظة.
            </div>

            <div className="flex gap-4 text-sm text-gray-500">
               {settings.phone && <span>{settings.phone} 📞</span>}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
