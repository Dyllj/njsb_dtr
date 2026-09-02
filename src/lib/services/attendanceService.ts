import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type AttendanceRow = Database['public']['Tables']['attendance']['Row'];

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'UNDERTIME';
export type AttendanceSession = 'AM' | 'PM';

/**
 * Returns the current session based on local time:
 * - AM: 00:00 to 11:59
 * - PM: 12:00 to 23:59
 */
export function getCurrentSession(now: Date = new Date()): AttendanceSession {
  return now.getHours() < 12 ? 'AM' : 'PM';
}

export type AttendanceSummary = {
  present: number;
  absent: number;
  late: number;
  total: number;
};

type AttendanceWithIntern = AttendanceRow & {
  interns?: { first_name: string; last_name: string } | null;
};

export function formatTime(timeStr: string | null): string {
  if (!timeStr) return '—';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 || 12;
  return `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
}

export async function getAttendanceOverview(date: string): Promise<AttendanceSummary> {
  const { data, error } = await supabase
    .from('attendance')
    .select('status')
    .eq('date', date);

  if (error) throw error;

  const present = data.filter((r: AttendanceRow) => r.status === 'PRESENT').length;
  const absent = data.filter((r: AttendanceRow) => r.status === 'ABSENT').length;
  const late = data.filter((r: AttendanceRow) => r.status === 'LATE').length;
  const total = data.length;

  return { present, absent, late, total };
}

export async function getWeeklyAttendance(): Promise<Record<string, AttendanceSummary>> {
  const today = new Date();
  const startOfWeek = new Date(today);
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  const dates: string[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const { data, error } = await supabase
    .from('attendance')
    .select('date, status')
    .in('date', dates);

  if (error) throw error;

  const result: Record<string, AttendanceSummary> = {};
  dates.forEach((date) => {
    result[date] = { present: 0, absent: 0, late: 0, total: 0 };
  });

  (data as AttendanceRow[]).forEach((row: AttendanceRow) => {
    const dateKey = row.date;
    if (!result[dateKey]) {
      result[dateKey] = { present: 0, absent: 0, late: 0, total: 0 };
    }
    result[dateKey].total++;
    if (row.status === 'PRESENT') result[dateKey].present++;
    else if (row.status === 'ABSENT') result[dateKey].absent++;
    else if (row.status === 'LATE') result[dateKey].late++;
  });

  return result;
}

export async function getMonthlyAttendance(year: number, month: number): Promise<Record<string, AttendanceSummary>> {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('attendance')
    .select('date, status')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;

  const result: Record<string, AttendanceSummary> = {};

  (data as AttendanceRow[]).forEach((row: AttendanceRow) => {
    const dateKey = row.date;
    if (!result[dateKey]) {
      result[dateKey] = { present: 0, absent: 0, late: 0, total: 0 };
    }
    result[dateKey].total++;
    if (row.status === 'PRESENT') result[dateKey].present++;
    else if (row.status === 'ABSENT') result[dateKey].absent++;
    else if (row.status === 'LATE') result[dateKey].late++;
  });

  return result;
}

export async function getAttendanceRows(): Promise<AttendanceRow[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}

export async function getInternStats(): Promise<{
  total: number;
  presentToday: number;
  workingNow: number;
  late: number;
  absent: number;
}> {
  const today = new Date().toISOString().split('T')[0];

  const [{ count: total }, presentData, lateData, absentData] = await Promise.all([
    supabase.from('interns').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
    supabase.from('attendance').select('*').eq('date', today).eq('status', 'PRESENT'),
    supabase.from('attendance').select('*').eq('date', today).eq('status', 'LATE'),
    supabase.from('attendance').select('*').eq('date', today).eq('status', 'ABSENT'),
  ]);

  const presentRows = presentData?.data ?? [];
  // Working now: rows with no time_out yet (currently checked in for that session)
  const workingNow = presentRows.filter((r: AttendanceRow) => !r.time_out).length;

  return {
    total: total ?? 0,
    presentToday: presentRows.length,
    workingNow,
    late: lateData?.data?.length ?? 0,
    absent: absentData?.data?.length ?? 0,
  };
}

export type WeeklyAttendanceRow = {
  internId: string;
  internName: string;
  days: string[];
  dailyStatus: ('present' | 'absent' | 'late' | 'undftime' | '—')[];
};

export async function getWeeklyAttendanceGrid(): Promise<WeeklyAttendanceRow[]> {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(diff);

  const dates: string[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const { data, error } = await supabase
    .from('attendance')
    .select(`
      intern_id,
      date,
      status,
      interns!inner(first_name, last_name)
    `)
    .in('date', dates)
    .order('intern_id');

  if (error) throw error;

  const internMap: Record<string, WeeklyAttendanceRow> = {};

  (data as AttendanceWithIntern[]).forEach((row) => {
    const internId = row.intern_id;
    const internName = row.interns
      ? `${row.interns.first_name} ${row.interns.last_name}`.trim()
      : 'Unknown';

    if (!internMap[internId]) {
      internMap[internId] = {
        internId,
        internName,
        days: dayLabels,
        dailyStatus: dates.map(() => '—' as const),
      };
    }

    const dateIdx = dates.indexOf(row.date);
    if (dateIdx >= 0) {
      // Priority for the day cell: LATE > UNDERTIME > PRESENT > ABSENT.
      // This way a day with one LATE session still shows as LATE.
      const current = internMap[internId].dailyStatus[dateIdx];
      const next = (() => {
        switch (row.status) {
          case 'PRESENT': return 'present' as const;
          case 'ABSENT': return 'absent' as const;
          case 'LATE': return 'late' as const;
          case 'UNDERTIME': return 'undftime' as const;
          default: return current;
        }
      })();

      const priority: Record<string, number> = {
        '—': 0, present: 1, undftime: 2, absent: 3, late: 4,
      };
      if (priority[next] > priority[current]) {
        internMap[internId].dailyStatus[dateIdx] = next;
      }
    }
  });

  return Object.values(internMap);
}

export type DashboardAttendanceRow = {
  intern: string;
  session: AttendanceSession;
  timeIn: string;
  timeOut: string;
  status: 'WORKING' | 'COMPLETE' | 'UNDERTIME' | 'ABSENT' | 'LATE';
};

export async function getTodayAttendanceRows(): Promise<DashboardAttendanceRow[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      interns!inner(first_name, last_name)
    `)
    .eq('date', today)
    .order('time_in', { ascending: false });

  if (error) throw error;

  return (data as AttendanceWithIntern[]).map((row) => {
    const internName = row.interns
      ? `${row.interns.first_name} ${row.interns.last_name}`.trim()
      : 'Unknown';

    let status: DashboardAttendanceRow['status'];
    if (row.status === 'ABSENT') {
      status = 'ABSENT';
    } else if (row.status === 'LATE') {
      status = 'LATE';
    } else if (row.status === 'UNDERTIME') {
      status = 'UNDERTIME';
    } else if (row.status === 'PRESENT' && !row.time_out) {
      status = 'WORKING';
    } else {
      status = 'COMPLETE';
    }

    return {
      intern: internName,
      session: (row.session ?? 'AM') as AttendanceSession,
      timeIn: formatTime(row.time_in),
      timeOut: formatTime(row.time_out),
      status,
    };
  });
}

