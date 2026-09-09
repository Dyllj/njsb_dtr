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
      <section className="flex items-center justify-center py-12" aria-live="polite">
        <Loader2 className="animate-spin size-8 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Loading dashboard...</span>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-12" role="alert">
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
    <div className="flex flex-col gap-6 pt-4">
      <header className="pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of intern attendance and activity</p>
      </header>

      <section aria-labelledby="stats-heading" className="space-y-4">
        <h2 id="stats-heading" className="sr-only">Key Statistics</h2>
        <StatCards items={statItems} />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7 space-y-6" aria-labelledby="main-content-heading">
          <h2 id="main-content-heading" className="sr-only">Main Dashboard Content</h2>
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
        </section>

        <aside className="lg:col-span-5 space-y-6" aria-labelledby="sidebar-content-heading">
          <h2 id="sidebar-content-heading" className="sr-only">Summary & Activity</h2>
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
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
