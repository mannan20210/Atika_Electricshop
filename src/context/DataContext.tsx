import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Sale, Expense } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface DataContextType {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  expenses: Expense[];
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'created_at'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at'>) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setProducts([]);
      setCustomers([]);
      setSales([]);
      setExpenses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { data: productsData },
        { data: customersData },
        { data: salesData },
        { data: expensesData }
      ] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('sales').select('*, items:sale_items(*)').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('created_at', { ascending: false })
      ]);

      if (productsData) setProducts(productsData);
      if (customersData) setCustomers(customersData);
      if (salesData) setSales(salesData);
      if (expensesData) setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (p: Omit<Product, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...p, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    if (data) setProducts([data, ...products]);
  };

  const addSale = async (s: Omit<Sale, 'id' | 'created_at'>) => {
    const { items, ...saleData } = s;
    
    // 1. Create the sale
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([{ ...saleData, user_id: user?.id }])
      .select()
      .single();

    if (saleError) throw saleError;

    // 2. Create sale items
    const saleItems = items.map(item => ({
      ...item,
      sale_id: sale.id,
      user_id: user?.id
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) throw itemsError;

    // 3. Update stock for each product
    for (const item of items) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        await supabase
          .from('products')
          .update({ stock: product.stock - item.quantity })
          .eq('id', product.id);
      }
    }

    // 4. Refresh data to get updated stock and the new sale with items
    await fetchData();
  };

  const addExpense = async (e: Omit<Expense, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ ...e, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    if (data) setExpenses([data, ...expenses]);
  };

  const addCustomer = async (c: Omit<Customer, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ ...c, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    if (data) setCustomers([data, ...customers]);
  };

  return (
    <DataContext.Provider value={{ products, customers, sales, expenses, addProduct, addSale, addExpense, addCustomer, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