export type DashboardActivityItem = {
  intern: string;
  action: string;
  time: string;
  session: AttendanceSession;
};

export async function getRecentActivity(limit = 5): Promise<DashboardActivityItem[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      interns!inner(first_name, last_name)
    `)
    .eq('date', today)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data as AttendanceWithIntern[]).map((row) => {
    const internName = row.interns
      ? `${row.interns.first_name} ${row.interns.last_name}`.trim()
      : 'Unknown';

    const session = (row.session ?? 'AM') as AttendanceSession;
    let action: string;
    let time: string;

    if (row.time_out) {
      action = `Time out (${session})`;
      time = formatTime(row.time_out);
    } else if (row.time_in) {
      action = row.status === 'ABSENT' ? `Marked absent (${session})` : `Time in (${session})`;
      time = formatTime(row.time_in);
    } else {
      action = `Marked absent (${session})`;
      time = '—';
    }

    return { intern: internName, action, time, session };
  });
}

/**
 * Record a time-in for the given intern on the given session (AM/PM).
 * Uses upsert on (intern_id, date, session) so re-scanning does not duplicate.
 */
export async function recordCheckInSession(
  internId: string,
  session: AttendanceSession,
  options: { date?: string; now?: string } = {}
): Promise<AttendanceRow> {
  const date = options.date ?? new Date().toISOString().split('T')[0];
  const timeIn = options.now ?? new Date().toISOString();

  const { data, error } = await supabase
    .from('attendance')
    .upsert(
      {
        intern_id: internId,
        date,
        session,
        time_in: timeIn,
        status: 'PRESENT',
      },
      { onConflict: 'intern_id,date,session' }
    )
    .select()
    .single();

  if (error) throw error;
  return data as AttendanceRow;
}

/**
 * Record a time-out for the given intern on the given session (AM/PM).
 * Only updates the matching row; never touches other sessions.
 */
export async function recordCheckOutSession(
  internId: string,
  session: AttendanceSession,
  options: { date?: string; now?: string } = {}
): Promise<AttendanceRow> {
  const date = options.date ?? new Date().toISOString().split('T')[0];
  const timeOut = options.now ?? new Date().toISOString();

  const { data, error } = await supabase
    .from('attendance')
    .update({ time_out: timeOut })
    .eq('intern_id', internId)
    .eq('date', date)
    .eq('session', session)
    .select()
    .single();

  if (error) throw error;
  return data as AttendanceRow;
}

/**
 * Fetch all attendance rows for one intern on a given date, one per session.
 */
export async function getAttendanceForDay(
  internId: string,
  date: string
): Promise<AttendanceRow[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('intern_id', internId)
    .eq('date', date)
    .order('session');

  if (error) throw error;
  return (data ?? []) as AttendanceRow[];
}
