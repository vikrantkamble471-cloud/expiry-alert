import { ExpiryItem, CATEGORY_META } from '../types';
import { getDaysDiff, getDaysRemainingLabel, formatDisplayDate } from '../lib/dateUtils';

type Props = {
  item: ExpiryItem;
  onClick: () => void;
};

export default function ExpiryCard({ item, onClick }: Props) {
  const days = getDaysDiff(item.expiryDate);
  const isExpired = days < 0;
  const isToday = days === 0;
  const isSoon = days > 0 && days <= 7;

  const meta = CATEGORY_META[item.category] || CATEGORY_META.Other;
  const formattedDate = formatDisplayDate(item.expiryDate);
  const daysLabel = getDaysRemainingLabel(days);

  let statusBadge = null;
  let pillBg = "";
  let borderHighlight = "";
  let progressPercent = 0;
  let progressColor = "bg-primary-container";
  let progressText = null;

  if (isExpired) {
    statusBadge = (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-error font-label-sm text-[11px] font-bold">
        Expired
      </span>
    );
    pillBg = "bg-error-container text-on-error-container font-bold";
    borderHighlight = "border-l-4 border-l-error";
    progressPercent = 100;
    progressColor = "bg-error";
    progressText = <span className="font-label-sm text-[11px] text-error font-semibold">Lapsed</span>;
  } else if (isToday) {
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-label-sm text-[11px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>Expires Today
      </span>
    );
    pillBg = "bg-red-500 text-white font-bold animate-pulse";
    borderHighlight = "border-l-4 border-l-red-500 ring-1 ring-red-200";
    progressPercent = 100;
    progressColor = "bg-red-500";
    progressText = <span className="font-label-sm text-[11px] text-red-600 font-bold">Expires at end of day</span>;
  } else if (isSoon) {
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-container font-label-sm text-[11px] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>Expiring Soon
      </span>
    );
    pillBg = "bg-primary-fixed text-on-primary-container font-bold";
    borderHighlight = "border-l-4 border-l-primary-container";
    progressPercent = Math.max(15, Math.min(95, Math.round(((30 - days) / 30) * 100)));
    progressColor = "bg-primary-container";
    progressText = <span className="font-label-sm text-[11px] text-primary font-medium">{progressPercent}% consumed</span>;
  } else {
    statusBadge = (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-sm text-[11px]">
        Safe
      </span>
    );
    pillBg = "bg-tertiary-fixed text-on-tertiary-container font-bold";
    borderHighlight = "hover:border-tertiary-container/30";
    progressPercent = Math.max(10, Math.min(80, Math.round(((60 - days) / 60) * 100)));
    progressColor = "bg-tertiary-container";
    progressText = <span className="font-label-sm text-[11px] text-tertiary font-medium">Safe &bull; {days} days</span>;
  }

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`group relative flex flex-col p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container-high/60 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer ${borderHighlight}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`relative w-12 h-12 shrink-0 rounded-2xl ${meta.bg} flex items-center justify-center ${meta.text} shadow-xs`}>
            <span className="material-symbols-outlined text-[24px]">{meta.icon}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${meta.badgeBg} ${meta.text} font-label-sm text-[11px] font-medium`}>
                {item.category}
              </span>
              {statusBadge}
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate mt-1">{item.title}</h4>
            <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm mt-0.5">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-outline">calendar_today</span>
                <span>{formattedDate}</span>
              </span>
              <span className="text-outline-variant">•</span>
              <span className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">notifications</span>
                <span>{item.reminder || '1d before'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className={`px-2.5 py-1 rounded-full ${pillBg} font-label-sm text-label-sm`}>
            {daysLabel}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            aria-label="Item menu"
            className="min-touch w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-surface-container/60 flex items-center justify-between gap-3">
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
          <div className={`${progressColor} h-full rounded-full`} style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="whitespace-nowrap shrink-0">
          {progressText}
        </div>
      </div>
    </div>
  );
}
