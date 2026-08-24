import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getCalendarMatrix(year: number, month: number) {
  // returns array of weeks; each week is array of Date objects (7 days)
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = last.getDate();

  const matrix: Date[][] = [];
  let week: Date[] = [];

  // Fill previous month's tail days
  const prevMonthEnd = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    week.push(new Date(year, month - 1, prevMonthEnd - i));
  }

  // Fill current month
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  // Fill next month's head days
  let nextDay = 1;
  while (week.length > 0 && week.length < 7) {
    week.push(new Date(year, month + 1, nextDay++));
  }
  if (week.length === 7) matrix.push(week);

  // Ensure matrix has at least 6 weeks to keep layout stable on all months
  while (matrix.length < 6) {
    const lastWeek = matrix[matrix.length - 1];
    const base = lastWeek ? lastWeek[6] : new Date(year, month, daysInMonth);
    const nextWeek: Date[] = [];
    for (let i = 1; i <= 7; i++) nextWeek.push(addDays(base, i));
    matrix.push(nextWeek);
  }

  return matrix;
}

export default function Attendance() {
  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(startOfMonth(today));
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const matrix = useMemo(() => getCalendarMatrix(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  function goToday() {
    setViewDate(startOfMonth(today));
  }

  function toggleDate(date: Date) {
    setSelectedDates((prev) => {
      const exists = prev.find((p) => sameDay(p, date));
      if (exists) return prev.filter((p) => !sameDay(p, date));
      return [...prev, date];
    });
  }

  return (
    <div className="w-100% min-h-screen p-4 bg-slate-50">
      <div className="max-w-screen mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Attendance</h2>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} aria-label="Previous month" className="p-2 rounded-md hover:bg-slate-100 text-slate-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={goToday} aria-label="Refresh month" className="p-2 rounded-md hover:bg-slate-100 text-slate-700">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} aria-label="Next month" className="p-2 rounded-md hover:bg-slate-100 text-slate-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="text-lg font-medium">
              {viewDate.toLocaleString(undefined, { month: 'long' })} {viewDate.getFullYear()}
            </div>
            <div className="text-sm text-slate-500">Click a date to toggle attendance</div>
          </div>

          <div className="px-3 pb-6">
            <div className="grid grid-cols-7 gap-1 mt-3 text-center">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
                <div key={d} className="text-xs font-medium text-slate-600 py-2">{d}</div>
              ))}

              {matrix.map((week, wi) => (
                <React.Fragment key={wi}>
                  {week.map((day, di) => {
                    const inCurrentMonth = day.getMonth() === viewDate.getMonth();
                    const isToday = sameDay(day, today);
                    const isSelected = selectedDates.some((s) => sameDay(s, day));
                    return (
                      <button
                        key={di}
                        onClick={() => toggleDate(day)}
                        className={`py-3 rounded-md focus:outline-none transition-colors border ${inCurrentMonth ? 'bg-white' : 'bg-slate-100 text-slate-400'} ${isSelected ? 'bg-blue-600 text-white' : ''} ${isToday && !isSelected ? 'ring-2 ring-blue-300' : ''}`}
                      >
                        <div className="text-sm font-medium">{day.getDate()}</div>
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium">Selected dates</h3>
          <div className="mt-2 text-sm text-slate-700">
            {selectedDates.length === 0 ? (
              <div className="text-slate-500">No dates selected.</div>
            ) : (
              <ul className="list-disc ml-5">
                {selectedDates.sort((a,b) => +a - +b).map((d) => (
                  <li key={d.toISOString()}>{d.toLocaleDateString()}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
