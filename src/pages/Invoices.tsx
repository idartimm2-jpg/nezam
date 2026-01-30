import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Invoice } from '../types';
import { Search, Eye, Printer, MessageCircle, FileText } from 'lucide-react';

export const Invoices: React.FC = () => {
  const { invoices, settings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => 
    inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.includes(searchTerm)
  );

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHtml = `
      <html dir="rtl">
      <head>
          <title>فاتورة رقم ${invoice.id}</title>
          <style>
              body { font-family: 'Cairo', sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
              th { background-color: #f8f8f8; }
          </style>
      </head>
      <body>
          <div class="header">
              <h2>${settings.storeName}</h2>
              <p>فاتورة رقم: ${invoice.id.slice(0, 8)}</p>
              <p>التاريخ: ${new Date(invoice.date).toLocaleString('ar-EG')}</p>
          </div>
          <div style="margin-bottom: 20px;">
              <strong>العميل:</strong> ${invoice.customerName}
          </div>
          <table>
              <thead>
                  <tr>
                      <th>الصنف</th>
                      <th>الكمية</th>
                      <th>السعر</th>
                      <th>الإجمالي</th>
                  </tr>
              </thead>
              <tbody>
                  ${invoice.items.map(item => `
                      <tr>
                          <td>${item.name}</td>
                          <td>${item.quantity}</td>
                          <td>${item.price}</td>
                          <td>${item.price * item.quantity}</td>
                      </tr>
                  `).join('')}
              </tbody>
          </table>
          <h3>الإجمالي: ${invoice.total.toLocaleString()} ج.م</h3>
      </body>
      </html>
    `;
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.print();
  };

  const handleWhatsapp = (invoice: Invoice) => {
     if (!invoice.customerPhone) return alert('لا يوجد رقم هاتف مسجل لهذا العميل');
     const text = `مرحباً ${invoice.customerName}، تفاصيل فاتورتك رقم ${invoice.id.slice(0,8)} بقيمة ${invoice.total} ج.م`;
     window.open(`https://wa.me/${invoice.customerPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
       <header className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-2xl text-white shadow-lg">
         <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText /> سجل الفواتير
          </h1>
          <p className="text-orange-100 opacity-90 mt-1">عرض وطباعة فواتير المبيعات السابقة.</p>
      </header>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="بحث برقم الفاتورة أو اسم العميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-gray-600 font-medium border-b border-slate-200">
              <tr>
                <th className="p-4">رقم الفاتورة</th>
                <th className="p-4">العميل</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">المنتجات</th>
                <th className="p-4">الإجمالي</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-sm text-gray-500">#{invoice.id.slice(0, 8)}</td>
                  <td className="p-4 font-medium text-gray-800">{invoice.customerName}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4 text-sm">{invoice.items.length} أصناف</td>
                  <td className="p-4 font-bold text-green-600">{invoice.total.toLocaleString()} ج.م</td>
                  <td className="p-4 flex gap-2">
                    <button 
                      onClick={() => setSelectedInvoice(invoice)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="عرض التفاصيل"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handlePrint(invoice)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="طباعة"
                    >
                      <Printer size={18} />
                    </button>
                    {invoice.customerPhone && (
                         <button 
                            onClick={() => handleWhatsapp(invoice)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="واتساب"
                        >
                        <MessageCircle size={18} />
                        </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    لا توجد فواتير مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">تفاصيل الفاتورة #{selectedInvoice.id.slice(0,8)}</h3>
                    <button onClick={() => setSelectedInvoice(null)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">العميل:</span>
                            <span className="font-bold">{selectedInvoice.customerName}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">التاريخ:</span>
                            <span className="font-bold">{new Date(selectedInvoice.date).toLocaleString('ar-EG')}</span>
                        </div>
                         <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">رقم الهاتف:</span>
                            <span className="font-bold">{selectedInvoice.customerPhone || '-'}</span>
                        </div>
                        
                        <div className="pt-2">
                            <h4 className="font-bold mb-2">المنتجات:</h4>
                            <div className="space-y-2">
                                {selectedInvoice.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between bg-gray-50 p-2 rounded-lg">
                                        <div>
                                            <div className="font-medium text-sm">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.price} × {item.quantity}</div>
                                        </div>
                                        <div className="font-bold">
                                            {(item.price * item.quantity).toLocaleString()} ج.م
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-lg font-bold">الإجمالي: {selectedInvoice.total.toLocaleString()} ج.م</div>
                    <button onClick={() => handlePrint(selectedInvoice)} className="text-blue-600 font-medium hover:underline">طباعة الفاتورة</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
