import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useQRCodes } from '@/lib/hooks/useSupabaseData';
import { useInterns } from '@/lib/hooks/useSupabaseData';

function ScanPage() {
  const { code } = useParams<{ code: string }>();
  const { qrCodes, loading: qrLoading } = useQRCodes();
  const { interns, refetch } = useInterns();

  const [internId, setInternId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');

  const qrCode = qrCodes.find((qr) => qr.code === code);
  const qrLoadingOrMissing = qrLoading || !code;

  if (qrLoadingOrMissing) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </div>
    );
  }

  if (!qrCode || !qrCode.isActive) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md w-full">
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <XCircle className="size-12 text-red-600" />
              <h2 className="text-lg font-semibold">QR Code Expired</h2>
              <p className="text-sm text-muted-foreground">
                This QR code is no longer valid. Please ask your administrator for the current QR code.
              </p>
              <Badge variant="outline" className="mt-2">Status: Invalid</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setMessage('');

    const trimmedId = internId.trim();
    if (!trimmedId) {
      setResult('error');
      setMessage('Please enter your Intern ID.');
      return;
    }

    const intern = interns.find((it) => it.id === trimmedId || it.id.toLowerCase() === trimmedId.toLowerCase());
    if (!intern) {
      setResult('error');
      setMessage('Intern ID not found. Please check your ID and try again.');
      return;
    }

    setSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { supabase } = await import('@/lib/supabase');

      const { error } = await supabase.from('attendance').upsert({
        intern_id: intern.id,
        date: today,
        time_in: new Date().toISOString(),
        status: 'PRESENT',
      }, {
        onConflict: 'intern_id,date',
      });

      if (error) throw error;

      setResult('success');
      setMessage(`Welcome, ${intern.firstName}! Your attendance has been recorded for today.`);
      setInternId('');
      await refetch();
    } catch (e) {
      setResult('error');
      setMessage((e as Error).message || 'Failed to record attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Intern Check-In</CardTitle>
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {result === 'success' ? (
            <div className="flex flex-col items-center gap-3 text-center py-4">
              <CheckCircle2 className="size-12 text-green-600" />
              <h3 className="text-base font-semibold">Check-in Successful</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <QrCode className="size-10 text-red-800" />
                <p className="text-sm text-muted-foreground">
                  Scan verified. Enter your Intern ID below to record your attendance for today.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="intern-id" className="text-xs font-medium text-muted-foreground">
                  Intern ID
                </label>
                <Input
                  id="intern-id"
                  value={internId}
                  onChange={(e) => setInternId(e.target.value)}
                  placeholder="e.g. I-001"
                  disabled={submitting}
                  autoFocus
                />
              </div>

              {result === 'error' && (
                <p className="text-sm text-destructive">{message}</p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  'Check In'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ScanPage;
