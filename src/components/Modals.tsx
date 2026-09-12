import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { ExpiryItem, Category } from '../types';
import { getDateString, getDaysDiff, getDaysRemainingLabel, formatDisplayDate } from '../lib/dateUtils';
import { CATEGORY_META } from '../types';

export function AddEditModal({
  isOpen,
  onClose,
  editItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  editItem?: ExpiryItem;
}) {
  const { addItem, updateItem } = useAppContext();
  
  const [title, setTitle] = useState(editItem?.title || '');
  const [category, setCategory] = useState<Category>(editItem?.category || 'Medicines');
  const [expiryDate, setExpiryDate] = useState(editItem?.expiryDate || getDateString(7));
  const [reminder, setReminder] = useState(editItem?.reminder || '1 day before');
  const [notes, setNotes] = useState(editItem?.notes || '');

  // Reset form when opened with a new item or empty
  // Not strictly using useEffect here, could just reset on close.

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !expiryDate) return;
    
    if (editItem) {
      updateItem(editItem.id, { title, category, expiryDate, reminder, notes });
    } else {
      addItem({ title, category, expiryDate, reminder, notes });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-surface-container-lowest w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[92vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">{editItem ? 'edit' : 'event_note'}</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{editItem ? 'Edit Expiry' : 'Add New Expiry'}</h3>
          </div>
          <button onClick={onClose} className="min-touch w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-4 overflow-y-auto pr-1">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Item Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full min-touch h-11 px-3.5 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface text-body-md focus:border-primary-container focus:outline-none" placeholder="e.g. Amoxicillin, Passport, Netflix..." required type="text" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Category *</label>
              <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full min-touch h-11 px-3 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface text-body-sm focus:border-primary-container focus:outline-none">
                <option value="Medicines">Medicines</option>
                <option value="Documents">Documents</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Warranties">Warranties</option>
                <option value="Insurance">Insurance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Expiry Date *</label>
              <input value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full min-touch h-11 px-3 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface text-body-sm focus:border-primary-container focus:outline-none" required type="date" />
            </div>
          </div>
          <div>
            <span className="block font-label-sm text-[11px] text-on-surface-variant mb-1.5 font-medium">Quick Date Presets</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[3, 7, 30, 365].map(days => (
                <button key={days} onClick={() => setExpiryDate(getDateString(days))} className="min-touch h-9 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-container font-label-sm text-[11px] font-semibold transition-colors flex items-center justify-center" type="button">
                  +{days === 365 ? '1 Year' : `${days} Days`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Reminder Schedule</label>
            <select value={reminder} onChange={e => setReminder(e.target.value)} className="w-full min-touch h-11 px-3 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface text-body-sm focus:border-primary-container focus:outline-none">
              <option value="On expiry day">🔔 On expiry day</option>
              <option value="1 day before">🔔 1 day before</option>
              <option value="3 days before">🔔 3 days before</option>
              <option value="1 week before">🔔 1 week before</option>
              <option value="2 weeks before">🔔 2 weeks before</option>
              <option value="1 month before">🔔 1 month before</option>
            </select>
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Notes / Instructions (optional)</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} className="w-full min-touch h-11 px-3.5 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface text-body-sm focus:border-primary-container focus:outline-none" placeholder="e.g. In kitchen cabinet shelf 2" type="text" />
          </div>
          <div className="pt-3 flex gap-2">
            <button onClick={onClose} className="flex-1 min-touch h-11 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors" type="button">
              Cancel
            </button>
            <button className="flex-1 min-touch h-11 rounded-xl bg-primary-container text-on-primary font-headline-sm text-headline-sm hover:bg-primary shadow-sm active:scale-[0.98] transition-all" type="submit">
              Save Expiry
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function DetailModal({
  item,
  onClose,
  onEdit,
}: {
  item: ExpiryItem | null;
  onClose: () => void;
  onEdit: () => void;
}) {
  const { deleteItem } = useAppContext();

  if (!item) return null;

  const days = getDaysDiff(item.expiryDate);
  const isExpired = days < 0;
  const isToday = days === 0;
  const meta = CATEGORY_META[item.category] || CATEGORY_META.Other;

  let statusBoxClass = "p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between";
  let statusText = "Safe & Active";
  let statusTextClass = "font-label-md text-label-md text-tertiary font-semibold";
  let statusPillClass = "px-2.5 py-1 rounded-full bg-tertiary text-white font-label-sm text-label-sm font-bold";
  let statusIcon = "verified";
  let statusIconClass = "material-symbols-outlined text-tertiary text-[20px]";

  if (isExpired) {
    statusBoxClass = "p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between";
    statusText = "Expired & Overdue";
    statusTextClass = "font-label-md text-label-md text-error font-semibold";
    statusPillClass = "px-2.5 py-1 rounded-full bg-error text-white font-label-sm text-label-sm font-bold";
    statusIcon = "warning";
    statusIconClass = "material-symbols-outlined text-error text-[20px]";
  } else if (isToday) {
    statusBoxClass = "p-3 rounded-2xl bg-red-50 border border-red-300 flex items-center justify-between animate-pulse";
    statusText = "Expires Today!";
    statusTextClass = "font-label-md text-label-md text-red-700 font-bold";
    statusPillClass = "px-2.5 py-1 rounded-full bg-red-600 text-white font-label-sm text-label-sm font-bold";
    statusIcon = "notifications_active";
    statusIconClass = "material-symbols-outlined text-red-600 text-[20px]";
  } else if (days <= 7) {
    statusBoxClass = "p-3 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between";
    statusText = "Expiring Soon";
    statusTextClass = "font-label-md text-label-md text-primary font-semibold";
    statusPillClass = "px-2.5 py-1 rounded-full bg-primary-container text-white font-label-sm text-label-sm font-bold";
    statusIcon = "schedule";
    statusIconClass = "material-symbols-outlined text-primary text-[20px]";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-surface-container-lowest w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-start justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${meta.bg} ${meta.text} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-[24px]">{meta.icon}</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.title}</h3>
              <span className="inline-block px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[11px] mt-0.5">{item.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="min-touch w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="space-y-4 py-4">
          <div className={statusBoxClass}>
            <div className="flex items-center gap-2">
              <span className={statusIconClass}>{statusIcon}</span>
              <span className={statusTextClass}>{statusText}</span>
            </div>
            <span className={statusPillClass}>{getDaysRemainingLabel(days)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-body-sm">
            <div className="p-3 rounded-xl bg-surface-container-low">
              <span className="text-on-surface-variant text-[11px] block">Expiry Date</span>
              <span className="font-semibold text-on-surface mt-0.5 block">{formatDisplayDate(item.expiryDate)}</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low">
              <span className="text-on-surface-variant text-[11px] block">Reminder</span>
              <span className="font-semibold text-on-surface mt-0.5 block">{item.reminder || '1 day before'}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low">
            <span className="text-on-surface-variant text-[11px] block">Notes / Details</span>
            <p className="text-on-surface text-body-sm mt-0.5">{item.notes || 'No additional notes added.'}</p>
          </div>
        </div>
        <div className="pt-2 flex gap-2">
          <button onClick={onEdit} className="flex-1 min-touch h-11 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>Edit</span>
          </button>
          <button onClick={() => {
            if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
              deleteItem(item.id);
              onClose();
            }
          }} className="flex-1 min-touch h-11 rounded-xl bg-red-50 text-error font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors">
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span>Delete</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
