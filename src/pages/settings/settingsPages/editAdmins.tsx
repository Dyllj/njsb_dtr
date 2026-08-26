import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
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

const emptyForm: AdminRecord = { id: '', name: '', email: '', role: '', status: 'Active' };

function EditAdmins() {
  const [admins, setAdmins] = useState<AdminRecord[]>(initialAdmins);
  const [form, setForm] = useState<AdminRecord>(emptyForm);

  const isEditing = Boolean(form.id);

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

    setForm(emptyForm);
  };

  const handleEdit = (admin: AdminRecord) => {
    setForm(admin);
  };

  const handleDelete = (id: string) => {
    setAdmins((current) => current.filter((item) => item.id !== id));

    if (form.id === id) {
      setForm(emptyForm);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Admins</h3>
        <Badge variant="secondary">{admins.length} users</Badge>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
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
            className="w-44"
          />
        </div>

        <div className="flex flex-col gap-1">
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
            className="w-52"
          />
        </div>

        <div className="flex flex-col gap-1">
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
            className="w-36"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Select
            value={form.status}
            onValueChange={(value) =>
              setForm((current) => ({ ...current, status: value as AdminRecord['status'] }))
            }
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

        <Button type="submit" size="sm">
          <UserPlus className="size-4" />
          {isEditing ? 'Update' : 'Add Admin'}
        </Button>

        {isEditing && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setForm(emptyForm)}>
            Cancel
          </Button>
        )}
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No admins yet.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{admin.name}</p>
                    <p className="text-xs text-muted-foreground">{admin.id}</p>
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
                      >
                        <Pencil className="size-3.5" />
                        <span className="sr-only">Edit {admin.name}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(admin.id)}
                      >
                        <Trash2 className="size-3.5" />
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