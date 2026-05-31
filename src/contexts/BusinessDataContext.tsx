import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { getOwnedDocuments } from '../services/firestoreService';
import type { Customer, Transaction } from '../types';

interface BusinessDataContextValue {
  transactions: Transaction[];
  customers: Customer[];
  loading: boolean;
  addTransaction: (tx: Omit<Transaction, 'id' | 'ownerId'>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'ownerId'>) => void;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  removeTransaction: (id: string) => void;
}

const BusinessDataContext = createContext<BusinessDataContextValue | undefined>(undefined);

const storageKey = (ownerId: string, type: string) => `bpa-${type}-${ownerId}`;

const loadLocal = <T>(ownerId: string, type: string): T[] => {
  try {
    const raw = localStorage.getItem(storageKey(ownerId, type));
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

const saveLocal = <T>(ownerId: string, type: string, data: T[]) => {
  localStorage.setItem(storageKey(ownerId, type), JSON.stringify(data));
};

export const BusinessDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [remoteTx, remoteCustomers] = await Promise.all([
          getOwnedDocuments<Transaction>('transactions', profile.id).catch(() => []),
          getOwnedDocuments<Customer>('customers', profile.id).catch(() => []),
        ]);
        if (!active) return;
        const localTx = loadLocal<Transaction>(profile.id, 'transactions');
        const localCustomers = loadLocal<Customer>(profile.id, 'customers');
        setTransactions(remoteTx.length ? remoteTx : localTx);
        setCustomers(remoteCustomers.length ? remoteCustomers : localCustomers);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [profile.id]);

  useEffect(() => {
    if (!loading) saveLocal(profile.id, 'transactions', transactions);
  }, [transactions, profile.id, loading]);

  useEffect(() => {
    if (!loading) saveLocal(profile.id, 'customers', customers);
  }, [customers, profile.id, loading]);

  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id' | 'ownerId'>) => {
      setTransactions((items) => [
        { ...tx, id: crypto.randomUUID(), ownerId: profile.id },
        ...items,
      ]);
    },
    [profile.id]
  );

  const addCustomer = useCallback(
    (customer: Omit<Customer, 'id' | 'ownerId'>) => {
      setCustomers((items) => [
        { ...customer, id: crypto.randomUUID(), ownerId: profile.id },
        ...items,
      ]);
    },
    [profile.id]
  );

  const updateCustomer = useCallback((id: string, patch: Partial<Customer>) => {
    setCustomers((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setTransactions((items) => items.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      transactions,
      customers,
      loading,
      addTransaction,
      addCustomer,
      updateCustomer,
      removeTransaction,
    }),
    [transactions, customers, loading, addTransaction, addCustomer, updateCustomer, removeTransaction]
  );

  return <BusinessDataContext.Provider value={value}>{children}</BusinessDataContext.Provider>;
};

export const useBusinessData = () => {
  const context = useContext(BusinessDataContext);
  if (!context) throw new Error('useBusinessData must be used inside BusinessDataProvider');
  return context;
};
