import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { FilePlus2, Pencil, Trash2, Loader2 } from 'lucide-react';
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

import { useReports } from '@/lib/hooks/useSupabaseData';
import type { ReportRecord } from '@/lib/services/reportService';

export type { ReportRecord };

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
  const { reports, loading, error, create, update, remove } = useReports();
  const [form, setForm] = useState<ReportRecord>(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(form.id);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const title = form.title.trim();
    const owner = form.owner.trim();

    if (!title || !owner) return;

    setSubmitting(true);

    try {
      if (isEditing) {
        await update(form.id, { title, type: form.type, generatedAt: form.generatedAt, owner });
      } else {
        await create({ title, type: form.type, generatedAt: form.generatedAt, owner });
      }
      setForm(emptyForm());
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (report: ReportRecord) => {
    setForm(report);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report? This cannot be undone.')) return;
    await remove(id);
    if (form.id === id) {
      setForm(emptyForm());
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
        <h3 className="text-base font-semibold">Reports</h3>
        <Badge variant="secondary">{reports.length} files</Badge>
      </div>

      {error && (
        <p className="text-sm text-destructive">Failed to load reports: {error.message}</p>
      )}

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
            disabled={submitting}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <Select
            value={form.type}
            onValueChange={(value) =>
              setForm((current) => ({ ...current, type: value as ReportRecord['type'] }))
            }
            disabled={submitting}
          >
            <SelectTrigger size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Attendance">Attendance</SelectItem>
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
            disabled={submitting}
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
            disabled={submitting}
          />
        </div>

        <Button type="submit" size="sm" disabled={submitting}>
          <FilePlus2 className="size-4" />
          {isEditing ? 'Update' : 'Create Report'}
        </Button>

        {isEditing && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setForm(emptyForm())} disabled={submitting}>
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
