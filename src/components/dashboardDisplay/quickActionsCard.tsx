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
    <Card className="gap-4 rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {actions.map(({ label, icon: Icon, to }) => (
            <Button
              key={label}
              variant="outline"
              asChild
              className="h-auto flex-col gap-2 border border-[#e5e7eb] bg-[#fbfbfa] px-5 py-4 shadow-[0_6px_16px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(15,23,42,0.08)]"
            >
              <Link to={to}>
                <Icon className="size-5" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default QuickActionsCard;
