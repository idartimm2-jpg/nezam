import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StockLog, Product } from '../types';
import { ClipboardList, AlertTriangle, History, Search, Save } from 'lucide-react';

export const Stocktaking: React.FC = () => {
  const { products, stockLogs, addStockLog } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustment, setAdjustment] = useState<number>(0);
  const [reason, setReason] = useState<StockLog['reason']>('other');
  const [viewHistory, setViewHistory] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.includes(searchTerm) || p.code.includes(searchTerm)
  );

  const handleAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || adjustment === 0) return;

    const log: StockLog = {
      id: crypto.randomUUID(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      reason,
      change: adjustment,
      date: new Date().toISOString()
    };

    addStockLog(log);
    setSelectedProduct(null);
    setAdjustment(0);
    alert('تم تحديث المخزون بنجاح');
  };

  return (
    <div className="space-y-6">
      <header className="bg-gradient-to-r from-red-500 to-rose-600 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList /> جرد المخزون
          </h1>
          <p className="text-red-100 opacity-90 mt-1">تسجيل التالف، والسرقات، وتعديلات الكميات.</p>
        </div>
        <button 
            onClick={() => setViewHistory(!viewHistory)}
            className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2"
        >
            <History size={18} /> {viewHistory ? 'إخفاء السجل' : 'سجل التعديلات'}
        </button>
      </header>

      {viewHistory ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <h3 className="p-4 font-bold text-gray-800 border-b">سجل الحركات المخزنية</h3>
             <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 text-gray-600 text-sm">
                  <tr>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">المنتج</th>
                    <th className="p-3">التغيير</th>
                    <th className="p-3">السبب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stockLogs.map(log => (
                    <tr key={log.id}>
                      <td className="p-3 text-sm text-gray-500">{new Date(log.date).toLocaleString('ar-EG')}</td>
                      <td className="p-3 font-medium">{log.productName}</td>
                      <td className={`p-3 font-bold ${log.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {log.change > 0 ? '+' : ''}{log.change}
                      </td>
                      <td className="p-3 text-sm">
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                             {
                                log.reason === 'damage' ? 'تالف' :
                                log.reason === 'theft' ? 'سرقة' :
                                log.reason === 'expired' ? 'منتهي الصلاحية' :
                                log.reason === 'error' ? 'خطأ في التسجيل' : 'أخرى'
                             }
                        </span>
                      </td>
                    </tr>
                  ))}
                   {stockLogs.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-400">لا يوجد سجلات</td></tr>}
                </tbody>
              </table>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Selection */}
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="بحث عن منتج للجرد..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-200 outline-none"
                    />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-y-auto max-h-[500px]">
                    {filteredProducts.map(product => (
                        <div 
                            key={product.id} 
                            onClick={() => setSelectedProduct(product)}
                            className={`p-4 border-b last:border-0 cursor-pointer transition-colors hover:bg-red-50 flex justify-between items-center ${selectedProduct?.id === product.id ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}
                        >
                            <div>
                                <div className="font-bold text-gray-800">{product.name}</div>
                                <div className="text-xs text-gray-500">الكمية الحالية: {product.quantity}</div>
                            </div>
                            <div className="text-gray-400 text-sm">#{product.code}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Adjustment Form */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">تسجيل تسوية مخزنية</h3>
                    
                    {selectedProduct ? (
                        <form onSubmit={handleAdjustment} className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                <span className="text-gray-500">المنتج المحدد:</span>
                                <div className="font-bold text-gray-800">{selectedProduct.name}</div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">نوع التسوية</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setAdjustment(Math.abs(adjustment) * -1)} 
                                        className={`p-2 rounded-lg text-sm border ${adjustment < 0 ? 'bg-red-100 border-red-200 text-red-700' : 'border-gray-200'}`}
                                    >
                                        نقصان (عجز)
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setAdjustment(Math.abs(adjustment))} 
                                        className={`p-2 rounded-lg text-sm border ${adjustment > 0 ? 'bg-green-100 border-green-200 text-green-700' : 'border-gray-200'}`}
                                    >
                                        زيادة (فائض)
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">قيمة التغيير</label>
                                <input
                                    type="number"
                                    value={Math.abs(adjustment)}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setAdjustment(adjustment < 0 ? -val : val);
                                    }}
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-200"
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">السبب</label>
                                <select 
                                    value={reason} 
                                    onChange={(e) => setReason(e.target.value as StockLog['reason'])}
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-200"
                                >
                                    <option value="damage">تالف</option>
                                    <option value="theft">سرقة</option>
                                    <option value="expired">منتهي الصلاحية</option>
                                    <option value="error">خطأ في التسجيل</option>
                                    <option value="other">أخرى</option>
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 flex justify-center items-center gap-2 mt-4"
                            >
                                <Save size={18} /> حفظ التسوية
                            </button>
                        </form>
                    ) : (
                        <div className="text-center text-gray-400 py-10">
                            <AlertTriangle size={40} className="mx-auto mb-2 opacity-20" />
                            <p>يرجى اختيار منتج من القائمة</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
