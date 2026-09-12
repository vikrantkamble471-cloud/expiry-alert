export function getDateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${day}`;
}

export function getDaysDiff(targetDateStr: string) {
  if (!targetDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parts = targetDateStr.split('-');
  const target = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getDaysRemainingLabel(days: number) {
  if (days < 0) {
    const abs = Math.abs(days);
    return abs === 1 ? "1d ago" : `${abs}d ago`;
  }
  if (days === 0) return "Expires today";
  if (days === 1) return "1 day left";
  return `In ${days} days`;
}

export function formatDisplayDate(dateStr: string) {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
