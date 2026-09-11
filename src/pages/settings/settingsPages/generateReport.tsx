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
      <div className="flex items-center justify-center py-12" aria-live="polite">
        <Loader2 className="animate-spin size-8 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading reports...</span>
      </div>
    );
  }

  return (
    <section aria-labelledby="reports-settings-heading" className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="reports-settings-heading" className="text-base font-semibold text-foreground">Reports</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create and manage attendance reports</p>
        </div>
        <Badge variant="secondary" className="shrink-0">{reports.length} files</Badge>
      </header>

      {error && (
        <p className="text-sm text-destructive" role="alert">Failed to load reports: {error.message}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end gap-4" noValidate>
        <div className="flex flex-col gap-1 flex-1 min-w-[12rem]">
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
            className="w-full"
            disabled={submitting}
            required
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[10rem]">
          <label htmlFor="report-type" className="text-xs font-medium text-muted-foreground">
            Type
          </label>
          <Select
            value={form.type}
            onValueChange={(value) =>
              setForm((current) => ({ ...current, type: value as ReportRecord['type'] }))
            }
            disabled={submitting}
          >
            <SelectTrigger id="report-type" size="sm" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Attendance">Attendance</SelectItem>
              <SelectItem value="Summary">Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 min-w-[10rem]">
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
            className="w-full"
            disabled={submitting}
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[10rem]">
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
            className="w-full"
            disabled={submitting}
            required
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={submitting}>
            <FilePlus2 className="size-4" aria-hidden="true" />
            {isEditing ? 'Update' : 'Create Report'}
          </Button>

          {isEditing && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setForm(emptyForm())} disabled={submitting}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Report</TableHead>
              <TableHead scope="col">Type</TableHead>
              <TableHead scope="col">Generated</TableHead>
              <TableHead scope="col">Owner</TableHead>
              <TableHead scope="col" className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
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
                  <TableCell className="text-muted-foreground">
                    <time dateTime={report.generatedAt}>{report.generatedAt}</time>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{report.owner}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => handleEdit(report)}
                        aria-label={`Edit ${report.title}`}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">Edit {report.title}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(report.id)}
                        aria-label={`Delete ${report.title}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
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
