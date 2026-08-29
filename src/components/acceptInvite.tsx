import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

interface AcceptInviteProps {
  onLogin?: (email: string, password: string) => Promise<void>;
}

function AcceptInvite({ onLogin }: AcceptInviteProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@njsb.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (onLogin) {
        await onLogin(email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (e) {
      setError((e as Error).message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex flex-col items-center gap-5">
              <div className="flex justify-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-red-800 text-white">
                  <span className="text-lg font-bold">NJSB</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@company.com"
                    className="h-10 w-full"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="h-10 w-full"
                    autoComplete="current-password"
                    required
                  />
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </form>

              <p className="text-center text-xs text-slate-500">
                Demo credentials: admin@njsb.com / admin123
              </p>
            </div>
          </div>

          <div className="ml-10 hidden md:col-span-3 md:flex md:flex-col md:justify-center md:gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-900">
                Welcome to NJSB DTR
              </h1>
              <p className="text-lg text-slate-600">
                Daily Time Report administration portal. Manage interns, track attendance,
                generate reports, and configure calendar holidays — all backed by
                Supabase.
              </p>
              <p className="text-slate-500">
                This centralized dashboard lets administrators oversee intern schedules,
                monitor daily attendance, and produce compliance reports with real-time
                data synced across all devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AcceptInvite;
