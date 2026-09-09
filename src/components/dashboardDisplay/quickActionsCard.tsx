import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UserPlus,
  MapPinPlus,
  CalendarPlus,
  FileBarChart,
  FileSearch,
  type LucideIcon,
} from 'lucide-react';

type QuickAction = {
  label: string;
  icon: LucideIcon;
  to: string;
};

const defaultActions: QuickAction[] = [
  { label: 'Add Intern', icon: UserPlus, to: '/interns' },
  { label: 'Add Station', icon: MapPinPlus, to: '/settings' },
  { label: 'Create Schedule', icon: CalendarPlus, to: '/schedule' },
  { label: 'Generate Report', icon: FileBarChart, to: '/report' },
  { label: 'View DTR', icon: FileSearch, to: '/report' },
];

type QuickActionsCardProps = {
  actions?: QuickAction[];
};

function QuickActionsCard({ actions = defaultActions }: QuickActionsCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <nav aria-label="Quick actions">
          <ul className="flex flex-wrap gap-3" role="list">
            {actions.map(({ label, icon: Icon, to }) => (
              <li key={label}>
                <Button
                  variant="outline"
                  asChild
                  className="h-auto flex flex-col gap-2 border border-border bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Link to={to} className="flex flex-col items-center gap-2">
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="text-xs font-medium text-center">{label}</span>
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}

export default QuickActionsCard;
