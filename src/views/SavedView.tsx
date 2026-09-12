import { useAppContext } from '../context/AppContext';
import ExpiryCard from '../components/ExpiryCard';
import { getDaysDiff } from '../lib/dateUtils';

export default function SavedView({
  filter,
  onFilterChange,
  onItemClick,
  onAddClick,
}: {
  filter: string;
  onFilterChange: (filter: string) => void;
  onItemClick: (id: string) => void;
  onAddClick: () => void;
}) {
  const { items } = useAppContext();

  let expiredCount = 0, soonCount = 0, safeCount = 0;
  items.forEach(it => {
    const d = getDaysDiff(it.expiryDate);
    if (d < 0) expiredCount++;
    else if (d <= 7) soonCount++;
    else safeCount++;
  });

  let filtered = [...items];
  let subtitle = `Showing all ${items.length} tracked items`;

  if (filter === 'soon') {
    filtered = filtered.filter(i => {
      const d = getDaysDiff(i.expiryDate);
      return d >= 0 && d <= 7;
    });
    subtitle = "Filtered: Expiring within 7 days";
  } else if (filter === 'expired') {
    filtered = filtered.filter(i => getDaysDiff(i.expiryDate) < 0);
    subtitle = "Filtered: Past due items";
  } else if (filter === 'safe') {
    filtered = filtered.filter(i => getDaysDiff(i.expiryDate) > 7);
    subtitle = "Filtered: Safe items (>7 days)";
  } else if (filter.startsWith('cat:')) {
    const targetCategory = filter.replace('cat:', '');
    filtered = filtered.filter(i => i.category.toLowerCase() === targetCategory.toLowerCase());
    subtitle = `Filtered category: ${targetCategory}`;
  }

  filtered.sort((a, b) => getDaysDiff(a.expiryDate) - getDaysDiff(b.expiryDate));

  const isCat = filter.startsWith('cat:');
  const activePill = isCat ? 'all' : filter;

  const Pill = ({ id, label, count }: { id: string; label: string; count: number }) => {
    const isActive = activePill === id;
    return (
      <button
        onClick={() => onFilterChange(id)}
        className={`min-touch px-3.5 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all ${
          isActive ? 'bg-primary-container text-on-primary font-bold' : 'bg-surface-container-high text-on-surface-variant font-medium'
        }`}
      >
        {label} ({count})
      </button>
    );
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">All Expiries</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{subtitle}</p>
        </div>
        <button onClick={onAddClick} className="min-touch h-10 px-4 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-gutter px-gutter no-scrollbar">
        <Pill id="all" label="All" count={items.length} />
        <Pill id="soon" label="Expiring Soon" count={soonCount} />
        <Pill id="expired" label="Expired" count={expiredCount} />
        <Pill id="safe" label="Safe" count={safeCount} />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="material-symbols-outlined text-[36px] text-outline mb-2">filter_alt_off</span>
          <p className="font-body-md text-body-md text-on-surface-variant">No items found matching this filter.</p>
          <button onClick={() => onFilterChange('all')} className="mt-3 min-touch font-label-md text-label-md text-primary font-bold inline-flex items-center justify-center px-4 py-2">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          {filtered.map(item => <ExpiryCard key={item.id} item={item} onClick={() => onItemClick(item.id)} />)}
        </div>
      )}
    </div>
  );
}
