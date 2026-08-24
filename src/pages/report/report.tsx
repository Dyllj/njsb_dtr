import { Download, FileText } from 'lucide-react';

const reports = [
  { id: 1, name: 'Juan Dela Cruz - August 2026 DTR', generatedOn: 'Aug 20, 2026' },
  { id: 2, name: 'Maria Santos - August 2026 DTR', generatedOn: 'Aug 20, 2026' },
  { id: 3, name: 'Pedro Reyes - August 2026 DTR', generatedOn: 'Aug 20, 2026' },
];

function Report() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Report</h2>
        <button className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
          <FileText className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{report.name}</p>
              <p className="text-xs text-slate-500">Generated on {report.generatedOn}</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-red-800 hover:text-red-800">
              <Download className="h-4 w-4" />
              PDF
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Report;