import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

const emptyForm: Omit<Intern, 'id'> = {
  firstName: '',
  lastName: '',
  status: 'Active',
  totalHours: 400,
  accumulatedHours: 0,
  username: '',
  email: '',
  password: 'intern123',
};

function Interns() {
  const { interns, loading, error, create } = useInterns();
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<Intern, 'id'>>(emptyForm);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return interns;
    return interns.filter((it) =>
      [it.id, it.firstName, it.lastName]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [interns, query]);

  function formatHours(h: number) {
    return `${h.toFixed(2)} hrs`;
  }

  const resetForm = () => {
    setForm(emptyForm);
    setSubmitError(null);
  };

  const openDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    resetForm();
    setIsDialogOpen(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const username = form.username?.trim() || null;
    const email = form.email?.trim() || null;
    const password = form.password || null;

    if (!firstName || !lastName) return;

    setSubmitError(null);
    setSubmitting(true);

    try {
      await create({
        firstName,
        lastName,
        status: form.status,
        totalHours: form.totalHours,
        accumulatedHours: form.accumulatedHours,
        username,
        email,
        password,
      });
      closeDialog();
    } catch (e) {
      setSubmitError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight ml-5">NJSB Interns</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <label htmlFor="search" className="sr-only">
              Search interns
            </label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search by ID or name"
              className="w-72 pl-9 rounded-md border py-2 px-2 focus:outline-none focus:ring-2"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openDialog} disabled={submitting}>
                <UserPlus className="size-4" />
                Add Intern
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Intern</DialogTitle>
                <DialogDescription>
                  Enter the intern details below and click Save Changes.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="add-intern-first" className="text-xs font-medium text-muted-foreground">
                      First name
                    </label>
                    <Input
                      id="add-intern-first"
                      value={form.firstName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setForm((c) => ({ ...c, firstName: e.target.value }))
                      }
                      placeholder="Alice"
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="add-intern-last" className="text-xs font-medium text-muted-foreground">
                      Last name
                    </label>
                    <Input
                      id="add-intern-last"
                      value={form.lastName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setForm((c) => ({ ...c, lastName: e.target.value }))
                      }
                      placeholder="Garcia"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="add-intern-username" className="text-xs font-medium text-muted-foreground">
                      Username
                    </label>
                    <Input
                      id="add-intern-username"
                      value={form.username ?? ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setForm((c) => ({ ...c, username: e.target.value }))
                      }
                      placeholder="e.g. juan_d"
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="add-intern-email" className="text-xs font-medium text-muted-foreground">
                      Account Email
                    </label>
                    <Input
                      id="add-intern-email"
                      type="email"
                      value={form.email ?? ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setForm((c) => ({ ...c, email: e.target.value }))
                      }
                      placeholder="e.g. juan@example.com"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="add-intern-password" className="text-xs font-medium text-muted-foreground">
                    Password
                  </label>
                  <Input
                    id="add-intern-password"
                    type="text"
                    value={form.password ?? ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setForm((c) => ({ ...c, password: e.target.value }))
                    }
                    placeholder="intern123"
                    disabled={submitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="add-intern-total" className="text-xs font-medium text-muted-foreground">
                      Total hours
                    </label>
                    <Input
                      id="add-intern-total"
                      type="number"
                      value={form.totalHours}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setForm((c) => ({ ...c, totalHours: Number(e.target.value) || 0 }))
                      }
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="add-intern-accumulated" className="text-xs font-medium text-muted-foreground">
                      Accumulated
                    </label>
                    <Input
                      id="add-intern-accumulated"
                      type="number"
                      value={form.accumulatedHours}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setForm((c) => ({ ...c, accumulatedHours: Number(e.target.value) || 0 }))
                      }
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm((c) => ({ ...c, status: v as 'Active' | 'Inactive' }))}
                    disabled={submitting}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {submitError && <p className="text-sm text-destructive">{submitError}</p>}

                <DialogFooter>
                  <Button type="button" variant="outline" size="sm" onClick={closeDialog} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting && <Loader2 className="size-4 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive ml-5">Failed to load interns: {error.message}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Interns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>First name</TableHead>
                <TableHead>Last name</TableHead>
                <TableHead className="text-right">Total hours</TableHead>
                <TableHead className="text-right">Accumulated hours</TableHead>
                <TableHead className="text-right">Remaining hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No interns found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((it) => {
                  const remaining = Math.max(0, it.totalHours - it.accumulatedHours);
                  return (
                    <TableRow key={it.id}>
                      <TableCell>{it.id}</TableCell>
                      <TableCell>{it.firstName}</TableCell>
                      <TableCell>{it.lastName}</TableCell>
                      <TableCell className="text-right">{formatHours(it.totalHours)}</TableCell>
                      <TableCell className="text-right">{formatHours(it.accumulatedHours)}</TableCell>
                      <TableCell className="text-right">{formatHours(remaining)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Interns;
