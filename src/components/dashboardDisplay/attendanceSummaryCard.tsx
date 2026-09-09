import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SummarySlice = {
  label: string;
  value: number;
  color: string;
};

const defaultSlices: SummarySlice[] = [
  { label: 'Present', value: 19, color: '#0ea5e9' },
  { label: 'Absent', value: 5, color: '#f43f5e' },
  { label: 'Late', value: 3, color: '#f59e0b' },
];

type AttendanceSummaryCardProps = {
  slices?: SummarySlice[];
  loading?: boolean;
  error?: Error | null;
};

function AttendanceSummaryCard({ slices = defaultSlices, loading, error }: AttendanceSummaryCardProps) {
  const [period, setPeriod] = useState('today');
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  if (loading) {
    return (
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin size-6 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Loading attendance summary...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive" role="alert">Failed to load: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attendance Summary</CardTitle>
        <Select value={period} onValueChange={setPeriod} aria-label="Select time period">
          <SelectTrigger size="sm" className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="h-48 w-full" role="img" aria-label={`Attendance summary pie chart showing ${slices.map(s => `${s.label} ${s.value}`).join(', ')}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="label"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              >
                {slices.map((slice) => (
                  <Cell key={slice.label} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="w-full space-y-2" aria-label="Attendance summary details">
          {slices.map((slice) => (
            <li key={slice.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden="true"
                />
                {slice.label}
              </span>
              <span className="font-medium text-foreground">
                {slice.value}{' '}
                <span className="text-muted-foreground">
                  ({total ? ((slice.value / total) * 100).toFixed(1) : '0.0'}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default AttendanceSummaryCard;
