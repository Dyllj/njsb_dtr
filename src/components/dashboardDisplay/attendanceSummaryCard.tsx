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
};

function AttendanceSummaryCard({ slices = defaultSlices }: AttendanceSummaryCardProps) {
  const [period, setPeriod] = useState('today');
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <Card className="gap-4 rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attendance Summary</CardTitle>
        <Select value={period} onValueChange={setPeriod}>
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
        <div className="h-48 w-full">
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
        <ul className="w-full space-y-2">
          {slices.map((slice) => (
            <li key={slice.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
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
