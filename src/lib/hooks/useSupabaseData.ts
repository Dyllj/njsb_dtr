/* eslint-disable react-hooks/set-state-in-effect -- data fetching effects intentionally call setState */
import { useCallback, useEffect, useState } from 'react';

import type { Intern } from '@/lib/services/internService';
import * as internService from '@/lib/services/internService';
import type { AdminRecord } from '@/lib/services/adminService';
import * as adminService from '@/lib/services/adminService';
import type { ReportRecord } from '@/lib/services/reportService';
import * as reportService from '@/lib/services/reportService';
import type { Holiday } from '@/lib/services/holidayService';
import * as holidayService from '@/lib/services/holidayService';
import type { AttendanceSummary, DashboardAttendanceRow, DashboardActivityItem, WeeklyAttendanceRow } from '@/lib/services/attendanceService';
import * as attendanceService from '@/lib/services/attendanceService';

export function useInterns() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await internService.getInterns();
      setInterns(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    internService
      .getInterns()
      .then((data) => {
        if (!cancelled) setInterns(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const create = useCallback(async (intern: Omit<Intern, 'id'>) => {
    const newIntern = await internService.createIntern(intern);
    setInterns((prev) => [newIntern, ...prev]);
    return newIntern;
  }, []);

  const update = useCallback(async (id: string, intern: Omit<Intern, 'id'>) => {
    const updated = await internService.updateIntern(id, intern);
    setInterns((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await internService.deleteIntern(id);
    setInterns((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { interns, loading, error, refetch, create, update, remove };
}

export function useAdmins() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminService
      .getAdmins()
      .then((data) => {
        if (!cancelled) setAdmins(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const create = useCallback(async (admin: Omit<AdminRecord, 'id'>) => {
    const newAdmin = await adminService.createAdmin(admin);
    setAdmins((prev) => [newAdmin, ...prev]);
    return newAdmin;
  }, []);

  const update = useCallback(async (id: string, admin: Omit<AdminRecord, 'id'>) => {
    const updated = await adminService.updateAdmin(id, admin);
    setAdmins((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await adminService.deleteAdmin(id);
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { admins, loading, error, refetch, create, update, remove };
}

export function useReports() {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    reportService
      .getReports()
      .then((data) => {
        if (!cancelled) setReports(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const create = useCallback(async (report: Omit<ReportRecord, 'id'>) => {
    const newReport = await reportService.createReport(report);
    setReports((prev) => [newReport, ...prev]);
    return newReport;
  }, []);

  const update = useCallback(async (id: string, report: Omit<ReportRecord, 'id'>) => {
    const updated = await reportService.updateReport(id, report);
    setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await reportService.deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { reports, loading, error, refetch, create, update, remove };
}

export function useHolidays() {
  const [holidays, setHolidays] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Holiday[] = await holidayService.getHolidays();
      const map: Record<string, string> = {};
      data.forEach((h) => {
        map[h.date] = h.name;
      });
      setHolidays(map);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    holidayService
      .getHolidays()
      .then((data: Holiday[]) => {
        if (!cancelled) {
          const map: Record<string, string> = {};
          data.forEach((h) => {
            map[h.date] = h.name;
          });
          setHolidays(map);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(async (date: string, name: string, isCurrentlyHoliday: boolean) => {
    await holidayService.toggleHoliday(date, name, isCurrentlyHoliday);
    if (isCurrentlyHoliday) {
      setHolidays((prev) => {
        const next = { ...prev };
        delete next[date];
        return next;
      });
    } else {
      setHolidays((prev) => ({ ...prev, [date]: name }));
    }
  }, []);

  return { holidays, loading, error, refetch, toggle };
}

export function useAttendance(date?: string) {
  const [data, setData] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setLoading(true);
    attendanceService
      .getAttendanceOverview(date)
      .then((summary) => {
        if (!cancelled) setData(summary);
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  return { data, loading, error };
}

export function useMonthlyAttendance(year: number, month: number) {
  const [data, setData] = useState<Record<string, AttendanceSummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await attendanceService.getMonthlyAttendance(year, month);
      setData(result);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    attendanceService
      .getMonthlyAttendance(year, month)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  return { data, loading, error, refetch };
}

export type DashboardStats = {
  totalInterns: number;
  presentToday: number;
  workingNow: number;
  lateToday: number;
  absentToday: number;
  percentage: string;
};

export type DashboardData = {
  stats: DashboardStats;
  overviewRows: DashboardAttendanceRow[];
  summarySlices: { label: string; value: number; color: string }[];
  activityItems: DashboardActivityItem[];
  weeklyRows: WeeklyAttendanceRow[];
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];

      const [internCount, stats, overviewRows, summary, activityItems, weeklyRows] = await Promise.all([
        internService.getInternCount(),
        attendanceService.getInternStats(),
        attendanceService.getTodayAttendanceRows(),
        attendanceService.getAttendanceOverview(today),
        attendanceService.getRecentActivity(),
        attendanceService.getWeeklyAttendanceGrid(),
      ]);

      const percentage =
        stats.presentToday > 0
          ? `${((stats.presentToday / (stats.presentToday + stats.absentToday)) * 100).toFixed(1)}%`
          : '0.0%';

      setData({
        stats: {
          totalInterns: internCount,
          presentToday: stats.presentToday,
          workingNow: stats.workingNow,
          lateToday: stats.late,
          absentToday: stats.absent,
          percentage,
        },
        overviewRows,
        summarySlices: [
          { label: 'Present', value: summary.present, color: '#0ea5e9' },
          { label: 'Absent', value: summary.absent, color: '#f43f5e' },
          { label: 'Late', value: summary.late, color: '#f59e0b' },
        ],
        activityItems,
        weeklyRows,
      });
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    Promise.all([
      internService.getInternCount(),
      attendanceService.getInternStats(),
      attendanceService.getTodayAttendanceRows(),
      attendanceService.getAttendanceOverview(today),
      attendanceService.getRecentActivity(),
      attendanceService.getWeeklyAttendanceGrid(),
    ])
      .then(([internCount, stats, overviewRows, summary, activityItems, weeklyRows]) => {
        if (!cancelled) {
          const percentage =
            stats.presentToday > 0
              ? `${((stats.presentToday / (stats.presentToday + stats.absentToday)) * 100).toFixed(1)}%`
              : '0.0%';

          setData({
            stats: {
              totalInterns: internCount,
              presentToday: stats.presentToday,
              workingNow: stats.workingNow,
              lateToday: stats.late,
              absentToday: stats.absent,
              percentage,
            },
            overviewRows,
            summarySlices: [
              { label: 'Present', value: summary.present, color: '#0ea5e9' },
              { label: 'Absent', value: summary.absent, color: '#f43f5e' },
              { label: 'Late', value: summary.late, color: '#f59e0b' },
            ],
            activityItems,
            weeklyRows,
          });
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error, refetch };
}
