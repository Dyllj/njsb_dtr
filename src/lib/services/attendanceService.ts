import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type AttendanceRow = Database['public']['Tables']['attendance']['Row'];

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'UNDERTIME';

export type AttendanceSummary = {
  present: number;
  absent: number;
  late: number;
  total: number;
};

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

export async function getAttendanceRows(): Promise<AttendanceRow[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      interns!inner(first_name, last_name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    const { data: fallback, error: fallbackError } = await supabase
      .from('attendance')
      .select('*')
      .order('created_at', { ascending: false });
    if (fallbackError) throw fallbackError;
    return fallback;
  }

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

  const [{ count: total }, presentData, lateData] = await Promise.all([
    supabase.from('interns').select('*', { count: 'exact', head: true }),
    supabase.from('attendance').select('*').eq('date', today).eq('status', 'PRESENT'),
    supabase.from('attendance').select('*').eq('date', today).eq('status', 'LATE'),
  ]);

  return {
    total: total ?? 0,
    presentToday: presentData?.data?.length ?? 0,
    workingNow: presentData?.data?.length ?? 0,
    late: lateData?.data?.length ?? 0,
    absent: 0,
  };
}
