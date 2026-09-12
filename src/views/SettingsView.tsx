import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function SettingsView({ onAuthClick }: { onAuthClick: () => void }) {
  const { user, clearAll, resetToSeed, items } = useAppContext();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.classList.add('light');
      setTheme('light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      setTheme('dark');
    }
  };

  const exportDataJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `expiry_alert_backup_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col w-full space-y-5">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Settings</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Preferences & PWA controls</p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-surface-container-high/60 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xl ring-2 ring-primary-fixed">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">{user.name}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{user.email}</span>
            </div>
          </div>
          <button onClick={onAuthClick} className="min-touch px-3 py-1.5 rounded-xl bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors">
            Switch
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between min-h-[44px]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-outline">dark_mode</span>
              <span className="font-body-md text-body-md text-on-surface">Appearance (Dark Mode)</span>
            </div>
            <button onClick={toggleDarkMode} className="min-touch px-3 py-1.5 rounded-xl bg-surface-container text-on-surface font-label-sm font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          </div>
          <div className="flex items-center justify-between min-h-[44px]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-outline">notifications_active</span>
              <span className="font-body-md text-body-md text-on-surface">Push Alerts</span>
            </div>
            <input type="checkbox" defaultChecked className="min-touch rounded text-primary-container focus:ring-primary-container w-5 h-5 accent-primary-container" />
          </div>
          <div className="flex items-center justify-between min-h-[44px]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-outline">schedule</span>
              <span className="font-body-md text-body-md text-on-surface">Default Reminder</span>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-semibold">1 day before</span>
          </div>
          <div className="flex items-center justify-between min-h-[44px]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-outline">cloud_sync</span>
              <span className="font-body-md text-body-md text-on-surface">Offline Sync Support</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span> Active
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-sm border border-surface-container-high/60 space-y-3">
        <h4 className="font-headline-sm text-headline-sm text-on-surface">Data Management</h4>
        <div className="flex flex-col gap-2">
          <button onClick={exportDataJSON} className="w-full min-touch h-11 rounded-xl bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Data (.JSON)</span>
          </button>
          <div className="flex gap-2">
            <button onClick={() => confirm("Reset to demo data?") && resetToSeed()} className="flex-1 min-touch h-11 rounded-xl bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold hover:bg-surface-container transition-colors">
              Reset Demo Data
            </button>
            <button onClick={() => confirm("Clear all data?") && clearAll()} className="flex-1 min-touch h-11 rounded-xl bg-red-50 text-error font-label-sm text-label-sm font-semibold hover:bg-red-100 transition-colors">
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
