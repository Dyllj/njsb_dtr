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

import { useAdmins } from '@/lib/hooks/useSupabaseData';
import type { AdminRecord } from '@/lib/services/adminService';

const emptyForm: AdminRecord = { id: '', name: '', email: '', role: '', status: 'Active' };

function EditAdmins() {
  const { admins, loading, error, create, update, remove } = useAdmins();
  const [form, setForm] = useState<AdminRecord>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = Boolean(form.id);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const role = form.role.trim();

    if (!name || !email || !role) return;

    setSubmitError(null);
    setSubmitting(true);

    try {
      if (isEditing) {
        await update(form.id, { name, email, role, status: form.status });
      } else {
        await create({ name, email, role, status: form.status });
      }
      setForm(emptyForm);
    } catch (e) {
      setSubmitError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (admin: AdminRecord) => {
    setForm(admin);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this admin? This cannot be undone.')) return;
    await remove(id);
    if (form.id === id) {
      setForm(emptyForm);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" aria-live="polite">
        <Loader2 className="animate-spin size-8 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading admins...</span>
      </div>
    );
  }

  return (
    <section aria-labelledby="admins-heading" className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="admins-heading" className="text-base font-semibold text-foreground">Admins</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage administrator accounts and permissions</p>
        </div>
        <Badge variant="secondary" className="shrink-0">{admins.length} users</Badge>
      </header>

      {error && (
        <p className="text-sm text-destructive" role="alert">Failed to load admins: {error.message}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end gap-4" noValidate>
        <div className="flex flex-col gap-1 flex-1 min-w-[12rem]">
          <label htmlFor="admin-name" className="text-xs font-medium text-muted-foreground">
            Name
          </label>
          <Input
            id="admin-name"
            value={form.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Juan Dela Cruz"
            className="w-full"
            disabled={submitting}
            required
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[12rem]">
          <label htmlFor="admin-email" className="text-xs font-medium text-muted-foreground">
            Email
          </label>
          <Input
            id="admin-email"
            type="email"
            value={form.email}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="name@njsb.com"
            className="w-full"
            disabled={submitting}
            required
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[10rem]">
          <label htmlFor="admin-role" className="text-xs font-medium text-muted-foreground">
            Role
          </label>
          <Input
            id="admin-role"
            value={form.role}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setForm((current) => ({ ...current, role: event.target.value }))
            }
            placeholder="Manager"
            className="w-full"
            disabled={submitting}
            required
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[10rem]">
          <label htmlFor="admin-status" className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <Select
            value={form.status}
            onValueChange={(value) =>
              setForm((current) => ({ ...current, status: value as AdminRecord['status'] }))
            }
            disabled={submitting}
          >
            <SelectTrigger id="admin-status" size="sm" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={submitting}>
            <UserPlus className="size-4" aria-hidden="true" />
            {isEditing ? 'Update' : 'Add Admin'}
          </Button>

          {isEditing && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setForm(emptyForm)} disabled={submitting}>
              Cancel
            </Button>
          )}
        </div>
        {submitError && <p className="text-sm text-destructive w-full sm:w-auto" role="alert">{submitError}</p>}
      </form>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col">Email</TableHead>
              <TableHead scope="col">Role</TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col" className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No admins yet.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{admin.name}</p>
                    <p className="text-xs text-muted-foreground">{admin.id.slice(0, 8)}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                  <TableCell className="text-muted-foreground">{admin.role}</TableCell>
                  <TableCell>
                    <Badge variant={admin.status === 'Active' ? 'default' : 'outline'}>
                      {admin.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => handleEdit(admin)}
                        aria-label={`Edit ${admin.name}`}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">Edit {admin.name}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(admin.id)}
                        aria-label={`Delete ${admin.name}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">Delete {admin.name}</span>
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

export default EditAdmins;
