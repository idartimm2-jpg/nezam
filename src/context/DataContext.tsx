import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Invoice, StockLog, Settings } from '../types';

interface DataContextType {
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  stockLogs: StockLog[];
  settings: Settings;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  addStockLog: (log: StockLog) => void;
  updateSettings: (settings: Settings) => void;
  resetData: () => void;
  importData: (data: any) => void;
}

const defaultSettings: Settings = {
  storeName: 'متجرنا',
  phone: '',
  email: '',
  address: '',
  whatsappGroup: '',
  facebookPage: '',
  pointsPerCurrency: 0.1,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedProducts = localStorage.getItem('products');
    const loadedCustomers = localStorage.getItem('customers');
    const loadedInvoices = localStorage.getItem('invoices');
    const loadedStockLogs = localStorage.getItem('stockLogs');
    const loadedSettings = localStorage.getItem('settings');

    if (loadedProducts) setProducts(JSON.parse(loadedProducts));
    if (loadedCustomers) setCustomers(JSON.parse(loadedCustomers));
    if (loadedInvoices) setInvoices(JSON.parse(loadedInvoices));
    if (loadedStockLogs) setStockLogs(JSON.parse(loadedStockLogs));
    if (loadedSettings) setSettings(JSON.parse(loadedSettings));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('customers', JSON.stringify(customers)), [customers]);
  useEffect(() => localStorage.setItem('invoices', JSON.stringify(invoices)), [invoices]);
  useEffect(() => localStorage.setItem('stockLogs', JSON.stringify(stockLogs)), [stockLogs]);
  useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings]);

  const addProduct = (product: Product) => setProducts([...products, product]);
  const updateProduct = (updated: Product) => setProducts(products.map(p => p.id === updated.id ? updated : p));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const addCustomer = (customer: Customer) => setCustomers([...customers, customer]);
  const updateCustomer = (updated: Customer) => setCustomers(customers.map(c => c.id === updated.id ? updated : c));
  const deleteCustomer = (id: string) => setCustomers(customers.filter(c => c.id !== id));

  const addInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices]);
    
    // Update product quantities
    const updatedProducts = products.map(p => {
      const item = invoice.items.find(i => i.productId === p.id);
      if (item) {
        return { ...p, quantity: p.quantity - item.quantity };
      }
      return p;
    });
    setProducts(updatedProducts);

    // Update customer stats if registered
    if (invoice.customerId) {
      const customer = customers.find(c => c.id === invoice.customerId);
      if (customer) {
        const updatedCustomer = {
          ...customer,
          totalSpent: customer.totalSpent + invoice.total,
          purchaseCount: customer.purchaseCount + 1,
          points: customer.points + (invoice.total * settings.pointsPerCurrency)
        };
        updateCustomer(updatedCustomer);
      }
    }
  };

  const addStockLog = (log: StockLog) => {
    setStockLogs([log, ...stockLogs]);
    // Also update the product quantity
    const product = products.find(p => p.id === log.productId);
    if (product) {
        updateProduct({ ...product, quantity: product.quantity + log.change });
    }
  };

  const updateSettings = (newSettings: Settings) => setSettings(newSettings);

  const resetData = () => {
    setProducts([]);
    setCustomers([]);
    setInvoices([]);
    setStockLogs([]);
    setSettings(defaultSettings);
    localStorage.clear();
  };

  const importData = (data: any) => {
    if (data.products) setProducts(data.products);
    if (data.customers) setCustomers(data.customers);
    if (data.invoices) setInvoices(data.invoices);
    if (data.stockLogs) setStockLogs(data.stockLogs);
    if (data.settings) setSettings(data.settings);
  };

  return (
    <DataContext.Provider value={{
      products, customers, invoices, stockLogs, settings,
      addProduct, updateProduct, deleteProduct,
      addCustomer, updateCustomer, deleteCustomer,
      addInvoice, addStockLog, updateSettings,
      resetData, importData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
