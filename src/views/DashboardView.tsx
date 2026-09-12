import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ExpiryCard from '../components/ExpiryCard';
import { getDaysDiff } from '../lib/dateUtils';
import { Category } from '../types';

export default function DashboardView({
  onFilterClick,
  onItemClick,
  onAddClick,
}: {
  onFilterClick: (filter: string) => void;
  onItemClick: (id: string) => void;
  onAddClick: () => void;
}) {
  const { items, user } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Derived state
  const hr = new Date().getHours();
  const greeting = hr >= 12 && hr < 17 ? "Good afternoon" : hr >= 17 ? "Good evening" : "Good morning";

  const sorted = [...items].sort((a, b) => getDaysDiff(a.expiryDate) - getDaysDiff(b.expiryDate));

  const needsAttention = sorted.filter(item => getDaysDiff(item.expiryDate) <= 7);
  const expiresToday = sorted.filter(item => getDaysDiff(item.expiryDate) === 0);
  const expiringThisWeek = sorted.filter(item => {
    const d = getDaysDiff(item.expiryDate);
    return d >= 2 && d <= 7;
  });
  const upcomingSafe = sorted.filter(item => getDaysDiff(item.expiryDate) > 7);

  const expiredCount = sorted.filter(i => getDaysDiff(i.expiryDate) < 0).length;
  const soonCount = sorted.filter(i => {
    const d = getDaysDiff(i.expiryDate);
    return d >= 0 && d <= 7;
  }).length;
  const safeCount = upcomingSafe.length;

  const categoryCounts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const renderSearch = () => {
    const matches = sorted.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Search Results</h3>
          <span className="font-label-sm text-label-sm text-primary font-bold">{matches.length} matches</span>
        </div>
        <div className="flex flex-col space-y-2.5">
          {matches.length > 0 ? (
            matches.map(item => <ExpiryCard key={item.id} item={item} onClick={() => onItemClick(item.id)} />)
          ) : (
            <div className="py-10 text-center rounded-2xl bg-surface-container-lowest">
              <span className="material-symbols-outlined text-outline text-[32px]">search_off</span>
              <p className="font-body-md text-on-surface-variant mt-1">No items found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  if (items.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-surface-container-lowest border border-dashed border-outline-variant/60 my-6">
        <div className="w-20 h-20 rounded-3xl bg-primary-fixed flex items-center justify-center text-primary mb-4 shadow-inner">
          <span className="material-symbols-outlined text-[42px]">check_circle</span>
        </div>
        <h3 className="font-headline-lg text-headline-lg text-on-surface">You're all clear!</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-1 mb-6">
          No expiry dates are being tracked yet. Add medications, warranties, passport, subscriptions, or food items.
        </p>
        <button onClick={onAddClick} className="px-6 min-touch h-12 rounded-2xl bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md hover:bg-primary active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[22px]">add</span>
          <span>+ Add Your First Expiry</span>
        </button>
      </section>
    );
  }

  return (
    <div className="flex flex-col w-full space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-surface-container-low p-5 shadow-sm border border-surface-container-high/40">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-primary-fixed/40 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
              <span>Sync Active • Real-time</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">{greeting}, {user.name.split(' ')[0]} 👋</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-[280px]">
              Stay ahead of your important expiry dates.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shadow-inner shrink-0">
            <span className="material-symbols-outlined text-[26px]">shield_check</span>
          </div>
        </div>
        <button onClick={onAddClick} className="w-full mt-4 min-touch h-12 rounded-2xl bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:bg-primary active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined text-[22px]">add_circle</span>
          <span>+ Add Expiry</span>
        </button>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div onClick={() => onFilterClick('all')} className="group cursor-pointer min-touch flex flex-col justify-between p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container-high/60 hover:border-primary-container/40 active:scale-[0.98] transition-all" role="button" tabIndex={0}>
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-secondary-container/80 flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </span>
            <span className="material-symbols-outlined text-outline-variant text-[16px] group-hover:text-primary transition-colors">arrow_forward</span>
          </div>
          <div className="mt-3">
            <span className="font-display-lg-mobile text-[26px] font-extrabold text-on-surface tracking-tight">{items.length}</span>
            <div className="flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-secondary font-semibold">Total Items</p>
              <span className="font-body-sm text-[11px] text-on-surface-variant">All</span>
            </div>
          </div>
        </div>
        <div onClick={() => onFilterClick('soon')} className="group cursor-pointer min-touch flex flex-col justify-between p-3.5 rounded-2xl bg-orange-50/70 shadow-sm border border-orange-200/80 hover:border-primary-container active:scale-[0.98] transition-all relative overflow-hidden" role="button" tabIndex={0}>
          <div className="absolute -right-2 -top-2 w-10 h-10 bg-primary-fixed/50 rounded-full blur-sm pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
            </span>
            <span className="material-symbols-outlined text-primary/60 text-[16px] group-hover:text-primary transition-colors">arrow_forward</span>
          </div>
          <div className="mt-3">
            <span className="font-display-lg-mobile text-[26px] font-extrabold text-primary tracking-tight">{soonCount}</span>
            <div className="flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-primary font-bold">Expiring Soon</p>
              <span className="font-body-sm text-[11px] text-primary/80">≤ 7 days</span>
            </div>
          </div>
        </div>
        <div onClick={() => onFilterClick('expired')} className="group cursor-pointer min-touch flex flex-col justify-between p-3.5 rounded-2xl bg-red-50/80 shadow-sm border border-red-200/80 hover:border-error active:scale-[0.98] transition-all" role="button" tabIndex={0}>
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </span>
            <span className="material-symbols-outlined text-error/60 text-[16px] group-hover:text-error transition-colors">arrow_forward</span>
          </div>
          <div className="mt-3">
            <span className="font-display-lg-mobile text-[26px] font-extrabold text-error tracking-tight">{expiredCount}</span>
            <div className="flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-error font-bold">Expired</p>
              <span className="font-body-sm text-[11px] text-error/80">Past due</span>
            </div>
          </div>
        </div>
        <div onClick={() => onFilterClick('safe')} className="group cursor-pointer min-touch flex flex-col justify-between p-3.5 rounded-2xl bg-emerald-50/70 shadow-sm border border-emerald-200/80 hover:border-tertiary active:scale-[0.98] transition-all" role="button" tabIndex={0}>
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-tertiary-fixed-dim/40 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
            <span className="material-symbols-outlined text-tertiary/60 text-[16px] group-hover:text-tertiary transition-colors">arrow_forward</span>
          </div>
          <div className="mt-3">
            <span className="font-display-lg-mobile text-[26px] font-extrabold text-tertiary tracking-tight">{safeCount}</span>
            <div className="flex items-center justify-between">
              <p className="font-label-sm text-label-sm text-tertiary font-bold">Safe</p>
              <span className="font-body-sm text-[11px] text-tertiary/80">&gt; 7 days</span>
            </div>
          </div>
        </div>
      </section>

      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full min-touch h-11 pl-10 pr-9 rounded-2xl bg-surface-container-lowest border border-surface-container-high text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container shadow-xs transition-all"
          placeholder="Search by name or category (e.g. Medicine, Geico)..."
          type="text"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 min-touch w-9 h-9 flex items-center justify-center text-outline hover:text-on-surface">
            <span className="material-symbols-outlined text-[18px]">cancel</span>
          </button>
        )}
      </div>

      {searchQuery ? renderSearch() : (
        <div className="flex flex-col space-y-5">
          {expiresToday.length > 0 && (
            <section className="flex flex-col space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <h3 className="font-headline-md text-headline-md text-red-700 flex items-center gap-1.5 font-bold">
                    <span className="material-symbols-outlined text-[22px] text-red-600">notifications_active</span>
                    Expires Today
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-label-sm text-label-sm font-bold animate-pulse">Action Required</span>
              </div>
              <div className="flex flex-col space-y-2.5">
                {expiresToday.map(item => <ExpiryCard key={item.id} item={item} onClick={() => onItemClick(item.id)} />)}
              </div>
            </section>
          )}

          <section className="flex flex-col space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-primary">priority_high</span>
                  Needs Attention
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-container font-label-sm text-label-sm font-semibold">{needsAttention.length}</span>
              </div>
              <span className="text-on-surface-variant font-body-sm text-[12px]">Urgent & Overdue</span>
            </div>
            <div className="flex flex-col space-y-3">
              {needsAttention.length > 0 ? (
                needsAttention.map(item => <ExpiryCard key={item.id} item={item} onClick={() => onItemClick(item.id)} />)
              ) : (
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-dashed border-outline-variant/60 text-center">
                  <span className="material-symbols-outlined text-[24px] text-tertiary">task_alt</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">No urgent or overdue items right now!</p>
                </div>
              )}
            </div>
          </section>

          <section className="flex flex-col space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md text-on-surface">Expiring This Week</h3>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">{expiringThisWeek.length}</span>
              </div>
              <span className="font-body-sm text-[12px] text-on-surface-variant">Next 7 days</span>
            </div>
            <div className="flex flex-col space-y-2.5">
              {expiringThisWeek.length > 0 ? (
                expiringThisWeek.map(item => <ExpiryCard key={item.id} item={item} onClick={() => onItemClick(item.id)} />)
              ) : (
                <div className="p-3.5 rounded-2xl bg-surface-container-lowest text-center">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">No expirations scheduled for this mid-week window.</p>
                </div>
              )}
            </div>
          </section>

          <section className="flex flex-col space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md text-on-surface">Upcoming Expiries</h3>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">{upcomingSafe.length}</span>
              </div>
              <button onClick={() => onFilterClick('all')} className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline min-touch">
                <span>View All</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            <div className="flex flex-col space-y-3">
              {upcomingSafe.length > 0 ? (
                upcomingSafe.slice(0, 5).map(item => <ExpiryCard key={item.id} item={item} onClick={() => onItemClick(item.id)} />)
              ) : (
                <div className="p-3.5 rounded-2xl bg-surface-container-lowest text-center">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">No distant expiries yet. Add future subscriptions or warranties.</p>
                </div>
              )}
            </div>
          </section>

          <section className="flex flex-col space-y-2.5 pt-1">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-headline-md text-headline-md text-on-surface">Categories</h3>
              <span className="font-body-sm text-[12px] text-on-surface-variant">Tap to filter</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { name: "Medicines", icon: "medication", count: categoryCounts.Medicines || 0, color: "text-secondary" },
                { name: "Documents", icon: "badge", count: categoryCounts.Documents || 0, color: "text-primary" },
                { name: "Subscriptions", icon: "music_cast", count: categoryCounts.Subscriptions || 0, color: "text-tertiary" },
                { name: "Warranties", icon: "headphones", count: categoryCounts.Warranties || 0, color: "text-on-surface-variant" },
                { name: "Insurance", icon: "directions_car", count: categoryCounts.Insurance || 0, color: "text-tertiary" },
                { name: "Other", icon: "category", count: categoryCounts.Other || 0, color: "text-outline" }
              ].map(cat => (
                <div key={cat.name} onClick={() => onFilterClick(`cat:${cat.name}`)} role="button" tabIndex={0} className="min-touch group flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest border border-surface-container-high/70 hover:border-primary-container/40 active:scale-[0.98] transition-all cursor-pointer">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}>
                      <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                    </span>
                    <span className="font-headline-sm text-[13px] text-on-surface truncate">{cat.name}</span>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-surface-container-high group-hover:bg-primary-fixed group-hover:text-on-primary-container text-on-surface-variant text-[12px] font-bold flex items-center justify-center transition-colors">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="p-4 rounded-2xl bg-primary-fixed/25 border border-primary-fixed-dim/40 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <h5 className="font-label-lg text-label-lg text-on-surface font-bold">Proactive Insight</h5>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Passport turnaround is ~6 weeks. Renew 6 months before validity.</p>
            </div>
            <button className="min-touch px-3 py-1.5 rounded-xl bg-surface-container-lowest text-primary font-label-sm text-label-sm font-bold hover:bg-surface-bright transition-colors shrink-0 shadow-xs border border-primary-fixed/30 flex items-center justify-center">
              Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
