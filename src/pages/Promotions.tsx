import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MessageCircle, Send, Copy, Users, CheckCheck } from 'lucide-react';

export const Promotions: React.FC = () => {
  const { customers, settings } = useData();
  const [message, setMessage] = useState<string>(`مرحباً، لدينا عروض مميزة في ${settings.storeName}! تفضل بزيارتنا.`);
  const [filter, setFilter] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.phone && (c.name.includes(filter) || c.phone.includes(filter))
  );

  const getWhatsappLink = (phone: string) => {
    // Format phone: remove spaces, ensure standard format if possible
    // For now assuming input is usable for wa.me
    const cleanPhone = phone.replace(/\s+/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  const handleSend = (phone: string) => {
    window.open(getWhatsappLink(phone), '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ الرابط');
  };

  return (
    <div className="space-y-6">
      <header className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle /> العروض والرسائل
        </h1>
        <p className="text-teal-100 opacity-90 mt-1">إرسال عروض ترويجية للعملاء عبر الواتساب.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Editor */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6">
            <h3 className="font-bold text-gray-800 mb-4">نص الرسالة</h3>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-40 p-3 border rounded-xl focus:ring-2 focus:ring-teal-200 outline-none resize-none mb-4"
              placeholder="اكتب تفاصيل العرض هنا..."
            />

            <div className="bg-teal-50 p-3 rounded-lg mb-4">
              <h4 className="text-xs font-bold text-teal-800 mb-2">معاينة:</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{message}</p>
            </div>

            <div className="text-xs text-gray-400">
              * سيتم فتح تطبيق واتساب لإرسال الرسالة لكل عميل على حدة.
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="lg:col-span-2 space-y-4">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <input 
                type="text" 
                placeholder="بحث في العملاء..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-200 outline-none"
             />
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 text-gray-600 text-sm">
                    <tr>
                      <th className="p-4">العميل</th>
                      <th className="p-4">رقم الهاتف</th>
                      <th className="p-4">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map(customer => (
                      <tr key={customer.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium">{customer.name}</td>
                        <td className="p-4 font-mono text-gray-500">{customer.phone}</td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => handleSend(customer.phone)}
                            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors text-sm font-bold"
                          >
                            <Send size={16} /> إرسال
                          </button>
                          <button
                            onClick={() => copyToClipboard(getWhatsappLink(customer.phone))}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                            title="نسخ الرابط"
                          >
                            <Copy size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-gray-400">
                          لا يوجد عملاء
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
