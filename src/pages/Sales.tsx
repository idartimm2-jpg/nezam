import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Product, InvoiceItem, Customer } from '../types';
import { Search, ShoppingCart, Plus, Minus, Trash2, User, Printer, Share2, CheckCircle, X } from 'lucide-react';

export const Sales: React.FC = () => {
  const { products, customers, addInvoice, addCustomer, settings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState('');

  // Derived state
  const filteredProducts = useMemo(() => products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.includes(searchTerm)
  ), [products, searchTerm]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) return alert('المنتج غير متوفر في المخزون');
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
             alert('لا توجد كمية كافية في المخزون');
             return prev;
        }
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { 
        productId: product.id, 
        name: product.name, 
        price: product.sellPrice, 
        buyPrice: product.buyPrice, 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          const product = products.find(p => p.id === productId);
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          if (product && newQty > product.quantity) {
              alert('تجاوزت الكمية المتوفرة');
              return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const handleCustomerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setCustomerPhone(val);
      const customer = customers.find(c => c.phone === val);
      if (customer) {
          setCustomerName(customer.name);
          setSelectedCustomerId(customer.id);
      } else {
          setSelectedCustomerId(undefined);
      }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!customerName || !customerPhone) return alert('يرجى إدخال بيانات العميل');

    // Register customer if new
    let finalCustomerId = selectedCustomerId;
    if (!finalCustomerId) {
        const newCustomer: Customer = {
            id: crypto.randomUUID(),
            name: customerName,
            phone: customerPhone,
            totalSpent: 0,
            points: 0,
            purchaseCount: 0,
            createdAt: new Date().toISOString()
        };
        addCustomer(newCustomer);
        finalCustomerId = newCustomer.id;
    }

    const totalProfit = cart.reduce((sum, item) => sum + ((item.price - item.buyPrice) * item.quantity), 0);

    const invoiceId = crypto.randomUUID();
    const invoice = {
        id: invoiceId,
        customerId: finalCustomerId,
        customerName,
        customerPhone,
        items: cart,
        total: cartTotal,
        totalProfit,
        date: new Date().toISOString()
    };

    addInvoice(invoice);
    setLastInvoiceId(invoiceId); // For printing
    setShowSuccessModal(true);
  };

  const resetSales = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setSelectedCustomerId(undefined);
    setShowSuccessModal(false);
  };

  const printInvoice = () => {
      // Create a printable area
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const invoiceHtml = `
        <html dir="rtl">
        <head>
            <title>فاتورة رقم ${lastInvoiceId}</title>
            <style>
                body { font-family: 'Cairo', sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                .details { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                th { background-color: #f8f8f8; }
                .total { text-align: left; font-size: 1.2em; font-weight: bold; }
                .footer { text-align: center; margin-top: 30px; font-size: 0.8em; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>${settings.storeName}</h2>
                <p>${settings.phone}</p>
            </div>
            <div class="details">
                <p><strong>العميل:</strong> ${customerName}</p>
                <p><strong>رقم الهاتف:</strong> ${customerPhone}</p>
                <p><strong>التاريخ:</strong> ${new Date().toLocaleString('ar-EG')}</p>
                <p><strong>رقم الفاتورة:</strong> ${lastInvoiceId.slice(0,8)}</p>
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
                    ${cart.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price}</td>
                            <td>${item.price * item.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="total">
                الإجمالي: ${cartTotal.toLocaleString()} ج.م
            </div>
            <div class="footer">
                <p>شكراً لتعاملكم معنا!</p>
                ${settings.facebookPage ? `<p>${settings.facebookPage}</p>` : ''}
            </div>
        </body>
        </html>
      `;
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      printWindow.print();
  };

  const sendWhatsapp = () => {
    const text = `مرحباً ${customerName}، شكراً لتسوقك من ${settings.storeName}.%0aف فاتورتك بقيمة ${cartTotal} ج.م.`;
    window.open(`https://wa.me/${customerPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Left Side: Products Grid */}
      <div className="lg:w-2/3 flex flex-col gap-4">
        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-200 outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                    <button 
                        key={product.id}
                        onClick={() => addToCart(product)}
                        disabled={product.quantity <= 0}
                        className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-right flex flex-col justify-between hover:shadow-md transition-all h-40 ${product.quantity <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                    >
                        <div>
                            <h3 className="font-bold text-gray-800 line-clamp-2">{product.name}</h3>
                            <div className="text-xs text-gray-500 mt-1">{product.category}</div>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                            <div className="font-bold text-green-600 text-lg">{product.sellPrice} ج.م</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${product.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {product.quantity}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Right Side: Cart */}
      <div className="lg:w-1/3 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-green-50 rounded-t-2xl">
            <div className="flex items-center gap-2 text-green-700 font-bold text-lg mb-4">
                <ShoppingCart /> سلة المشتريات
                <span className="bg-white px-2 py-0.5 rounded-full text-sm shadow-sm">{cartCount}</span>
            </div>
            
            {/* Customer Inputs */}
            <div className="space-y-3">
                <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="tel"
                        placeholder="رقم هاتف العميل"
                        value={customerPhone}
                        onChange={handleCustomerSearch}
                        className="w-full pr-9 pl-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-200 outline-none"
                    />
                </div>
                 <input
                    type="text"
                    placeholder="اسم العميل"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-200 outline-none"
                />
            </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-10 flex flex-col items-center">
                    <ShoppingCart size={48} className="mb-2 opacity-20" />
                    <p>السلة فارغة</p>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</div>
                            <div className="text-gray-500 text-xs">{item.price} × {item.quantity}</div>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-white rounded-lg shadow-sm">
                                <Minus size={14} />
                            </button>
                            <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-white rounded-lg shadow-sm">
                                <Plus size={14} />
                            </button>
                            <button onClick={() => removeFromCart(item.productId)} className="p-1 text-red-500 hover:bg-red-50 rounded-lg ml-1">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex justify-between items-center mb-4 text-lg font-bold text-gray-800">
                <span>الإجمالي</span>
                <span>{cartTotal.toLocaleString()} ج.م</span>
            </div>
            <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 ${
                    cart.length > 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl' : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
                <CheckCircle size={20} /> إتمام البيع
            </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تمت العملية بنجاح!</h2>
            <p className="text-gray-500 mb-8">تم تسجيل الفاتورة رقم #{lastInvoiceId.slice(0, 8)}</p>
            
            <div className="space-y-3">
                <button 
                    onClick={() => { printInvoice(); sendWhatsapp(); }}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                    <Printer size={20} /> طباعة + واتساب
                </button>
                 <button 
                    onClick={printInvoice}
                    className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2"
                >
                    <Printer size={20} /> طباعة فقط
                </button>
                <button 
                    onClick={resetSales}
                    className="w-full text-gray-500 font-medium py-2 hover:text-gray-700"
                >
                    إغلاق وبدء عملية جديدة
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
