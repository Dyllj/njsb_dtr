import { ArrowUpRight, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

type CardAction = {
  label: string;
  to?: string;
  icon?: typeof Eye;
};

type CardItem = {
  label: string;
  value: number | string;
  accent?: string;
  action?: CardAction;
};

type DisplayCardsProps = {
  items?: CardItem[];
};

function DisplayCards({
  items = [
    {
      label: 'Total Interns',
      value: 120,
      accent: 'bg-sky-500/10 text-sky-600',
      action: { label: 'View all interns', to: '/interns', icon: Eye },
    },
    {
      label: 'Present Today',
      value: 96,
      accent: 'bg-emerald-500/10 text-emerald-600',
      action: { label: 'View details', to: '/attendance', icon: FileText },
    },
    {
      label: 'Absent Today',
      value: 18,
      accent: 'bg-rose-500/10 text-rose-600',
      action: { label: 'View details', to: '/attendance', icon: FileText },
    },
    {
      label: 'Late Today',
      value: 6,
      accent: 'bg-amber-500/10 text-amber-600',
      action: { label: 'View details', to: '/attendance', icon: FileText },
    },
  ],
}: DisplayCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.action?.icon;
        return (
          <article
            key={item.label}
            className={`flex flex-col justify-between rounded-2xl border border-[#e7ebf2] bg-[#fbfbfa] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] ${item.accent ?? 'bg-slate-100 text-slate-700'}`}
          >
            <div>
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">{item.value}</h3>
            </div>

            {item.action && (
              <Link
                to={item.action.to ?? '#'}
                className="group mt-4 inline-flex w-fit items-center gap-2  px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:text-red-800"
              >
                <span className="relative z-10 transition-all duration-300 group-hover:translate-x-0.5">
                  {item.action.label}
                </span>
                {Icon ? (
                  <Icon className="text-base opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />
                ) : (
                  <ArrowUpRight className="text-base opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
              </Link>
            )}
          </article>
        );
      })}
    </section>
  );
}

export default DisplayCards;