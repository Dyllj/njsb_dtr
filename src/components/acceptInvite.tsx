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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8" role="main">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="lg:col-span-6 flex flex-col items-center justify-center p-8" aria-labelledby="login-heading">
            <header className="mb-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex size-14 items-center justify-center rounded-xl bg-red-800 text-white">
                  <span className="text-xl font-bold">NJSB</span>
                </div>
              </div>
              <h1 id="login-heading" className="text-3xl font-bold text-slate-900">Admin Login</h1>
              <p className="mt-2 text-slate-600">Sign in to access the Daily Time Report dashboard</p>
            </header>

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  className="h-11 w-full"
                  autoComplete="email"
                  required
                  autoFocus
                  aria-describedby={error ? 'login-error' : undefined}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="h-11 w-full"
                  autoComplete="current-password"
                  required
                  aria-describedby={error ? 'login-error' : undefined}
                />
              </div>

              {error && (
                <p id="login-error" className="text-sm text-red-600" role="alert">{error}</p>
              )}

              <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Demo credentials: admin@njsb.com / admin123
            </p>
          </section>

          <aside className="hidden lg:block lg:col-span-6 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <div className="h-full flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900">
                  Welcome to NJSB DTR
                </h2>
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
          </aside>
        </div>
      </div>
    </main>
  );
}

export default AcceptInvite;
