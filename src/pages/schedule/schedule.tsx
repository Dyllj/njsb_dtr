import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { useHolidays } from '@/lib/hooks/useSupabaseData';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getCalendarMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const daysInMonth = last.getDate();

  const matrix: Date[][] = [];
  let week: Date[] = [];

  const prevMonthEnd = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    week.push(new Date(year, month - 1, prevMonthEnd - i));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  let nextDay = 1;
  while (week.length > 0 && week.length < 7) {
    week.push(new Date(year, month + 1, nextDay++));
  }
  if (week.length === 7) matrix.push(week);

  while (matrix.length < 6) {
    const lastWeek = matrix[matrix.length - 1];
    const base = lastWeek ? lastWeek[6] : new Date(year, month, daysInMonth);
    const nextWeek: Date[] = [];
    for (let i = 1; i <= 7; i++) nextWeek.push(new Date(base.getTime() + i * 24 * 60 * 60 * 1000));
    matrix.push(nextWeek);
  }

  return matrix;
}

function Schedule() {
  const { holidays, loading, error } = useHolidays();
  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(today);

  const matrix = getCalendarMatrix(viewDate.getFullYear(), viewDate.getMonth());
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  function prevMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  }
  function goToday() {
    setViewDate(today);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Schedule</h2>
          <p className="text-sm text-slate-500">Holiday calendar and scheduled events</p>
        </div>
        <button
          onClick={goToday}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-red-800 hover:text-red-800"
        >
          Today
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-destructive">Failed to load holidays: {error.message}</p>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-2 py-3">
          <button
            onClick={prevMonth}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            ‹
          </button>
          <h3 className="text-lg font-semibold text-slate-900">{monthLabel}</h3>
          <button
            onClick={nextMonth}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 pt-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          {weekdayLabels.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {matrix.map((week, wi) =>
            week.map((day, di) => {
              const inCurrentMonth = day.getMonth() === viewDate.getMonth();
              const isToday =
                day.getDate() === today.getDate() &&
                day.getMonth() === today.getMonth() &&
                day.getFullYear() === today.getFullYear();

              const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
              const holidayName = holidays[dateKey];

              return (
                <div
                  key={`${wi}-${di}`}
                  className={[
                    'relative h-11 rounded-lg border border-transparent p-1 transition-colors',
                    inCurrentMonth ? 'text-slate-700' : 'text-slate-300',
                    isToday && inCurrentMonth ? 'border-red-400 bg-red-50/30' : '',
                  ].join(' ')}
                >
                  <span className="absolute top-1 left-1 text-sm">{day.getDate()}</span>
                  {holidayName && (
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-full">
                      <div className="h-1 w-5 rounded-full bg-red-500 mx-auto" title={holidayName} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {Object.keys(holidays).length > 0 && (
          <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
            {Object.entries(holidays)
              .sort(([a], [b]) => (a < b ? -1 : 1))
              .map(([date, name]) => (
                <div key={date} className="flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-slate-50">
                  <span className="font-medium">{date}</span>
                  <span className="text-slate-500">{name}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;
