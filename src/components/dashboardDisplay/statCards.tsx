import { Link } from 'react-router-dom';
import { Users, Smile, Clock, AlarmClock, Frown, type LucideIcon } from 'lucide-react';

export type StatItem = {
  label: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  iconClass?: string;
  actionLabel: string;
  to: string;
};

const defaultItems: StatItem[] = [
  {
    label: 'Total Interns',
    value: 24,
    icon: Users,
    iconClass: 'text-sky-600',
    actionLabel: 'View all interns',
    to: '/interns',
  },
  {
    label: 'Present Today',
    value: 19,
    subtext: '70.4%',
    icon: Smile,
    iconClass: 'text-emerald-600',
    actionLabel: 'View details',
    to: '/attendance',
  },
  {
    label: 'Currently Working',
    value: 16,
    icon: Clock,
    iconClass: 'text-indigo-600',
    actionLabel: 'View now',
    to: '/attendance',
  },
  {
    label: 'Late Today',
    value: 3,
    icon: AlarmClock,
    iconClass: 'text-amber-600',
    actionLabel: 'View details',
    to: '/attendance',
  },
  {
    label: 'Absent Today',
    value: 5,
    icon: Frown,
    iconClass: 'text-rose-600',
    actionLabel: 'View details',
    to: '/attendance',
  },
];

type StatCardsProps = {
  items?: StatItem[];
};

function StatCards({ items = defaultItems }: StatCardsProps) {
  return (
    <section aria-labelledby="stats-heading" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <h2 id="stats-heading" className="sr-only">Key Statistics</h2>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.label} className="rounded-2xl border border-border bg-card shadow-sm p-4 transition-shadow hover:shadow-md">
            <header className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">{item.label}</h3>
              <Icon className={`size-5 ${item.iconClass ?? 'text-muted-foreground'}`} aria-hidden="true" />
            </header>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{item.value}</span>
                {item.subtext && (
                  <span className="text-sm text-muted-foreground">{item.subtext}</span>
                )}
              </div>
              <Link
                to={item.to}
                className="mt-2 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.actionLabel} &rarr;
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default StatCards;
