import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarCheck2, Loader2 } from 'lucide-react';

import { useMonthlyAttendance } from '@/lib/hooks/useSupabaseData';
import type { AttendanceSummary } from '@/lib/services/attendanceService';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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

export default function Attendance() {
  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const { data: attendanceData, loading, error } = useMonthlyAttendance(
    viewDate.getFullYear(),
    viewDate.getMonth()
  );

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
  function goToday() {
    setViewDate(startOfMonth(today));
    setSelectedDate(today);
  }

  function getAttendance(date: Date): AttendanceSummary | null {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFuture = date > today;
    if (isWeekend || isFuture) return null;

    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return attendanceData[dateKey] ?? null;
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Attendance</h2>
            <p className="text-sm text-slate-500">Monthly overview of intern check-ins</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin size-8 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex w-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Attendance</h2>
            <p className="text-sm text-slate-500">Monthly overview of intern check-ins</p>
          </div>
          <button
            onClick={goToday}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-red-800 hover:text-red-800"
          >
            Today
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-destructive">
            Failed to load attendance data: {error.message}
          </p>
        )}

        <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CalendarCheck2 className="h-5 w-5 text-sky-600" />
              {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Next month"
                className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-slate-100 px-3 pt-3">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid auto-rows-21 grid-cols-7 gap-1.5 p-3">
            {matrix.map((week, wi) =>
              week.map((day, di) => {
                const inCurrentMonth = day.getMonth() === viewDate.getMonth();
                const isToday = sameDay(day, today);
                const isSelected = selectedDate !== null && sameDay(day, selectedDate);
                const isHovered = hoveredDate !== null && sameDay(day, hoveredDate);
                const attendance = getAttendance(day);
                const isWeekendCol = di === 0 || di === 6;
                const showAbove = wi >= matrix.length - 2;

                return (
                  <div key={`${wi}-${di}`} className="relative">
                    <button
                      onClick={() => setSelectedDate(day)}
                      onMouseEnter={() => setHoveredDate(day)}
                      onMouseLeave={() => setHoveredDate(null)}
                      className={[
                        'flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-lg text-sm transition-colors',
                        inCurrentMonth ? 'text-slate-700' : 'text-slate-300',
                        isWeekendCol && inCurrentMonth && !isSelected ? 'bg-slate-50' : '',
                        isSelected ? 'bg-sky-600 text-white' : 'hover:bg-slate-100',
                        isToday && !isSelected ? 'ring-1 ring-inset ring-sky-400' : '',
                      ].join(' ')}
                    >
                      <span className={`font-medium ${isToday && !isSelected ? 'text-sky-600' : ''}`}>
                        {day.getDate()}
                      </span>
                      {attendance && (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSelected
                              ? 'bg-white'
                              : attendance.absent <= 5
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                        />
                      )}
                    </button>

                    {isHovered && attendance && (
                      <div
                        className={[
                          'pointer-events-none absolute z-20 w-40 rounded-lg border border-slate-200 bg-white p-3 shadow-lg',
                          showAbove ? 'bottom-full mb-2' : 'top-full mt-2',
                          di === 0 ? 'left-0' : di === 6 ? 'right-0' : 'left-1/2 -translate-x-1/2',
                        ].join(' ')}
                      >
                        <p className="mb-2 text-xs font-semibold text-slate-500">
                          {day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Present
                          </span>
                          <span className="font-semibold text-slate-900">{attendance.present}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="h-2 w-2 rounded-full bg-rose-500" />
                            Absent
                          </span>
                          <span className="font-semibold text-slate-900">{attendance.absent}</span>
                        </div>
                      </div>
                    )}
                    {isHovered && !attendance && (
                      <div
                        className={[
                          'pointer-events-none absolute z-20 w-36 rounded-lg border border-slate-200 bg-white p-3 text-center text-xs text-slate-400 shadow-lg',
                          showAbove ? 'bottom-full mb-2' : 'top-full mt-2',
                          di === 0 ? 'left-0' : di === 6 ? 'right-0' : 'left-1/2 -translate-x-1/2',
                        ].join(' ')}
                      >
                        {day > today ? 'No data yet' : 'No records'}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Low absences
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Multiple absences
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border-2 border-sky-400" /> Today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
