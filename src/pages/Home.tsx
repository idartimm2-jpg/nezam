import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { Package, Users, FileText, TrendingUp, ArrowLeft } from 'lucide-react';

export const Home: React.FC = () => {
  const { products, customers, invoices, settings } = useData();

  const totalSales = invoices.reduce((acc, curr) => acc + curr.total, 0);

  const stats = [
    { label: 'عدد الأصناف', value: products.length, icon: <Package className="text-blue-500" />, color: 'bg-blue-50' },
    { label: 'العملاء', value: customers.length, icon: <Users className="text-pink-500" />, color: 'bg-pink-50' },
    { label: 'الفواتير', value: invoices.length, icon: <FileText className="text-orange-500" />, color: 'bg-orange-50' },
    { label: 'المبيعات', value: `${totalSales.toLocaleString()} ج.م`, icon: <TrendingUp className="text-green-500" />, color: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <h1 className="text-4xl font-bold">مرحباً بك في {settings.storeName} 👋</h1>
            <p className="text-indigo-100 text-lg">
              نظام متكامل لإدارة مبيعاتك ومخزونك بكل سهولة واحترافية. تابع أرباحك ونمو عملك لحظة بلحظة.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/sales" className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                بدء بيع جديد
              </Link>
              <Link to="/dashboard" className="bg-indigo-500/30 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500/40 transition-colors">
                لوحة التحكم
              </Link>
            </div>
          </div>
          
          {/* Quick Stats Grid inside Hero */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                <div className="text-indigo-100 text-sm mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/inventory" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">إدارة المخزون</h3>
          <p className="text-gray-500 text-sm">أضف منتجاتك، تتبع الكميات، واحصل على تنبيهات عند انخفاض المخزون.</p>
          <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
            الذهاب للمخزون <ArrowLeft size={16} className="mr-2" />
          </div>
        </Link>

        <Link to="/customers" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="h-12 w-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="text-pink-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">قاعدة العملاء</h3>
          <p className="text-gray-500 text-sm">سجل بيانات عملائك، تتبع مشترياتهم، ونظام نقاط الولاء.</p>
          <div className="mt-4 flex items-center text-pink-600 text-sm font-medium">
            الذهاب للعملاء <ArrowLeft size={16} className="mr-2" />
          </div>
        </Link>

        <Link to="/reports" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="text-indigo-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">التقارير والإحصائيات</h3>
          <p className="text-gray-500 text-sm">تحليلات دقيقة لمبيعاتك وأرباحك تساعدك على اتخاذ القرارات الصحيحة.</p>
          <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium">
            عرض التقارير <ArrowLeft size={16} className="mr-2" />
          </div>
        </Link>
      </div>

      <div className="text-center text-gray-400 text-sm pt-8">
        نظام إدارة المبيعات - الإصدار 1.0.0
      </div>
    </div>
  );
};
