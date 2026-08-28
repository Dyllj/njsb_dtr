import { Loader2 } from 'lucide-react';
import StatCards from '@/components/dashboardDisplay/statCards';
import AttendanceOverviewCard from '@/components/dashboardDisplay/attendanceOverviewCard';
import AttendanceSummaryCard from '@/components/dashboardDisplay/attendanceSummaryCard';
import QuickActionsCard from '@/components/dashboardDisplay/quickActionsCard';
import RecentActivityCard from '@/components/dashboardDisplay/recentActivityCard';
import WeeklyAttendanceCard from '@/components/dashboardDisplay/weeklyAttendanceCard';

import { useDashboardData } from '@/lib/hooks/useSupabaseData';
import type { StatItem } from '@/components/dashboardDisplay/statCards';
import { Users, Smile, Clock, AlarmClock, Frown } from 'lucide-react';

function Dashboard() {
  const { data, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <section className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-sm text-destructive">Failed to load dashboard data: {error.message}</p>
        <button
          onClick={refetch}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-red-800 hover:text-red-800"
        >
          Retry
        </button>
      </section>
    );
  }

  const stats = data?.stats;
  const statItems: StatItem[] = stats
    ? [
        {
          label: 'Total Interns',
          value: stats.totalInterns,
          icon: Users,
          iconClass: 'text-sky-600',
          actionLabel: 'View all interns',
          to: '/interns',
        },
        {
          label: 'Present Today',
          value: stats.presentToday,
          subtext: stats.percentage,
          icon: Smile,
          iconClass: 'text-emerald-600',
          actionLabel: 'View details',
          to: '/attendance',
        },
        {
          label: 'Currently Working',
          value: stats.workingNow,
          icon: Clock,
          iconClass: 'text-indigo-600',
          actionLabel: 'View now',
          to: '/attendance',
        },
        {
          label: 'Late Today',
          value: stats.lateToday,
          icon: AlarmClock,
          iconClass: 'text-amber-600',
          actionLabel: 'View details',
          to: '/attendance',
        },
        {
          label: 'Absent Today',
          value: stats.absentToday,
          icon: Frown,
          iconClass: 'text-rose-600',
          actionLabel: 'View details',
          to: '/attendance',
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-4 pt-5">
      <StatCards items={statItems} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <WeeklyAttendanceCard
            rows={data?.weeklyRows}
            loading={loading}
            error={error}
          />
          <QuickActionsCard />
          <AttendanceOverviewCard
            rows={data?.overviewRows}
            loading={loading}
            error={error}
          />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-1">
          <AttendanceSummaryCard
            slices={data?.summarySlices}
            loading={loading}
            error={error}
          />
          <RecentActivityCard
            items={data?.activityItems}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
