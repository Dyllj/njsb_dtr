import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';

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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Report</h2>
        <button
          onClick={handleGenerateReport}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          <FileText className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {error && (
        <p className="text-sm text-destructive">Failed to load reports: {error.message}</p>
      )}

      <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {reports.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No reports available yet. Generate one to get started.
          </div>
        ) : (
          reports.map((report: ReportRecord) => (
            <div key={report.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{report.title}</p>
                <p className="text-xs text-slate-500">
                  Generated on {formatDate(report.generatedAt)}
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-red-800 hover:text-red-800">
                <Download className="h-4 w-4" />
                PDF
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Report;
