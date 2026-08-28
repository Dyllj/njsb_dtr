import { Loader2 } from 'lucide-react';
import type { WeeklyAttendanceRow } from '@/lib/services/attendanceService';

type WeeklyAttendanceCardProps = {
  rows?: WeeklyAttendanceRow[];
  loading?: boolean;
  error?: Error | null;
};

function WeeklyAttendanceCard({ rows, loading, error }: WeeklyAttendanceCardProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const statusDot: Record<string, { label: string; className: string }> = {
    present: { label: 'Present', className: 'bg-emerald-500' },
    absent: { label: 'Absent', className: 'bg-rose-500' },
    late: { label: 'Late', className: 'bg-amber-500' },
    undftime: { label: 'Undertime', className: 'bg-orange-500' },
    '—': { label: 'No data', className: 'bg-slate-200' },
  };

  if (loading) {
    return (
      <div className="w-full max-w-[calc(100vw-18rem)] flex flex-col justify-between rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <h3 className="text-lg font-semibold">Weekly Attendance</h3>
        <p className="text-slate-500">View your weekly attendance statistics.</p>
        <div className="mt-4 flex items-center justify-center py-8">
          <Loader2 className="animate-spin size-6 text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[calc(100vw-18rem)] flex flex-col justify-between rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <h3 className="text-lg font-semibold">Weekly Attendance</h3>
        <p className="text-slate-500">View your weekly attendance statistics.</p>
        <p className="mt-4 text-sm text-destructive">Failed to load: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[calc(100vw-18rem)] flex flex-col justify-between rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <h3 className="text-lg font-semibold">Weekly Attendance</h3>
      <p className="text-slate-500">View your weekly attendance statistics.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="divide-x divide-slate-100 border-b border-slate-200">
              <th className="py-2 pr-4 font-medium text-slate-500">Name</th>
              {days.map((day) => (
                <th key={day} className="px-4 py-2 text-center font-medium text-slate-500">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!rows || rows.length === 0 ? (
              <tr>
                <td colSpan={days.length + 1} className="py-4 text-center text-sm text-muted-foreground">
                  No attendance records for this week.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.internId} className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-900">{row.internName}</td>
                  {row.dailyStatus.map((status, di) => {
                    const dot = statusDot[status] ?? statusDot['—'];
                    return (
                      <td key={di} className="px-4 py-2 text-center">
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-full ${dot.className}`}
                          title={dot.label}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeeklyAttendanceCard;
