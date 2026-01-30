import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Product } from '../types';
import { Plus, Search, Edit, Trash2, X, AlertTriangle, CheckCircle, Package } from 'lucide-react';

export const Inventory: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', code: '', buyPrice: 0, sellPrice: 0, quantity: 0, description: '', category: ''
  });

  const filteredProducts = products.filter(p => 
    p.name.includes(searchTerm) || p.code.includes(searchTerm)
  );

  const getStockStatus = (qty: number) => {
    if (qty <= 0) return { color: 'bg-red-100 text-red-700', icon: <AlertTriangle size={16} />, text: 'غير متوفر' };
    if (qty <= 10) return { color: 'bg-yellow-100 text-yellow-700', icon: <AlertTriangle size={16} />, text: 'منخفض' };
    return { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={16} />, text: 'متوفر' };
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', code: '', buyPrice: 0, sellPrice: 0, quantity: 0, description: '', category: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editingProduct) {
      updateProduct({ ...formData, id: editingProduct.id } as Product);
    } else {
      addProduct({ ...formData, id: crypto.randomUUID() } as Product);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
       <header className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package /> إدارة الأصناف
          </h1>
          <p className="text-blue-100 opacity-90 mt-1">إضافة وتعديل ومتابعة مخزون المنتجات.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> إضافة صنف
        </button>
      </header>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="بحث باسم الصنف أو الكود..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-gray-600 font-medium border-b border-slate-200">
              <tr>
                <th className="p-4">الكود</th>
                <th className="p-4">الصنف</th>
                <th className="p-4">السعر (شراء / بيع)</th>
                <th className="p-4">الكمية</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.quantity);
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-sm text-gray-500">{product.code}</td>
                    <td className="p-4 font-medium text-gray-800">
                      <div>{product.name}</div>
                      <div className="text-xs text-gray-400">{product.category}</div>
                    </td>
                    <td className="p-4 text-sm">
                      <span className="text-gray-400">{product.buyPrice}</span> / <span className="text-green-600 font-bold">{product.sellPrice}</span>
                    </td>
                    <td className="p-4 font-bold">{product.quantity}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.icon} {status.text}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    لا توجد أصناف مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'تعديل صنف' : 'إضافة صنف جديد'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">كود الصنف</label>
                  <input
                    required
                    type="text"
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">الكمية</label>
                   <input
                    required
                    type="number"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">اسم الصنف</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">سعر الشراء</label>
                  <input
                    required
                    type="number"
                    value={formData.buyPrice}
                    onChange={e => setFormData({...formData, buyPrice: Number(e.target.value)})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">سعر البيع</label>
                  <input
                    required
                    type="number"
                    value={formData.sellPrice}
                    onChange={e => setFormData({...formData, sellPrice: Number(e.target.value)})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">التصنيف</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="مثال: إلكترونيات"
                />
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                حفظ البيانات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
