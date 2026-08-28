import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type AttendanceStatus = 'WORKING' | 'COMPLETE' | 'UNDERTIME' | 'ABSENT' | 'LATE';

export type AttendanceRow = {
  intern: string;
  timeIn: string;
  timeOut: string;
  status: AttendanceStatus;
};

const statusStyles: Record<AttendanceStatus, string> = {
  WORKING: 'bg-sky-500/10 text-sky-700 border-sky-200',
  COMPLETE: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  UNDERTIME: 'bg-amber-500/10 text-amber-700 border-amber-200',
  ABSENT: 'bg-rose-500/10 text-rose-700 border-rose-200',
  LATE: 'bg-orange-500/10 text-orange-700 border-orange-200',
};

type AttendanceOverviewCardProps = {
  rows?: AttendanceRow[];
  loading?: boolean;
  error?: Error | null;
};

function AttendanceOverviewCard({ rows, loading, error }: AttendanceOverviewCardProps) {
  if (loading) {
    return (
      <Card className="gap-4 rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <CardHeader>
          <CardTitle>Today's Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin size-6 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="gap-4 rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <CardHeader>
          <CardTitle>Today's Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-4 rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <CardHeader>
        <CardTitle>Today's Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Intern</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!rows || rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No attendance records for today.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.intern}>
                  <TableCell className="font-medium">{row.intern}</TableCell>
                  <TableCell>{row.timeIn}</TableCell>
                  <TableCell>{row.timeOut}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[row.status]}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Link
          to="/attendance"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          View all attendance &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}

export default AttendanceOverviewCard;
