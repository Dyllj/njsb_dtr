import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Search, UserPlus } from 'lucide-react';
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

interface Intern {
  id: string;
  firstName: string;
  mi?: string;
  lastName: string;
  totalHours: number;
  accumulatedHours: number;
}

function formatHours(h: number) {
  return `${h.toFixed(2)} hrs`;
}

function Interns() {
  const [query, setQuery] = useState('');
  const [interns, setInterns] = useState<Intern[]>([
    { id: 'I-001', firstName: 'Alice', mi: 'B.', lastName: 'Garcia', totalHours: 480, accumulatedHours: 120 },
    { id: 'I-002', firstName: 'Bob', mi: 'C.', lastName: 'Lee', totalHours: 300, accumulatedHours: 200 },
    { id: 'I-003', firstName: 'Cara', mi: 'D.', lastName: 'Nguyen', totalHours: 400, accumulatedHours: 50 },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return interns;
    return interns.filter((it) =>
      [it.id, it.firstName, it.mi || '', it.lastName]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [interns, query]);

  function handleAdd() {
    // Simple prompt-based add for boilerplate/demo purposes.
    const firstName = window.prompt('First name:')?.trim();
    if (!firstName) return;
    const mi = window.prompt('Middle initial (optional):')?.trim() || undefined;
    const lastName = window.prompt('Last name:')?.trim() || '';
    const totalHoursStr = window.prompt('Total hours (numeric):', '400') || '0';
    const accumulatedStr = window.prompt('Accumulated hours (numeric):', '0') || '0';

    const totalHours = Number(totalHoursStr) || 0;
    const accumulatedHours = Number(accumulatedStr) || 0;

    const newIntern: Intern = {
      id: `I-${String(interns.length + 1).padStart(3, '0')}`,
      firstName,
      mi,
      lastName,
      totalHours,
      accumulatedHours,
    };

    setInterns((prev) => [newIntern, ...prev]);
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
              placeholder="Search by ID, first name, MI, or last name"
              className="w-72 pl-9 rounded-md border py-2 px-2 focus:outline-none focus:ring-2"
            />
          </div>
          <Button onClick={handleAdd}>
            <UserPlus className="size-4" />
            Add Intern
          </Button>
        </div>
      </div>

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
                <TableHead>MI</TableHead>
                <TableHead>Last name</TableHead>
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
                      <TableCell>{it.mi || ''}</TableCell>
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