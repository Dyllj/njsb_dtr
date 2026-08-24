import StatCards from '@/components/dashboardDisplay/statCards';
import AttendanceOverviewCard from '@/components/dashboardDisplay/attendanceOverviewCard';
import AttendanceSummaryCard from '@/components/dashboardDisplay/attendanceSummaryCard';
import QuickActionsCard from '@/components/dashboardDisplay/quickActionsCard';
import RecentActivityCard from '@/components/dashboardDisplay/recentActivityCard';
import WeeklyAttendanceCard from '@/components/dashboardDisplay/weeklyAttendanceCard';

function Dashboard() {
  return (
    <div className="flex flex-col gap-4 pt-5">
      <StatCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <WeeklyAttendanceCard />
          <QuickActionsCard />
          <AttendanceOverviewCard />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-1">
          <AttendanceSummaryCard />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
