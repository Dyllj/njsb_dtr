import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useReports } from '@/lib/hooks/useSupabaseData';
import type { ReportRecord } from '@/lib/services/reportService';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function Report() {
  const { reports, loading, error, create } = useReports();
  const [submitting, setSubmitting] = useState(false);

  async function handleGenerateReport() {
    setSubmitting(true);
    try {
      await create({
        title: 'New Attendance Report',
        type: 'Attendance',
        generatedAt: new Date().toISOString().split('T')[0],
        owner: 'Admin User',
      });
    } catch (e) {
      console.error(e);
      alert('Failed to generate report. See console for details.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" aria-live="polite">
        <Loader2 className="animate-spin size-8 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <header className="pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">Generated attendance reports</p>
          </div>
          <Button
            onClick={handleGenerateReport}
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
            Generate Report
          </Button>
        </div>
      </header>

      {error && (
        <p className="text-sm text-destructive" role="alert">Failed to load reports: {error.message}</p>
      )}

      <section aria-labelledby="reports-heading">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {reports.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No reports available yet. Generate one to get started.
              </div>
            ) : (
              <ul className="divide-y divide-border" role="list" aria-label="Reports list">
                {reports.map((report: ReportRecord) => (
                  <li key={report.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{report.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Generated on <time dateTime={report.generatedAt}>{formatDate(report.generatedAt)}</time>
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                      PDF
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default Report;
