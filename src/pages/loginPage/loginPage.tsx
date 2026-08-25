import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DEV_ADMIN_EMAIL = 'admin@njsb.com';
const DEV_ADMIN_PASSWORD = 'admin123';

interface LoginPageProps {
  onLogin?: () => void;
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email.trim() === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
      setError('');
      onLogin?.();
      return;
    }

    setError('Invalid email or password. Use the admin demo credentials.');
  };

  return (
    <section className={cn('flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8', className)}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-5">
          <a href={logo.url} className="inline-flex items-center justify-center" aria-label={logo.alt}>
            <img src={logo.src} alt={logo.alt} title={logo.title} className="h-10 dark:invert" />
          </a>

          <form onSubmit={handleSubmit} className="w-full rounded-xl border border-slate-200 bg-white px-5 py-6 shadow-sm">
            {heading && <h1 className="mb-4 text-center text-xl font-semibold tracking-tight text-slate-900">{heading}</h1>}

            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                aria-label="Email"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                aria-label="Password"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
              />

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="rounded-md bg-slate-50 px-2.5 py-2 text-[11px] text-slate-600">
                Demo admin: admin@njsb.com / admin123
              </div>

              <Button type="submit" className="mt-1 h-10 w-full rounded-md bg-slate-900 text-white hover:bg-slate-800">
                {buttonText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export { LoginPage };
export default LoginPage;
