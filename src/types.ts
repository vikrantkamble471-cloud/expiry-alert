export type ExpiryItem = {
  id: string;
  title: string;
  category: Category;
  expiryDate: string; // YYYY-MM-DD
  reminder: string;
  notes: string;
  createdAt: number;
};

export type Category = 'Medicines' | 'Documents' | 'Subscriptions' | 'Warranties' | 'Insurance' | 'Other';

export const CATEGORY_META: Record<Category, { icon: string; bg: string; text: string; badgeBg: string }> = {
  Medicines: { icon: "medication", bg: "bg-secondary-fixed", text: "text-on-secondary-fixed", badgeBg: "bg-secondary-fixed-dim" },
  Documents: { icon: "badge", bg: "bg-secondary-container", text: "text-on-secondary-container", badgeBg: "bg-secondary-container" },
  Subscriptions: { icon: "music_cast", bg: "bg-tertiary-fixed", text: "text-on-tertiary-container", badgeBg: "bg-tertiary-container/25" },
  Warranties: { icon: "headphones", bg: "bg-surface-container-high", text: "text-on-surface-variant", badgeBg: "bg-surface-container-highest" },
  Insurance: { icon: "directions_car", bg: "bg-tertiary-fixed-dim", text: "text-on-tertiary-fixed-variant", badgeBg: "bg-tertiary-container/25" },
  Other: { icon: "category", bg: "bg-primary-fixed", text: "text-on-primary-container", badgeBg: "bg-primary-fixed" }
};
