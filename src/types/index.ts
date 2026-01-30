export interface Product {
  id: string;
  code: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  description?: string;
  category?: string;
  minQuantity?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalSpent: number;
  points: number;
  purchaseCount: number;
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  price: number;
  buyPrice: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  items: InvoiceItem[];
  total: number;
  totalProfit: number;
  date: string; // ISO date string
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  reason: 'damage' | 'theft' | 'expired' | 'error' | 'other';
  change: number; // Negative for loss
  date: string;
}

export interface Settings {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  whatsappGroup: string;
  facebookPage: string;
  pointsPerCurrency: number;
  logo?: string; // Base64
}

export interface DashboardStats {
  totalSales: number;
  totalProfit: number;
  invoiceCount: number;
  customerCount: number;
  productCount: number;
  inventoryValue: number;
}
