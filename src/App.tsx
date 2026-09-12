import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider } from './context/AppContext';
import DashboardView from './views/DashboardView';
import SavedView from './views/SavedView';
import SettingsView from './views/SettingsView';
import { AddEditModal, DetailModal } from './components/Modals';
import { ExpiryItem } from './types';
import { useAppContext } from './context/AppContext';
import { getDaysDiff, getDaysRemainingLabel, formatDisplayDate } from './lib/dateUtils';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'saved' | 'settings'>('dashboard');
  const [savedFilter, setSavedFilter] = useState('all');
  const [isSplashOpen, setIsSplashOpen] = useState(true);
  
  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpiryItem | undefined>(undefined);
  const [detailItem, setDetailItem] = useState<ExpiryItem | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const { items, user, setUser } = useAppContext();

  useEffect(() => {
    setTimeout(() => setIsSplashOpen(false), 800);
  }, []);

  const openAdd = () => {
    setEditingItem(undefined);
    setAddModalOpen(true);
  };

  const openEdit = (item: ExpiryItem) => {
    setEditingItem(item);
    setDetailItem(null);
    setTimeout(() => setAddModalOpen(true), 50); // slight delay to unmount detail
  };

  const urgentItems = items.filter(it => getDaysDiff(it.expiryDate) <= 7).sort((a, b) => getDaysDiff(a.expiryDate) - getDaysDiff(b.expiryDate));

  return (
    <div className="min-h-screen bg-surface">
      <AnimatePresence>
        {isSplashOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface pointer-events-none"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-xl ring-2 ring-primary-container/20 flex items-center justify-center bg-primary-container">
                <span className="material-symbols-outlined text-[42px] text-white">event_available</span>
              </div>
              <div className="text-center space-y-1">
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Expiry Alert</h1>
                <p className="font-body-sm text-on-surface-variant">Smart Expiration Tracker</p>
              </div>
              <div className="w-32 h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-3">
                <div className="w-full h-full bg-primary-container rounded-full animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="fixed top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-16 px-gutter flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-primary-container/20 bg-primary-container flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">event_available</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">Expiry Alert</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[10px]">PWA</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-container font-label-sm text-[10px] font-bold">Beta</span>
              </div>
              <span className="font-body-sm text-[12px] text-on-surface-variant truncate">Smart Expiration Tracker</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setNotifOpen(true)} className="min-touch relative flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {urgentItems.length > 0 && (
                <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container"></span>
                </span>
              )}
            </button>
            <button onClick={() => setActiveTab('settings')} className="min-touch flex items-center justify-center rounded-full hover:ring-2 hover:ring-primary-container/30 transition-all p-0.5">
              <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold shadow-sm ring-1 ring-white">
                {user.name.charAt(0)}
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full min-h-screen pt-20 pb-28 bg-surface max-w-7xl mx-auto px-gutter overflow-x-hidden">
        {activeTab === 'dashboard' && (
          <DashboardView 
            onFilterClick={(filter) => { setSavedFilter(filter); setActiveTab('saved'); window.scrollTo(0, 0); }} 
            onItemClick={(id) => setDetailItem(items.find(i => i.id === id) || null)} 
            onAddClick={openAdd} 
          />
        )}
        {activeTab === 'saved' && (
          <SavedView 
            filter={savedFilter} 
            onFilterChange={setSavedFilter} 
            onItemClick={(id) => setDetailItem(items.find(i => i.id === id) || null)} 
            onAddClick={openAdd} 
          />
        )}
        {activeTab === 'settings' && <SettingsView onAuthClick={() => setAuthOpen(true)} />}
      </main>

      <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-surface-container-high/70 shadow-[0_-4px_16px_rgba(15,23,42,0.04)]">
        <div className="relative flex justify-around items-center h-16 max-w-lg mx-auto px-gutter">
          <button onClick={() => { setActiveTab('dashboard'); window.scrollTo(0, 0); }} className={`min-touch flex flex-col items-center justify-center w-16 h-14 transition-colors font-label-md ${activeTab === 'dashboard' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-[22px]">home</span>
            <span className="font-label-md text-[11px]">Dashboard</span>
          </button>
          <button onClick={() => { setActiveTab('saved'); window.scrollTo(0, 0); }} className={`min-touch flex flex-col items-center justify-center w-16 h-14 transition-colors ${activeTab === 'saved' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-[22px]">folder</span>
            <span className="font-label-md text-[11px]">Saved</span>
          </button>
          <div className="relative flex items-center justify-center w-16 h-14">
            <button onClick={openAdd} aria-label="Add Expiry" className="min-touch absolute -top-5 flex items-center justify-center w-[52px] h-[52px] rounded-full bg-primary-container text-on-primary shadow-[0_6px_18px_rgba(249,115,22,0.45)] hover:bg-primary transition-transform active:scale-95 focus:outline-none">
              <span className="material-symbols-outlined text-[28px]">add</span>
            </button>
          </div>
          <button onClick={() => { setActiveTab('settings'); window.scrollTo(0, 0); }} className={`min-touch flex flex-col items-center justify-center w-16 h-14 transition-colors ${activeTab === 'settings' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-[22px]">settings</span>
            <span className="font-label-md text-[11px]">Settings</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {addModalOpen && <AddEditModal isOpen={true} onClose={() => setAddModalOpen(false)} editItem={editingItem} />}
        {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} onEdit={() => openEdit(detailItem)} />}
      </AnimatePresence>

      {notifOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-xs p-3">
          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-4 shadow-2xl mt-14 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Alerts & Reminders</h4>
              </div>
              <button onClick={() => setNotifOpen(false)} className="min-touch w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col space-y-2 max-h-80 overflow-y-auto pr-1">
              {urgentItems.length === 0 ? (
                <div className="p-3 text-center text-body-sm text-on-surface-variant">No new expiry notifications.</div>
              ) : (
                urgentItems.slice(0, 5).map(item => (
                  <div key={item.id} onClick={() => { setNotifOpen(false); setDetailItem(item); }} className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer flex items-center justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="font-headline-sm text-[13px] text-on-surface truncate">{item.title}</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">{item.category} • {formatDisplayDate(item.expiryDate)}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full ${getDaysDiff(item.expiryDate) <= 0 ? 'bg-error text-white' : 'bg-primary-container text-white'} text-[10px] font-bold shrink-0`}>
                      {getDaysRemainingLabel(getDaysDiff(item.expiryDate))}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setNotifOpen(false)} className="w-full min-touch py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors text-center">
              Mark all as reviewed
            </button>
          </motion.div>
        </div>
      )}

      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Account Sign In</h3>
              </div>
              <button onClick={() => setAuthOpen(false)} className="min-touch w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get('name') as string;
              const email = formData.get('email') as string;
              if (name && email) {
                setUser({ name, email, id: email.toLowerCase().replace(/[^a-z0-9]/g, '_') });
                setAuthOpen(false);
              }
            }} className="space-y-3">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Full Name</label>
                <input name="name" defaultValue={user.name} required type="text" className="w-full min-touch h-11 px-3 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface text-body-sm focus:border-primary-container focus:outline-none" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Email</label>
                <input name="email" defaultValue={user.email} required type="email" className="w-full min-touch h-11 px-3 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface text-body-sm focus:border-primary-container focus:outline-none" />
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button type="submit" className="w-full min-touch h-11 rounded-xl bg-primary-container text-on-primary font-headline-sm text-[14px] hover:bg-primary shadow-sm">
                  Save & Switch Account
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
