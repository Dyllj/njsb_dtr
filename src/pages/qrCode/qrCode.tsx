import { useState } from 'react';
import { QrCode, Loader2, Printer, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useQRCodes } from '@/lib/hooks/useSupabaseData';

function QrCodePage() {
  const { qrCodes, loading, error, create, remove } = useQRCodes();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeQR = qrCodes.find((qr) => qr.isActive);

  const handleGenerate = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const code = `QR-${Date.now().toString(36).toUpperCase()}`;
      await create(code);
    } catch (e) {
      setSubmitError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this QR code record?')) return;
    try {
      await remove(id);
    } catch (e) {
      setSubmitError((e as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" aria-live="polite">
        <Loader2 className="animate-spin size-8 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading QR codes...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <header className="pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">QR Code Attendance</h1>
            <p className="text-sm text-muted-foreground mt-1">Generate and manage QR codes for intern check-in</p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={submitting || !!activeQR}
            className="w-full sm:w-auto"
          >
            <QrCode className="h-4 w-4 mr-2" aria-hidden="true" />
            {submitting ? 'Generating...' : activeQR ? 'QR Code Active' : 'Generate QR Code'}
          </Button>
        </div>
      </header>

      {error && (
        <p className="text-sm text-destructive" role="alert">Failed to load QR codes: {error.message}</p>
      )}
      {submitError && (
        <p className="text-sm text-destructive" role="alert">{submitError}</p>
      )}

      {activeQR && (
        <section aria-labelledby="active-qr-heading" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle id="active-qr-heading" className="text-base font-semibold">Current Active QR Code</CardTitle>
                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="size-3.5 mr-1" aria-hidden="true" />
                  Available
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-lg border border-border bg-card p-4 w-full max-w-xs">
                  <QRCodeSVG
                    value={`${window.location.origin}/scan/${activeQR.code}`}
                    size={200}
                    level="M"
                    includeMargin
                    aria-label={`QR code for intern check-in: ${activeQR.code}`}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Code: <span className="font-mono font-medium text-foreground">{activeQR.code}</span>
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Interns can scan this QR code to check in. Print this page for placement at the entrance.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto"
                >
                  <Printer className="size-4 mr-2" aria-hidden="true" />
                  Print QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {!activeQR && !loading && (
        <section aria-labelledby="no-qr-heading">
          <Card>
            <CardContent className="py-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <XCircle className="size-10 text-muted-foreground" aria-hidden="true" />
                <p id="no-qr-heading" className="text-sm font-medium text-muted-foreground">No active QR code</p>
                <p className="text-xs text-muted-foreground">Generate a new QR code for interns to scan and check in.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section aria-labelledby="qr-history-heading">
        <Card>
          <CardHeader>
            <CardTitle id="qr-history-heading" className="text-base font-semibold">QR Code History</CardTitle>
          </CardHeader>
          <CardContent>
            {qrCodes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No QR codes generated yet.</p>
            ) : (
              <ul className="space-y-2" role="list" aria-label="QR code history">
                {qrCodes.map((qr) => (
                  <li
                    key={qr.id}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium text-foreground">{qr.code}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(qr.createdAt || '').toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={qr.isActive ? 'default' : 'outline'}
                        className={qr.isActive ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {qr.isActive ? 'Available' : 'Invalid'}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(qr.id)}
                        aria-label={`Delete ${qr.code}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">Delete {qr.code}</span>
                      </Button>
                    </div>
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

export default QrCodePage;
