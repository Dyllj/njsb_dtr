import { Loader2 } from 'lucide-react';
import type { WeeklyAttendanceRow } from '@/lib/services/attendanceService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    undertime: { label: 'Undertime', className: 'bg-orange-500' },
    '—': { label: 'No data', className: 'bg-slate-200' },
  };

  if (loading) {
    return (
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Weekly Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">View your weekly attendance statistics.</p>
          <div className="mt-4 flex items-center justify-center py-8">
            <Loader2 className="animate-spin size-6 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Loading weekly attendance...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Weekly Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">View your weekly attendance statistics.</p>
          <p className="mt-4 text-sm text-destructive" role="alert">Failed to load: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Weekly Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-500 text-sm">View your weekly attendance statistics.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-left text-sm" role="table">
            <caption className="sr-only">Weekly attendance status for each intern</caption>
            <thead>
              <tr className="divide-x divide-border border-b border-border">
                <th scope="col" className="py-2 pr-4 font-medium text-muted-foreground">Name</th>
                {days.map((day) => (
                  <th key={day} scope="col" className="px-4 py-2 text-center font-medium text-muted-foreground">
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
                  <tr key={row.internId} className="border-b border-border">
                    <th scope="row" className="py-2 pr-4 font-medium text-foreground">{row.internName}</th>
                    {row.dailyStatus.map((status, di) => {
                      const dot = statusDot[status.toLowerCase()] ?? statusDot['—'];
                      return (
                        <td key={di} className="px-4 py-2 text-center">
                          <span
                            className={`inline-block h-2.5 w-2.5 rounded-full ${dot.className}`}
                            title={dot.label}
                            aria-label={`${days[di]}: ${dot.label}`}
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
      </CardContent>
    </Card>
  );
}

export default WeeklyAttendanceCard;
