import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Pencil, Trash2, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useInterns } from '@/lib/hooks/useSupabaseData';
import type { Intern } from '@/lib/services/internService';

export type InternRecord = Intern;

function formatHours(h: number) {
  return `${h.toFixed(2)} hrs`;
}

const emptyForm: InternRecord = { id: '', firstName: '', lastName: '', status: 'Active', totalHours: 400, accumulatedHours: 0, username: '', email: '', password: 'intern123' };

function EditInterns() {
  const { interns, loading, error, create, update, remove } = useInterns();
  const [form, setForm] = useState<InternRecord>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(form.id);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const username = isEditing ? form.username : (form.username?.trim() || null);
    const email = form.email?.trim() || null;
    const password = isEditing ? null : (form.password || null);

    if (!firstName || !lastName) return;

    setSubmitting(true);

    try {
      if (isEditing) {
        await update(form.id, { firstName, lastName, status: form.status, totalHours: form.totalHours, accumulatedHours: form.accumulatedHours, username, email, password });
      } else {
        await create({ firstName, lastName, status: form.status, totalHours: form.totalHours, accumulatedHours: form.accumulatedHours, username, email, password });
      }
      setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (intern: InternRecord) => {
    setForm({ ...intern, password: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this intern? This cannot be undone.')) return;
    await remove(id);
    if (form.id === id) {
      setForm(emptyForm);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" aria-live="polite">
        <Loader2 className="animate-spin size-8 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading interns...</span>
      </div>
    );
  }

  return (
    <section aria-labelledby="interns-settings-heading" className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="interns-settings-heading" className="text-base font-semibold text-foreground">Interns</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage intern records and working hours</p>
        </div>
        <Badge variant="secondary" className="shrink-0">{interns.length} records</Badge>
      </header>

      {error && (
        <p className="text-sm text-destructive" role="alert">Failed to load interns: {error.message}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="intern-first" className="text-xs font-medium text-muted-foreground">
              First name
            </label>
            <Input
              id="intern-first"
              value={form.firstName}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, firstName: event.target.value }))
              }
              placeholder="Alice"
              className="w-full"
              disabled={submitting}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="intern-last" className="text-xs font-medium text-muted-foreground">
              Last name
            </label>
            <Input
              id="intern-last"
              value={form.lastName}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, lastName: event.target.value }))
              }
              placeholder="Garcia"
              className="w-full"
              disabled={submitting}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="intern-username" className="text-xs font-medium text-muted-foreground">
              Username
            </label>
            <Input
              id="intern-username"
              value={form.username ?? ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, username: event.target.value }))
              }
              placeholder="e.g. juan_d"
              className="w-full"
              disabled={submitting}
              readOnly={isEditing}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="intern-email" className="text-xs font-medium text-muted-foreground">
              Account Email
            </label>
            <Input
              id="intern-email"
              type="email"
              value={form.email ?? ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="e.g. juan@example.com"
              className="w-full"
              disabled={submitting}
            />
          </div>

          {!isEditing && (
            <div className="flex flex-col gap-1">
              <label htmlFor="intern-password" className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              <Input
                id="intern-password"
                type="text"
                value={form.password ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="intern123"
                className="w-full"
                disabled={submitting}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="intern-status" className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, status: value as InternRecord['status'] }))
              }
              disabled={submitting}
            >
              <SelectTrigger id="intern-status" size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="intern-total" className="text-xs font-medium text-muted-foreground">
              Total hours
            </label>
            <Input
              id="intern-total"
              type="number"
              value={form.totalHours}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, totalHours: Number(event.target.value) || 0 }))
              }
              placeholder="400"
              className="w-full"
              disabled={submitting}
              min="0"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="intern-accumulated" className="text-xs font-medium text-muted-foreground">
              Accumulated
            </label>
            <Input
              id="intern-accumulated"
              type="number"
              value={form.accumulatedHours}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setForm((current) => ({ ...current, accumulatedHours: Number(event.target.value) || 0 }))
              }
              placeholder="0"
              className="w-full"
              disabled={submitting}
              min="0"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" size="sm" disabled={submitting}>
            <UserPlus className="size-4" aria-hidden="true" />
            Save Changes
          </Button>

          {isEditing && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setForm(emptyForm)} disabled={submitting}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Intern</TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col" className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No interns yet.
                </TableCell>
              </TableRow>
            ) : (
              interns.map((intern) => (
                <TableRow key={intern.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">
                      {intern.firstName} {intern.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {intern.id} · {formatHours(Math.max(0, intern.totalHours - intern.accumulatedHours))} left
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={intern.status === 'Active' ? 'default' : 'outline'}>
                      {intern.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => handleEdit(intern)}
                        aria-label={`Edit ${intern.firstName} ${intern.lastName}`}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">Edit {intern.firstName} {intern.lastName}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(intern.id)}
                        aria-label={`Delete ${intern.firstName} ${intern.lastName}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">Delete {intern.firstName} {intern.lastName}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export default EditInterns;
