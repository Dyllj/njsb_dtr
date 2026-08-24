import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Smile, Clock, AlarmClock, Frown, type LucideIcon } from 'lucide-react';

type StatItem = {
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
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="gap-3 rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] py-4 shadow-[0_10px_22px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]">
            <CardHeader className="flex flex-row items-center justify-between px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
              <Icon className={`size-5 ${item.iconClass ?? 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent className="px-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{item.value}</span>
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
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

export default StatCards;
