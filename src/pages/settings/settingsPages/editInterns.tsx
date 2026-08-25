import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

export interface InternRecord {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  status: 'Active' | 'Inactive';
}

const initialInterns: InternRecord[] = [
  { id: 'I-001', firstName: 'Alice', lastName: 'Garcia', department: 'HR', status: 'Active' },
  { id: 'I-002', firstName: 'Bob', lastName: 'Lee', department: 'Operations', status: 'Active' },
  { id: 'I-003', firstName: 'Cara', lastName: 'Nguyen', department: 'Finance', status: 'Inactive' },
];

function EditInterns() {
  const [interns, setInterns] = useState<InternRecord[]>(initialInterns);
  const [form, setForm] = useState<InternRecord>({
    id: '',
    firstName: '',
    lastName: '',
    department: '',
    status: 'Active',
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const department = form.department.trim();

    if (!firstName || !lastName || !department) return;

    const nextIntern: InternRecord = {
      ...form,
      id: form.id || `I-${String(interns.length + 1).padStart(3, '0')}`,
      firstName,
      lastName,
      department,
    };

    setInterns((current) => {
      if (form.id) {
        return current.map((item) => (item.id === form.id ? nextIntern : item));
      }

      return [nextIntern, ...current];
    });

    setForm({ id: '', firstName: '', lastName: '', department: '', status: 'Active' });
  };

  const handleEdit = (intern: InternRecord) => {
    setForm(intern);
  };

  const handleDelete = (id: string) => {
    setInterns((current) => current.filter((item) => item.id !== id));

    if (form.id === id) {
      setForm({ id: '', firstName: '', lastName: '', department: '', status: 'Active' });
    }
  };

  return (
    <section className="flex flex-col gap-3 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Interns</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
          {interns.length} records
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-2.5 md:grid-cols-2">
        <input
          value={form.firstName}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setForm((current) => ({ ...current, firstName: event.target.value }))
          }
          placeholder="First name"
          className="rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none transition focus:border-slate-400"
        />
        <input
          value={form.lastName}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setForm((current) => ({ ...current, lastName: event.target.value }))
          }
          placeholder="Last name"
          className="rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none transition focus:border-slate-400"
        />
        <input
          value={form.department}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setForm((current) => ({ ...current, department: event.target.value }))
          }
          placeholder="Department"
          className="rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none transition focus:border-slate-400 md:col-span-2"
        />
        <select
          value={form.status}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setForm((current) => ({ ...current, status: event.target.value as 'Active' | 'Inactive' }))
          }
          className="rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none transition focus:border-slate-400"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          {form.id ? 'Update Intern' : 'Add Intern'}
        </button>
      </form>

      <div className="space-y-2">
        {interns.map((intern) => (
          <div key={intern.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-2.5 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {intern.firstName} {intern.lastName}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {intern.department} • {intern.status}
              </p>
            </div>
            <div className="flex shrink-0 gap-2 pl-2">
              <button
                onClick={() => handleEdit(intern)}
                className="text-[11px] font-medium text-slate-700 transition hover:text-slate-900"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(intern.id)}
                className="text-[11px] font-medium text-red-600 transition hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EditInterns;
