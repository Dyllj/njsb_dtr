import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Signup1Props {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  signupText?: string;
  signupUrl?: string;
  className?: string;
}

const defaultLogo = {
  url: 'https://www.shadcnblocks.com',
  src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg',
  alt: 'logo',
  title: 'shadcnblocks.com',
};

function Signup1({
  heading = 'Sign up',
  logo = defaultLogo,
  buttonText = 'Create Account',
  signupText = 'Already a user?',
  signupUrl = 'https://shadcnblocks.com',
  className,
}: Signup1Props) {
  return (
    <section className={cn('flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8', className)}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-5">
          <a href={logo.url} className="inline-flex items-center justify-center" aria-label={logo.alt}>
            <img src={logo.src} alt={logo.alt} title={logo.title} className="h-10 dark:invert" />
          </a>

          <div className="w-full rounded-xl border border-slate-200 bg-white px-5 py-6 shadow-sm">
            {heading && <h1 className="mb-4 text-center text-xl font-semibold tracking-tight text-slate-900">{heading}</h1>}

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                aria-label="Email"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
              />
              <input
                type="password"
                placeholder="Password"
                aria-label="Password"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                aria-label="Confirm password"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                required
              />

              <Button type="submit" className="mt-1 h-10 w-full rounded-md bg-slate-900 text-white hover:bg-slate-800">
                {buttonText}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 text-sm text-slate-500">
            <p>{signupText}</p>
            <a href={signupUrl} className="font-medium text-slate-900 transition hover:text-slate-700 hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Signup1 };
export default function LoginPage() {
  return <Signup1 />;
}
