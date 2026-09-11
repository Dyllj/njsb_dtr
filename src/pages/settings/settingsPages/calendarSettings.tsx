import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useHolidays } from '@/lib/hooks/useSupabaseData';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

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
    for (let i = 1; i <= 7; i++) {
      nextWeek.push(new Date(base.getTime() + i * 24 * 60 * 60 * 1000));
    }
    matrix.push(nextWeek);
  }

  return matrix;
}

function CalendarSettings() {
  const { holidays, loading, error, toggle } = useHolidays();
  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(startOfMonth(today));

  const matrix = useMemo(
    () => getCalendarMatrix(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );

  function prevMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  }

  const toggleHoliday = (day: Date) => {
    const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    const isHoliday = Boolean(holidays[dateKey]);
    const holidayName = isHoliday ? holidays[dateKey] : 'Holiday';

    toggle(dateKey, holidayName, isHoliday);
  };

  const holidayEntries = Object.entries(holidays);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" aria-live="polite">
        <span className="text-sm text-muted-foreground">Loading calendar...</span>
        <span className="sr-only">Loading calendar settings...</span>
      </div>
    );
  }

  return (
    <section aria-labelledby="calendar-settings-heading" className="flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 id="calendar-settings-heading" className="text-base font-semibold text-foreground">Calendar Settings</h2>
          <p className="mt-1 text-xs text-muted-foreground">Click a date to mark or unmark a holiday.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{holidayEntries.length} holidays</Badge>
        </div>
      </header>

      {error && (
        <p className="text-sm text-destructive" role="alert">Failed to load holidays: {error.message}</p>
      )}

      <section aria-labelledby="calendar-settings-calendar-heading" className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <CalendarCheck2 className="h-5 w-5 text-primary" aria-hidden="true" />
            {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              aria-label="Previous month"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              aria-label="Next month"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border px-3 pt-3" role="row">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              role="columnheader"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 p-3" role="grid">
          {matrix.map((week, wi) =>
            week.map((day, di) => {
              const inCurrentMonth = day.getMonth() === viewDate.getMonth();
              const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
              const isHoliday = Boolean(holidays[dateKey]);
              const isWeekendCol = di === 0 || di === 6;

              return (
                <div key={`${wi}-${di}`} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleHoliday(day)}
                    title={isHoliday ? holidays[dateKey] : 'Mark as holiday'}
                    aria-pressed={isHoliday}
                    aria-label={`Mark ${dateKey} as holiday`}
                    className={[
                      'flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-lg text-sm transition-colors',
                      inCurrentMonth ? 'text-foreground' : 'text-muted-foreground',
                      isWeekendCol && inCurrentMonth ? 'bg-muted/50' : '',
                      isHoliday ? 'bg-destructive/10 text-destructive line-through' : 'hover:bg-accent',
                    ].join(' ')}
                  >
                    <span className={`font-medium ${isHoliday ? 'text-destructive' : ''}`}>
                      {day.getDate()}
                    </span>
                    {isHoliday && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-destructive"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-border px-5 py-3 text-xs text-muted-foreground" aria-label="Legend">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
            Holiday
          </span>
        </div>
      </section>

      <div className="rounded-lg border border-border bg-muted/40 p-3 sm:p-4" aria-labelledby="holiday-list-heading">
        <h3 id="holiday-list-heading" className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Holiday list
        </h3>
        {holidayEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No holidays marked.</p>
        ) : (
          <ul className="space-y-1.5" role="list">
            {holidayEntries.map(([date, label]) => (
              <li
                key={date}
                className="flex items-center justify-between rounded-md border border-border bg-background px-2.5 py-1.5 text-sm"
              >
                <time dateTime={date} className="font-medium text-foreground">{date}</time>
                <span className="text-muted-foreground">{label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default CalendarSettings;