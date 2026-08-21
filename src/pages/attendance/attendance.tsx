import { CheckCircle2, Clock, XCircle } from 'lucide-react';

type AttendanceRecord = {
  id: number;
  intern: string;
  date: string;
  timeIn: string;
  timeOut: string | null;
  status: 'On Time' | 'Late' | 'Absent';
};

const records: AttendanceRecord[] = [
  { id: 1, intern: 'Juan Dela Cruz', date: 'Aug 21, 2026', timeIn: '08:02 AM', timeOut: '05:01 PM', status: 'On Time' },
  { id: 2, intern: 'Maria Santos', date: 'Aug 21, 2026', timeIn: '08:34 AM', timeOut: '05:30 PM', status: 'Late' },
  { id: 3, intern: 'Pedro Reyes', date: 'Aug 21, 2026', timeIn: '-', timeOut: null, status: 'Absent' },
];

function StatusIcon({ status }: { status: AttendanceRecord['status'] }) {
  if (status === 'On Time') return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (status === 'Late') return <Clock className="h-4 w-4 text-amber-600" />;
  return <XCircle className="h-4 w-4 text-rose-600" />;
}

function Attendance() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Attendance</h2>
        <input
          type="date"
          defaultValue="2026-08-21"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-800 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Intern</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time In</th>
              <th className="px-4 py-3 font-medium">Time Out</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="text-slate-700">
                <td className="px-4 py-3 font-medium text-slate-900">{record.intern}</td>
                <td className="px-4 py-3">{record.date}</td>
                <td className="px-4 py-3">{record.timeIn}</td>
                <td className="px-4 py-3">{record.timeOut ?? '-'}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <StatusIcon status={record.status} />
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Attendance;