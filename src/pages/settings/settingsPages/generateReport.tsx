import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

export interface ReportRecord {
  id: string;
  title: string;
  type: 'Attendance' | 'Payroll' | 'Summary';
  generatedAt: string;
  owner: string;
}

const initialReports: ReportRecord[] = [
  { id: 'R-001', title: 'August Attendance', type: 'Attendance', generatedAt: '2026-08-01', owner: 'System' },
  { id: 'R-002', title: 'Payroll Summary', type: 'Payroll', generatedAt: '2026-08-06', owner: 'Finance' },
];

function GenerateReport() {
  const [reports, setReports] = useState<ReportRecord[]>(initialReports);
  const [form, setForm] = useState<ReportRecord>({
    id: '',
    title: '',
    type: 'Attendance',
    generatedAt: new Date().toISOString().slice(0, 10),
    owner: '',
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const title = form.title.trim();
    const owner = form.owner.trim();

    if (!title || !owner) return;

    const nextReport: ReportRecord = {
      ...form,
      id: form.id || `R-${String(reports.length + 1).padStart(3, '0')}`,
      title,
      owner,
    };

    setReports((current) => {
      if (form.id) {
        return current.map((item) => (item.id === form.id ? nextReport : item));
      }

      return [nextReport, ...current];
    });

    setForm({
      id: '',
      title: '',
      type: 'Attendance',
      generatedAt: new Date().toISOString().slice(0, 10),
      owner: '',
    });
  };

  const handleEdit = (report: ReportRecord) => {
    setForm(report);
  };

  const handleDelete = (id: string) => {
    setReports((current) => current.filter((item) => item.id !== id));

    if (form.id === id) {
      setForm({
        id: '',
        title: '',
        type: 'Attendance',
        generatedAt: new Date().toISOString().slice(0, 10),
        owner: '',
      });
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reports</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {reports.length} files
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <input
          value={form.title}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setForm((current) => ({ ...current, title: event.target.value }))
          }
          placeholder="Report title"
          className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 md:col-span-2"
        />
        <select
          value={form.type}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setForm((current) => ({ ...current, type: event.target.value as 'Attendance' | 'Payroll' | 'Summary' }))
          }
          className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        >
          <option value="Attendance">Attendance</option>
          <option value="Payroll">Payroll</option>
          <option value="Summary">Summary</option>
        </select>
        <input
          type="date"
          value={form.generatedAt}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setForm((current) => ({ ...current, generatedAt: event.target.value }))
          }
          className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
        <input
          value={form.owner}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setForm((current) => ({ ...current, owner: event.target.value }))
          }
          placeholder="Owner"
          className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 md:col-span-2"
        />
        <button type="submit" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 md:col-span-2">
          {form.id ? 'Update Report' : 'Create Report'}
        </button>
      </form>

      <div className="mt-4 space-y-2">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
            <div>
              <p className="font-medium text-slate-900">{report.title}</p>
              <p className="text-xs text-slate-500">
                {report.type} • {report.generatedAt} • {report.owner}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(report)} className="text-xs font-medium text-slate-700 underline-offset-2 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(report.id)} className="text-xs font-medium text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GenerateReport;
