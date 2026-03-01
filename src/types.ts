export type User = {
  id: string;
  email: string;
  business_name: string;
};

export type Product = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  price: number;
  cost_price: number;
  stock: number;
  unit: string;
  created_at: string;
};

export type Customer = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  created_at: string;
};

export type Sale = {
  id: string;
  user_id: string;
  customer_id?: string;
  items: SaleItem[];
  total_amount: number;
  discount: number;
  payment_method: 'cash' | 'card' | 'transfer';
  status: 'completed' | 'pending' | 'cancelled';
  created_at: string;
};

export type SaleItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type Expense = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
};

export type DashboardStats = {
  totalSales: number;
  totalExpenses: number;
  totalProfit: number;
  lowStockCount: number;
  recentSales: Sale[];
};
