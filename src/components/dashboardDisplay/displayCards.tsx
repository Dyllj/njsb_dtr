import { ArrowUpRight, Eye, FileText } from 'lucide-react';

type CardItem = {
  label: string;
  value: number | string;
  accent?: string;
};

type ActionLink = {
  label: string;
  href?: string;
  icon?: typeof Eye;
};

type DisplayCardsProps = {
  items?: CardItem[];
  actions?: ActionLink[];
};

function DisplayCards({
  items = [
    { label: 'Total Interns', value: 120, accent: 'bg-sky-500/10 text-sky-600' },
    { label: 'Present Today', value: 96, accent: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'Absent Today', value: 18, accent: 'bg-rose-500/10 text-rose-600' },
    { label: 'Late Today', value: 6, accent: 'bg-amber-500/10 text-amber-600' },
  ],
  actions = [
    { label: 'View all interns', href: '#', icon: Eye },
    { label: 'View details', href: '#', icon: FileText },
  ],
}: DisplayCardsProps) {
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.label}
            className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${item.accent ?? 'bg-slate-100 text-slate-700'}`}
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <h3 className="mt-3 text-3xl font-bold text-slate-900">{item.value}</h3>
          </article>
        ))}
      </section>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
        {actions.map(({ label, href = '#', icon: Icon }) => (
          <a
            key={label}
            href={href}
            className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-amber-400 hover:text-amber-600"
          >
            <span className="relative z-10 transition-all duration-300 group-hover:translate-x-0.5">{label}</span>
            {Icon && (
              <Icon className="text-base opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
            {!Icon && <ArrowUpRight className="text-base opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
          </a>
        ))}
      </div>
    </>
  );
}

export default DisplayCards;