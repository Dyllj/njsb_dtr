import { Plus, Search } from 'lucide-react';

type Intern = {
  id: number;
  name: string;
  school: string;
  hoursRendered: number;
  hoursRequired: number;
  status: 'Active' | 'Completed' | 'Inactive';
};

const interns: Intern[] = [
  { id: 1, name: 'Juan Dela Cruz', school: 'Cebu Institute of Technology', hoursRendered: 210, hoursRequired: 486, status: 'Active' },
  { id: 2, name: 'Maria Santos', school: 'University of San Carlos', hoursRendered: 486, hoursRequired: 486, status: 'Completed' },
  { id: 3, name: 'Pedro Reyes', school: 'University of San Jose-Recoletos', hoursRendered: 96, hoursRequired: 400, status: 'Active' },
];

const statusStyles: Record<Intern['status'], string> = {
  Active: 'bg-emerald-500/10 text-emerald-600',
  Completed: 'bg-sky-500/10 text-sky-600',
  Inactive: 'bg-slate-500/10 text-slate-600',
};

function Interns() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Interns</h2>
        <button className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
          <Plus className="h-4 w-4" />
          Add Intern
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search interns..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm focus:border-red-800 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">School</th>
              <th className="px-4 py-3 font-medium">Hours Rendered</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {interns.map((intern) => (
              <tr key={intern.id} className="text-slate-700">
                <td className="px-4 py-3 font-medium text-slate-900">{intern.name}</td>
                <td className="px-4 py-3">{intern.school}</td>
                <td className="px-4 py-3">
                  {intern.hoursRendered} / {intern.hoursRequired}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[intern.status]}`}>
                    {intern.status}
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

export default Interns;