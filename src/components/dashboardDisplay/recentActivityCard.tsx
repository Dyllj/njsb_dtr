import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type ActivityItem = {
  intern: string;
  action: string;
  time: string;
};

const defaultActivity: ActivityItem[] = [
  { intern: 'Juan Dela Cruz', action: 'Time in', time: '08:17 AM' },
  { intern: 'Pedro Reyes', action: 'Time out', time: '04:30 PM' },
  { intern: 'Maria Santos', action: 'Time out', time: '05:02 PM' },
  { intern: 'Ana Garcia', action: 'Marked absent', time: '08:10 AM' },
  { intern: 'Lito Navarro', action: 'Time in', time: '08:05 AM' },
];

type RecentActivityCardProps = {
  items?: ActivityItem[];
};

function RecentActivityCard({ items = defaultActivity }: RecentActivityCardProps) {
  return (
    <Card className="gap-4 rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul>
          {items.map((item, index) => (
            <li key={`${item.intern}-${item.time}`}>
              <div className="flex items-center justify-between px-6 py-2.5 text-sm">
                <span className="font-medium">{item.intern}</span>
                <span className="text-muted-foreground">{item.action}</span>
                <span className="text-muted-foreground">{item.time}</span>
              </div>
              {index < items.length - 1 && <Separator />}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link
          to="/attendance"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          View all activity &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}

export default RecentActivityCard;
