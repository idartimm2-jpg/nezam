import React from 'react';
import { useData } from '../context/DataContext';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  CreditCard 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { products, customers, invoices } = useData();

  // Calculations
  const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalProfit = invoices.reduce((sum, inv) => sum + inv.totalProfit, 0);
  const inventoryValue = products.reduce((sum, p) => sum + (p.buyPrice * p.quantity), 0);
  const totalProducts = products.length; // Actually distinct products. Total items logic: products.reduce((sum, p) => sum + p.quantity, 0)
  
  // Top Selling Items Logic
  const productSalesMap = new Map<string, number>();
  invoices.forEach(inv => {
    inv.items.forEach(item => {
      const current = productSalesMap.get(item.productId) || 0;
      productSalesMap.set(item.productId, current + item.quantity);
    });
  });
  
  const topProducts = [...productSalesMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, quantity]) => {
      const product = products.find(p => p.id === id);
      return {
        name: product?.name || 'منتج محذوف',
        quantity,
        price: product?.sellPrice || 0
      };
    });

  const recentSales = invoices.slice(0, 5);

  const statsCards = [
    { label: 'إجمالي المبيعات', value: `${totalSales.toLocaleString()} ج.م`, icon: <DollarSign className="text-white" />, bg: 'bg-green-500' },
    { label: 'إجمالي الأرباح', value: `${totalProfit.toLocaleString()} ج.م`, icon: <TrendingUp className="text-white" />, bg: 'bg-emerald-500' },
    { label: 'عدد الفواتير', value: invoices.length, icon: <FileTextIcon />, bg: 'bg-blue-500' },
    { label: 'عدد العملاء', value: customers.length, icon: <Users className="text-white" />, bg: 'bg-purple-500' },
    { label: 'عدد الأصناف', value: totalProducts, icon: <Package className="text-white" />, bg: 'bg-orange-500' },
    { label: 'قيمة المخزون', value: `${inventoryValue.toLocaleString()} ج.م`, icon: <CreditCard className="text-white" />, bg: 'bg-indigo-500' },
  ];

  function FileTextIcon() {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
      )
  }

  return (
    <div className="space-y-6">
      <header className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg">
        <h1 className="text-2xl font-bold">لوحة التحكم 📊</h1>
        <p className="text-indigo-100 opacity-90">نظرة عامة على أداء متجرك اليوم.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-md ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">🏆 أكثر الأصناف مبيعاً</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{item.quantity} مباع</div>
                  <div className="text-xs text-gray-500">{item.price} ج.م / وحدة</div>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-8">لا توجد مبيعات بعد</div>
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">⏰ آخر المبيعات</h3>
          <div className="space-y-4">
             {recentSales.length > 0 ? recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div>
                  <div className="font-medium text-gray-700">{sale.customerName}</div>
                  <div className="text-xs text-gray-500">{new Date(sale.date).toLocaleTimeString('ar-EG')}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+{sale.total.toLocaleString()} ج.م</div>
                  <div className="text-xs text-gray-500">{sale.items.length} أصناف</div>
                </div>
              </div>
            )) : (
                <div className="text-center text-gray-400 py-8">لا توجد مبيعات بعد</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
