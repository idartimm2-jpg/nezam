import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Customer } from '../types';
import { Users, Search, Edit, Trash2, X, Plus, Gift, ShoppingBag } from 'lucide-react';

export const Customers: React.FC = () => {
  const { customers, updateCustomer, deleteCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({ name: '', phone: '', email: '' });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
        // usually customers are added via sales, but manual add is good too
        setEditingCustomer(null);
        setFormData({ name: '', phone: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    if (editingCustomer) {
        updateCustomer({ ...editingCustomer, ...formData } as Customer);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟ لن يتم حذف الفواتير السابقة.')) {
        deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-6">
       <header className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users /> قاعدة العملاء
          </h1>
          <p className="text-pink-100 opacity-90 mt-1">إدارة بيانات العملاء ونقاط الولاء.</p>
        </div>
      </header>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="بحث باسم العميل أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
            <div key={customer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 group hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-xl">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">{customer.name}</h3>
                            <p className="text-sm text-gray-500">{customer.phone}</p>
                        </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleOpenModal(customer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(customer.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                    <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1 flex justify-center items-center gap-1"><ShoppingBag size={12}/> المشتريات</div>
                        <div className="font-bold text-gray-800">{customer.purchaseCount}</div>
                    </div>
                    <div className="text-center border-x border-slate-100">
                        <div className="text-xs text-gray-400 mb-1 flex justify-center items-center gap-1"><Gift size={12}/> النقاط</div>
                        <div className="font-bold text-pink-600">{customer.points.toFixed(0)}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">الإنفاق</div>
                        <div className="font-bold text-gray-800">{customer.totalSpent.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        ))}
      </div>
        
         {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">تعديل بيانات العميل</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">الاسم</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
                <input
                  required
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition-colors"
              >
                حفظ التغييرات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
