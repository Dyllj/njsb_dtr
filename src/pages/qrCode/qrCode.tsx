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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight ml-5">QR Code Attendance</h2>
        <Button onClick={handleGenerate} disabled={submitting || !!activeQR}>
          <QrCode className="size-4" />
          {submitting ? 'Generating...' : activeQR ? 'QR Code Active' : 'Generate QR Code'}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive ml-5">Failed to load QR codes: {error.message}</p>
      )}
      {submitError && (
        <p className="text-sm text-destructive ml-5">{submitError}</p>
      )}

      {activeQR && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Current Active QR Code</CardTitle>
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="size-3.5 mr-1" />
                Available
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-lg border border-border bg-white p-4">
                <QRCodeSVG
                  value={`${window.location.origin}/scan/${activeQR.code}`}
                  size={200}
                  level="M"
                  includeMargin
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Code: <span className="font-mono font-medium text-foreground">{activeQR.code}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Interns can scan this QR code to check in. Print this page for placement at the entrance.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="size-4 mr-2" />
                Print QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!activeQR && !loading && (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <XCircle className="size-10 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">No active QR code</p>
              <p className="text-xs text-muted-foreground">Generate a new QR code for interns to scan and check in.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">QR Code History</CardTitle>
        </CardHeader>
        <CardContent>
          {qrCodes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No QR codes generated yet.</p>
          ) : (
            <div className="space-y-2">
              {qrCodes.map((qr) => (
                <div
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
                    <Badge variant={qr.isActive ? 'default' : 'outline'} className={qr.isActive ? 'bg-green-600 hover:bg-green-700' : ''}>
                      {qr.isActive ? 'Available' : 'Invalid'}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(qr.id)}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">Delete {qr.code}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default QrCodePage;
