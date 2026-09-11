import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DEV_ADMIN_EMAIL = 'admin@njsb.com';
const DEV_ADMIN_PASSWORD = 'admin123';

interface LoginPageProps {
  onLogin?: (email: string, password: string) => Promise<void>;
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  className?: string;
}

const defaultLogo = {
  url: 'https://www.shadcnblocks.com',
  src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg',
  alt: 'logo',
  title: 'shadcnblocks.com',
};

function LoginPage({
  onLogin,
  heading = 'Admin Login',
  logo = defaultLogo,
  buttonText = 'Login',
  className,
}: LoginPageProps) {
  const [email, setEmail] = useState(DEV_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEV_ADMIN_PASSWORD);
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
      await onLogin?.(email.trim(), password);
    } catch (e) {
      setError((e as Error).message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={cn('flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8', className)} role="main">
      <div className="w-full max-w-md">
        <header className="mb-6 flex flex-col items-center gap-5">
          <a href={logo.url} className="inline-flex items-center justify-center" aria-label={logo.alt}>
            <img src={logo.src} alt={logo.alt} title={logo.title} className="h-10 dark:invert" />
          </a>
          {heading && <h1 className="text-center text-xl font-semibold tracking-tight text-slate-900">{heading}</h1>}
        </header>

        <form onSubmit={handleSubmit} className="w-full rounded-xl border border-slate-200 bg-white px-5 py-6 shadow-sm" noValidate>
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-medium text-slate-600">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
                autoComplete="email"
                autoFocus
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-xs font-medium text-slate-600">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
                autoComplete="current-password"
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            {error && (
              <p id="login-error" className="text-xs text-red-600" role="alert">
                {error}
              </p>
            )}

            <div className="rounded-md bg-slate-50 px-2.5 py-2 text-[11px] text-slate-600">
              Test admin: admin@njsb.com / admin123
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-10 w-full rounded-md bg-slate-900 text-white hover:bg-slate-800"
            >
              {isSubmitting ? 'Signing in...' : buttonText}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export { LoginPage };
export default LoginPage;
