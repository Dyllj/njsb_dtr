import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="flex items-center justify-center py-12" aria-live="polite">
        <Loader2 className="animate-spin size-8 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading calendar...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Schedule</h1>
            <p className="text-sm text-muted-foreground">Holiday calendar and scheduled events</p>
          </div>
          <Button variant="outline" size="sm" onClick={goToday}>
            Today
          </Button>
        </div>
      </header>

      {error && (
        <p className="mb-4 text-sm text-destructive" role="alert">Failed to load holidays: {error.message}</p>
      )}

      <section aria-labelledby="calendar-heading" className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            aria-label="Previous month"
            className="text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden="true">‹</span>
            <span className="sr-only">Previous month</span>
          </Button>
          <h2 id="calendar-heading" className="text-lg font-semibold text-foreground">{monthLabel}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            aria-label="Next month"
            className="text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden="true">›</span>
            <span className="sr-only">Next month</span>
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 pt-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground" role="row">
          {weekdayLabels.map((label) => (
            <div key={label} role="columnheader">{label}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 pt-1 pb-4" role="grid">
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
                <button
                  key={`${wi}-${di}`}
                  type="button"
                  className={[
                    'relative h-11 w-full rounded-lg border p-1 transition-colors text-left',
                    inCurrentMonth ? 'text-foreground bg-card' : 'text-muted-foreground/50 bg-muted/50',
                    isToday && inCurrentMonth ? 'border-primary bg-primary/10' : 'border-transparent',
                    holidayName ? 'relative' : '',
                  ].join(' ')}
                  aria-label={holidayName ? `${day.getDate()} ${monthLabel}, ${holidayName}` : `${day.getDate()} ${monthLabel}`}
                  aria-selected={isToday && inCurrentMonth}
                >
                  <span className="absolute top-1 left-1 text-sm">{day.getDate()}</span>
                  {holidayName && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-full">
                      <div className="h-1 w-5 rounded-full bg-destructive mx-auto" title={holidayName} aria-hidden="true" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {Object.keys(holidays).length > 0 && (
          <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm" aria-labelledby="holidays-heading">
            <h3 id="holidays-heading" className="sr-only">Holidays this month</h3>
            {Object.entries(holidays)
              .sort(([a], [b]) => (a < b ? -1 : 1))
              .map(([date, name]) => (
                <div key={date} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent">
                  <time dateTime={date} className="font-medium text-foreground">{date}</time>
                  <span className="text-muted-foreground">{name}</span>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Schedule;
