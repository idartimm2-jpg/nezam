import React from 'react';
import { useData } from '../context/DataContext';
import { Download, Printer, BarChart3, TrendingUp, TrendingDown, DollarSign, Archive } from 'lucide-react';

export const Reports: React.FC = () => {
  const { invoices, products } = useData();

  // Calculations
  const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalCost = invoices.reduce((sum, inv) => {
    const invoiceCost = inv.items.reduce((isum, item) => isum + (item.buyPrice * item.quantity), 0);
    return sum + invoiceCost;
  }, 0);
  const netProfit = totalSales - totalCost;
  
  const inventoryValue = products.reduce((sum, p) => sum + (p.buyPrice * p.quantity), 0);
  const potentialProfit = products.reduce((sum, p) => sum + ((p.sellPrice - p.buyPrice) * p.quantity), 0);

  const handlePrint = () => {
    window.print();
  };

  const downloadCSV = () => {
    const headers = ['Invoice ID', 'Date', 'Customer', 'Total', 'Profit'];
    const rows = invoices.map(inv => [
      inv.id,
      new Date(inv.date).toLocaleDateString(),
      inv.customerName,
      inv.total,
      inv.totalProfit
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <header className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center print:hidden">
        <div>
           <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 /> التقارير والتحليلات
          </h1>
          <p className="text-indigo-100 opacity-90 mt-1">ملخص الأداء المالي والمخزني.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handlePrint}
                className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2"
            >
                <Printer size={18} /> طباعة
            </button>
             <button 
                onClick={downloadCSV}
                className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
                <Download size={18} /> تصدير CSV
            </button>
        </div>
      </header>

      {/* Financial Summary */}
      <section className="print:break-inside-avoid">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="text-indigo-600" /> الملخص المالي
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-green-500">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">إجمالي المبيعات</span>
                    <TrendingUp className="text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{totalSales.toLocaleString()} <span className="text-sm font-normal text-gray-500">ج.م</span></div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-red-500">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">تكلفة البضائع المباعة</span>
                    <TrendingDown className="text-red-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{totalCost.toLocaleString()} <span className="text-sm font-normal text-gray-500">ج.م</span></div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-b-4 border-b-indigo-500">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">صافي الربح</span>
                    <DollarSign className="text-indigo-500" />
                </div>
                <div className="text-3xl font-bold text-indigo-600">{netProfit.toLocaleString()} <span className="text-sm font-normal text-gray-500">ج.م</span></div>
                <div className="mt-2 text-xs text-green-600 font-medium">
                    هامش الربح: {totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0}%
                </div>
            </div>
        </div>
      </section>

      {/* Inventory Summary */}
      <section className="print:break-inside-avoid">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Archive className="text-blue-600" /> تحليل المخزون
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <Archive size={24} />
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm">القيمة الحالية للمخزون (بسعر الشراء)</div>
                        <div className="text-2xl font-bold text-gray-800">{inventoryValue.toLocaleString()} ج.م</div>
                    </div>
                </div>
            </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div className="text-gray-500 text-sm">الأرباح المتوقعة من المخزون الحالي</div>
                        <div className="text-2xl font-bold text-gray-800">{potentialProfit.toLocaleString()} ج.م</div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};
