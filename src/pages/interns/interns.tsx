import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useInterns } from '@/lib/hooks/useSupabaseData';

function formatHours(h: number) {
  return `${h.toFixed(2)} hrs`;
}

function Interns() {
  const { interns, loading, error, create } = useInterns();
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return interns;
    return interns.filter((it) =>
      [it.id, it.firstName, it.lastName, it.department]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [interns, query]);

  function handleAdd() {
    const firstName = window.prompt('First name:')?.trim() || '';
    if (!firstName) return;
    const lastName = window.prompt('Last name:')?.trim() || '';
    const department = window.prompt('Department:', 'Operations')?.trim() || 'Operations';
    const totalHoursStr = window.prompt('Total hours (numeric):', '400') || '0';
    const accumulatedStr = window.prompt('Accumulated hours (numeric):', '0') || '0';

    const totalHours = Number(totalHoursStr) || 0;
    const accumulatedHours = Number(accumulatedStr) || 0;

    const status = window.prompt('Status (Active/Inactive):', 'Active')?.trim() || 'Active';

    setSubmitting(true);
    create({ firstName, lastName, department, status: status as 'Active' | 'Inactive', totalHours, accumulatedHours })
      .catch((e) => {
        console.error(e);
        alert('Failed to add intern. See console for details.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

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
              placeholder="Search by ID, name, or department"
              className="w-72 pl-9 rounded-md border py-2 px-2 focus:outline-none focus:ring-2"
            />
          </div>
          <Button onClick={handleAdd} disabled={submitting}>
            <UserPlus className="size-4" />
            Add Intern
          </Button>
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
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Total hours</TableHead>
                <TableHead className="text-right">Accumulated hours</TableHead>
                <TableHead className="text-right">Remaining hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
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
                      <TableCell>{it.department}</TableCell>
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
