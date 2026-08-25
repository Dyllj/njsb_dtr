import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

const initialAdmins: AdminRecord[] = [
  { id: 'A-001', name: 'Rosa Dela Cruz', email: 'rosa@njsb.com', role: 'Super Admin', status: 'Active' },
  { id: 'A-002', name: 'Mark Santos', email: 'mark@njsb.com', role: 'Manager', status: 'Active' },
];

function EditAdmins() {
  const [admins, setAdmins] = useState<AdminRecord[]>(initialAdmins);
  const [form, setForm] = useState<AdminRecord>({
    id: '',
    name: '',
    email: '',
    role: '',
    status: 'Active',
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const role = form.role.trim();

    if (!name || !email || !role) return;

    const nextAdmin: AdminRecord = {
      ...form,
      id: form.id || `A-${String(admins.length + 1).padStart(3, '0')}`,
      name,
      email,
      role,
    };

    setAdmins((current) => {
      if (form.id) {
        return current.map((item) => (item.id === form.id ? nextAdmin : item));
      }

      return [nextAdmin, ...current];
    });

    setForm({ id: '', name: '', email: '', role: '', status: 'Active' });
  };

  const handleEdit = (admin: AdminRecord) => {
    setForm(admin);
  };

  const handleDelete = (id: string) => {
    setAdmins((current) => current.filter((item) => item.id !== id));

    if (form.id === id) {
      setForm({ id: '', name: '', email: '', role: '', status: 'Active' });
    }
  };

  return (
    <section className="flex flex-col gap-3 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Admins</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
          {admins.length} users
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-2.5 md:grid-cols-2">
        <input
          value={form.name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          placeholder="Admin name"
          className="rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none transition focus:border-slate-400 md:col-span-2"
        />
        <input
          value={form.email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          placeholder="Email"
          className="rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none transition focus:border-slate-400 md:col-span-2"
        />
        <input
          value={form.role}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setForm((current) => ({ ...current, role: event.target.value }))
          }
          placeholder="Role"
          className="rounded-md border border-slate-200 px-2.5 py-2 text-sm outline-none transition focus:border-slate-400"
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
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 md:col-span-2"
        >
          {form.id ? 'Update Admin' : 'Add Admin'}
        </button>
      </form>

      <div className="space-y-2">
        {admins.map((admin) => (
          <div key={admin.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-2.5 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{admin.name}</p>
              <p className="truncate text-[11px] text-slate-500">
                {admin.email} • {admin.role}
              </p>
            </div>
            <div className="flex shrink-0 gap-2 pl-2">
              <button
                onClick={() => handleEdit(admin)}
                className="text-[11px] font-medium text-slate-700 transition hover:text-slate-900"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(admin.id)}
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

export default EditAdmins;
