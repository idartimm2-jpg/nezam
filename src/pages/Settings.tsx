import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Settings as SettingsType } from '../types';
import { Settings as SettingsIcon, Save, Upload, Download, Trash2, Image } from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, products, customers, invoices, stockLogs, resetData, importData } = useData();
  const [formData, setFormData] = useState<SettingsType>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          alert('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت');
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    const data = {
      settings,
      products,
      customers,
      invoices,
      stockLogs
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          importData(data);
          alert('تم استيراد البيانات بنجاح');
          window.location.reload(); // To refresh context fully if needed
        } catch (error) {
          alert('حدث خطأ أثناء قراءة الملف');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
      if (confirm('تحذير: هذا الإجراء سيقوم بحذف جميع البيانات (المنتجات، العملاء، الفواتير) ولا يمكن التراجع عنه. هل أنت متأكد؟')) {
          resetData();
          window.location.reload();
      }
  };

  return (
    <div className="space-y-6">
       <header className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 rounded-2xl text-white shadow-lg">
         <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon /> إعدادات النظام
          </h1>
          <p className="text-gray-300 opacity-90 mt-1">تخصيص بيانات المتجر وإدارة النسخ الاحتياطية.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">بيانات المتجر</h3>
            <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">اسم المتجر</label>
                    <input
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">العنوان</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">رابط صفحة الفيسبوك</label>
                    <input
                        type="text"
                        name="facebookPage"
                        value={formData.facebookPage}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">نسبة نقاط الولاء (لكل 1 جنيه)</label>
                    <input
                        type="number"
                        name="pointsPerCurrency"
                        value={formData.pointsPerCurrency}
                        onChange={handleChange}
                        step="0.01"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
                    />
                </div>
                
                <button type="submit" className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                    <Save size={18} /> حفظ الإعدادات
                </button>
            </form>
        </div>

        <div className="space-y-6">
            {/* Logo Settings */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">شعار المتجر</h3>
                <div className="flex flex-col items-center gap-4">
                    {formData.logo ? (
                        <img src={formData.logo} alt="Logo Preview" className="h-32 w-32 object-contain border rounded-lg bg-gray-50" />
                    ) : (
                        <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 flex-col gap-2">
                            <Image size={32} />
                            <span className="text-xs">لا يوجد شعار</span>
                        </div>
                    )}
                    
                    <div className="w-full">
                        <label className="flex items-center justify-center w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors font-medium">
                            <Upload size={18} className="ml-2" />
                            رفع شعار جديد
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                        {formData.logo && (
                            <button 
                                onClick={() => setFormData(prev => ({ ...prev, logo: undefined }))}
                                className="w-full mt-2 text-red-500 text-sm hover:underline"
                            >
                                حذف الشعار
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">إدارة البيانات</h3>
                <div className="space-y-3">
                    <button 
                        onClick={handleExportData}
                        className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                        <div className="flex items-center gap-2 font-bold"><Download size={20} /> تصدير نسخة احتياطية</div>
                        <span className="text-xs opacity-70">JSON</span>
                    </button>

                    <label className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 font-bold"><Upload size={20} /> استعادة نسخة احتياطية</div>
                        <input type="file" className="hidden" accept=".json" onChange={handleImportData} />
                    </label>

                    <button 
                        onClick={handleReset}
                        className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
                    >
                        <div className="flex items-center gap-2 font-bold"><Trash2 size={20} /> حذف جميع البيانات</div>
                        <span className="text-xs opacity-70">تحذير!</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
