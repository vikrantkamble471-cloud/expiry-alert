import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ExpiryItem } from '../types';
import { getDateString } from '../lib/dateUtils';

const DEFAULT_SEED_DATA: ExpiryItem[] = [
  {
    id: "exp_1",
    title: "Amoxicillin Antibiotic",
    category: "Medicines",
    expiryDate: getDateString(3),
    reminder: "1 day before",
    notes: "Take 1 capsule every 8 hours with meals.",
    createdAt: Date.now() - 3600000 * 24 * 7
  },
  {
    id: "exp_2",
    title: "Greek Yogurt (Pack of 4)",
    category: "Other",
    expiryDate: getDateString(0),
    reminder: "On expiry day",
    notes: "In fridge top rack. Finish before night.",
    createdAt: Date.now() - 3600000 * 24 * 4
  },
  {
    id: "exp_3",
    title: "Passport (US International)",
    category: "Documents",
    expiryDate: getDateString(20),
    reminder: "1 month before",
    notes: "Renewal form submitted online. Need photo appointment.",
    createdAt: Date.now() - 3600000 * 24 * 30
  },
  {
    id: "exp_4",
    title: "Spotify Annual Duo",
    category: "Subscriptions",
    expiryDate: getDateString(35),
    reminder: "1 week before",
    notes: "Linked to Visa card ending in 8831.",
    createdAt: Date.now() - 3600000 * 24 * 90
  },
  {
    id: "exp_5",
    title: "Bose QC45 Headphones Warranty",
    category: "Warranties",
    expiryDate: getDateString(-5),
    reminder: "3 days before",
    notes: "Serial #QC45-0918-BoseUS. Registered online.",
    createdAt: Date.now() - 3600000 * 24 * 180
  },
  {
    id: "exp_6",
    title: "Car Insurance Policy (Geico)",
    category: "Insurance",
    expiryDate: getDateString(51),
    reminder: "2 weeks before",
    notes: "Policy #98421-Geico-Auto. Six-month renewal term.",
    createdAt: Date.now() - 3600000 * 24 * 120
  },
  {
    id: "exp_7",
    title: "Organic Whole Milk",
    category: "Other",
    expiryDate: getDateString(1),
    reminder: "1 day before",
    notes: "For morning cereal.",
    createdAt: Date.now() - 3600000 * 24 * 3
  }
];

type AppContextType = {
  items: ExpiryItem[];
  setItems: React.Dispatch<React.SetStateAction<ExpiryItem[]>>;
  addItem: (item: Omit<ExpiryItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<ExpiryItem>) => void;
  deleteItem: (id: string) => void;
  resetToSeed: () => void;
  clearAll: () => void;
  user: { name: string; email: string; id: string };
  setUser: (user: { name: string; email: string; id: string }) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => ({
    id: localStorage.getItem("expiry_active_uid") || "sarah_c_102",
    name: localStorage.getItem("expiry_active_name") || "Sarah",
    email: localStorage.getItem("expiry_active_email") || "sarah.c@example.com"
  }));

  const [items, setItems] = useState<ExpiryItem[]>([]);

  useEffect(() => {
    localStorage.setItem("expiry_active_uid", user.id);
    localStorage.setItem("expiry_active_name", user.name);
    localStorage.setItem("expiry_active_email", user.email);
  }, [user]);

  useEffect(() => {
    const key = `expiry_alert_items_${user.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems(DEFAULT_SEED_DATA);
      }
    } else {
      setItems(DEFAULT_SEED_DATA);
      localStorage.setItem(key, JSON.stringify(DEFAULT_SEED_DATA));
    }
  }, [user.id]);

  const persist = (newItems: ExpiryItem[]) => {
    setItems(newItems);
    localStorage.setItem(`expiry_alert_items_${user.id}`, JSON.stringify(newItems));
  };

  const addItem = (item: Omit<ExpiryItem, 'id' | 'createdAt'>) => {
    const newItem: ExpiryItem = {
      ...item,
      id: `exp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: Date.now()
    };
    persist([newItem, ...items]);
  };

  const updateItem = (id: string, updates: Partial<ExpiryItem>) => {
    persist(items.map(it => it.id === id ? { ...it, ...updates } : it));
  };

  const deleteItem = (id: string) => {
    persist(items.filter(it => it.id !== id));
  };

  const resetToSeed = () => persist(DEFAULT_SEED_DATA);
  const clearAll = () => persist([]);

  return (
    <AppContext.Provider value={{ items, setItems, addItem, updateItem, deleteItem, resetToSeed, clearAll, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
