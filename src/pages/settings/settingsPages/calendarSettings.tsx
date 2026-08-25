import { useMemo, useState } from 'react';

interface HolidayMap {
  [date: string]: string;
}

const initialHolidays: HolidayMap = {
  '2026-08-21': 'National Heroes Day',
  '2026-08-25': 'Special Non-Working Holiday',
};

const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);

function CalendarSettings() {
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [holidays, setHolidays] = useState<HolidayMap>(initialHolidays);

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [selectedMonth]);

  const toggleHoliday = (day: number) => {
    const dateKey = `${selectedMonth}-${String(day).padStart(2, '0')}`;

    setHolidays((current) => {
      if (current[dateKey]) {
        const next = { ...current };
        delete next[dateKey];
        return next;
      }

      return { ...current, [dateKey]: 'Holiday' };
    });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Calendar Settings</h3>
        <button
          type="button"
          onClick={() => setSelectedMonth('2026-08')}
          className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          August 2026
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{monthLabel}</span>
        <span className="text-xs text-slate-500">Click a date to mark or unmark a holiday.</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
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
              className={`relative flex h-12 items-center justify-center rounded-md border text-sm transition ${
                isHoliday
                  ? 'border-red-200 bg-red-50 text-red-700 line-through'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
              title={isHoliday ? holidays[dateKey] : 'Mark as holiday'}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Holiday list</p>
        <div className="space-y-1">
          {Object.entries(holidays).length === 0 ? (
            <p className="text-sm text-slate-500">No holidays marked.</p>
          ) : (
            Object.entries(holidays).map(([date, label]) => (
              <div key={date} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-2 py-1 text-sm">
                <span className="font-medium text-slate-700">{date}</span>
                <span className="text-slate-500">{label}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default CalendarSettings;
