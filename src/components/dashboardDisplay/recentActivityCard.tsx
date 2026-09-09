import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export type ActivityItem = {
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
  loading?: boolean;
  error?: Error | null;
};

function RecentActivityCard({ items = defaultActivity, loading, error }: RecentActivityCardProps) {
  if (loading) {
    return (
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin size-6 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Loading recent activity...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive" role="alert">Failed to load: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul role="list" aria-label="Recent activity items">
          {!items || items.length === 0 ? (
            <li className="px-6 py-4 text-center text-sm text-muted-foreground">
              No activity yet.
            </li>
          ) : (
            items.map((item, index) => (
              <li key={`${item.intern}-${item.time}`}>
                <div className="flex items-center justify-between px-6 py-3 text-sm border-b border-border last:border-0">
                  <span className="font-medium text-foreground">{item.intern}</span>
                  <span className="text-muted-foreground">{item.action}</span>
                  <time className="text-muted-foreground whitespace-nowrap">{item.time}</time>
                </div>
                {index < items.length - 1 && <Separator className="mx-6" />}
              </li>
            ))
          )}
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
