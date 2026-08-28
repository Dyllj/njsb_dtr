import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { useHolidays } from '@/lib/hooks/useSupabaseData';

const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CalendarSettings() {
  const { holidays, loading, error, toggle } = useHolidays();
  const [selectedMonth, setSelectedMonth] = useState('2026-08');

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [selectedMonth]);

  const toggleHoliday = (day: number) => {
    const dateKey = `${selectedMonth}-${String(day).padStart(2, '0')}`;
    const isHoliday = Boolean(holidays[dateKey]);
    const holidayName = isHoliday ? holidays[dateKey] : 'Holiday';

    toggle(dateKey, holidayName, isHoliday);
  };

  const holidayEntries = Object.entries(holidays);

  if (loading) {
    return (
      <section className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Loading calendar...</div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Calendar Settings</h3>
          <p className="text-xs text-muted-foreground">Click a date to mark or unmark a holiday.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{holidayEntries.length} holidays</Badge>
          <Button type="button" variant="outline" size="sm" onClick={() => setSelectedMonth('2026-08')}>
            {monthLabel}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">Failed to load holidays: {error.message}</p>
      )}

      <div className="grid grid-cols-7 gap-1.5">
        {weekdayLabels.map((day) => (
          <div
            key={day}
            className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((dayNumber) => {
          const dateKey = `${selectedMonth}-${String(dayNumber).padStart(2, '0')}`;
          const isHoliday = Boolean(holidays[dateKey]);

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => toggleHoliday(dayNumber)}
              title={isHoliday ? holidays[dateKey] : 'Mark as holiday'}
              className={cn(
                'flex aspect-square items-center justify-center rounded-md border text-sm transition-colors',
                isHoliday
                  ? 'border-destructive/30 bg-destructive/10 text-destructive line-through'
                  : 'border-border bg-background text-foreground hover:bg-muted'
              )}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Holiday list
        </p>
        {holidayEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No holidays marked.</p>
        ) : (
          <div className="space-y-1.5">
            {holidayEntries.map(([date, label]) => (
              <div
                key={date}
                className="flex items-center justify-between rounded-md border border-border bg-background px-2.5 py-1.5 text-sm"
              >
                <span className="font-medium text-foreground">{date}</span>
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CalendarSettings;
