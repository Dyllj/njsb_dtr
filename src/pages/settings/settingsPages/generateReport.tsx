import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { FilePlus2, Pencil, Trash2 } from 'lucide-react';
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

export interface ReportRecord {
  id: string;
  title: string;
  type: 'Attendance' | 'Payroll' | 'Summary';
  generatedAt: string;
  owner: string;
}

const initialReports: ReportRecord[] = [
  { id: 'R-001', title: 'August Attendance', type: 'Attendance', generatedAt: '2026-08-01', owner: 'System' },
  { id: 'R-002', title: 'Payroll Summary', type: 'Payroll', generatedAt: '2026-08-06', owner: 'Finance' },
];

function emptyForm(): ReportRecord {
  return {
    id: '',
    title: '',
    type: 'Attendance',
    generatedAt: new Date().toISOString().slice(0, 10),
    owner: '',
  };
}

function GenerateReport() {
  const [reports, setReports] = useState<ReportRecord[]>(initialReports);
  const [form, setForm] = useState<ReportRecord>(emptyForm());

  const isEditing = Boolean(form.id);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const title = form.title.trim();
    const owner = form.owner.trim();

    if (!title || !owner) return;

    const nextReport: ReportRecord = {
      ...form,
      id: form.id || `R-${String(reports.length + 1).padStart(3, '0')}`,
      title,
      owner,
    };

    setReports((current) => {
      if (form.id) {
        return current.map((item) => (item.id === form.id ? nextReport : item));
      }

      return [nextReport, ...current];
    });

    setForm(emptyForm());
  };

  const handleEdit = (report: ReportRecord) => {
    setForm(report);
  };

  const handleDelete = (id: string) => {
    setReports((current) => current.filter((item) => item.id !== id));

    if (form.id === id) {
      setForm(emptyForm());
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Reports</h3>
        <Badge variant="secondary">{reports.length} files</Badge>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="report-title" className="text-xs font-medium text-muted-foreground">
            Title
          </label>
          <Input
            id="report-title"
            value={form.title}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="August Attendance"
            className="w-48"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <Select
            value={form.type}
            onValueChange={(value) =>
              setForm((current) => ({ ...current, type: value as ReportRecord['type'] }))
            }
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Attendance">Attendance</SelectItem>
              <SelectItem value="Payroll">Payroll</SelectItem>
              <SelectItem value="Summary">Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="report-date" className="text-xs font-medium text-muted-foreground">
            Date
          </label>
          <Input
            id="report-date"
            type="date"
            value={form.generatedAt}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setForm((current) => ({ ...current, generatedAt: event.target.value }))
            }
            className="w-40"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="report-owner" className="text-xs font-medium text-muted-foreground">
            Owner
          </label>
          <Input
            id="report-owner"
            value={form.owner}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setForm((current) => ({ ...current, owner: event.target.value }))
            }
            placeholder="Finance"
            className="w-36"
          />
        </div>

        <Button type="submit" size="sm">
          <FilePlus2 className="size-4" />
          {isEditing ? 'Update' : 'Create Report'}
        </Button>

        {isEditing && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setForm(emptyForm())}>
            Cancel
          </Button>
        )}
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Generated</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No reports yet.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{report.title}</p>
                    <p className="text-xs text-muted-foreground">{report.id}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{report.generatedAt}</TableCell>
                  <TableCell className="text-muted-foreground">{report.owner}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => handleEdit(report)}
                      >
                        <Pencil className="size-3.5" />
                        <span className="sr-only">Edit {report.title}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">Delete {report.title}</span>
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

export default GenerateReport;