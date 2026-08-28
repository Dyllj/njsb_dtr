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

const emptyForm: InternRecord = { id: '', firstName: '', lastName: '', department: '', status: 'Active' };

function EditInterns() {
  const { interns, loading, error, create, update, remove } = useInterns();
  const [form, setForm] = useState<InternRecord>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(form.id);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const department = form.department.trim();

    if (!firstName || !lastName || !department) return;

    setSubmitting(true);

    try {
      if (isEditing) {
        await update(form.id, { firstName, lastName, department, status: form.status });
      } else {
        await create({ firstName, lastName, department, status: form.status });
      }
      setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (intern: InternRecord) => {
    setForm(intern);
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
      <section className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Interns</h3>
        <Badge variant="secondary">{interns.length} records</Badge>
      </div>

      {error && (
        <p className="text-sm text-destructive">Failed to load interns: {error.message}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
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
            className="w-36"
            disabled={submitting}
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
            className="w-36"
            disabled={submitting}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="intern-dept" className="text-xs font-medium text-muted-foreground">
            Department
          </label>
          <Input
            id="intern-dept"
            value={form.department}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setForm((current) => ({ ...current, department: event.target.value }))
            }
            placeholder="Operations"
            className="w-40"
            disabled={submitting}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Select
            value={form.status}
            onValueChange={(value) =>
              setForm((current) => ({ ...current, status: value as InternRecord['status'] }))
            }
            disabled={submitting}
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="sm" disabled={submitting}>
          <UserPlus className="size-4" />
          {isEditing ? 'Update' : 'Add Intern'}
        </Button>

        {isEditing && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setForm(emptyForm)} disabled={submitting}>
            Cancel
          </Button>
        )}
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Intern</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
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
                    <p className="text-xs text-muted-foreground">{intern.id}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{intern.department}</TableCell>
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
                      >
                        <Pencil className="size-3.5" />
                        <span className="sr-only">Edit {intern.firstName} {intern.lastName}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(intern.id)}
                      >
                        <Trash2 className="size-3.5" />
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
