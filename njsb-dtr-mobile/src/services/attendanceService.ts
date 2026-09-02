import { supabase } from '@/lib/supabase';

export type AttendanceSession = 'AM' | 'PM';

/**
 * Returns the current session based on local time of the device:
 * - AM: 00:00 to 11:59
 * - PM: 12:00 to 23:59
 */
export function getCurrentSession(now: Date = new Date()): AttendanceSession {
  return now.getHours() < 12 ? 'AM' : 'PM';
}

export type AttendanceRecord = {
  id: string;
  internId: string;
  date: string;
  session: AttendanceSession;
  timeIn: string | null;
  timeOut: string | null;
  status: string;
  notes: string | null;
  createdAt: string | null;
};

export async function recordCheckIn(
  internId: string,
  session: AttendanceSession = getCurrentSession()
): Promise<AttendanceRecord> {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('attendance')
    .upsert(
      {
        intern_id: internId,
        date: today,
        session,
        time_in: now,
        status: 'PRESENT',
      },
      { onConflict: 'intern_id,date,session' }
    )
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    internId: data.intern_id,
    date: data.date,
    session: (data.session ?? 'AM') as AttendanceSession,
    timeIn: data.time_in,
    timeOut: data.time_out,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
  };
}

export async function recordCheckOut(
  internId: string,
  session: AttendanceSession = getCurrentSession()
): Promise<AttendanceRecord> {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('attendance')
    .update({ time_out: now })
    .eq('intern_id', internId)
    .eq('date', today)
    .eq('session', session)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    internId: data.intern_id,
    date: data.date,
    session: (data.session ?? 'AM') as AttendanceSession,
    timeIn: data.time_in,
    timeOut: data.time_out,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
  };
}

/**
 * Fetch all attendance rows for a given intern on a given date.
 * With the new schema this returns up to 2 rows: one AM, one PM.
 */
export async function getAttendanceForDay(
  internId: string,
  date: string
): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('intern_id', internId)
    .eq('date', date)
    .order('session');

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    internId: row.intern_id,
    date: row.date,
    session: (row.session ?? 'AM') as AttendanceSession,
    timeIn: row.time_in,
    timeOut: row.time_out,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
  }));
}

/**
 * Backwards-compatible: get today's sessions for an intern.
 * Returns the AM and PM rows (each may be null if not yet recorded).
 */
export async function getTodaySessions(
  internId: string
): Promise<{ am: AttendanceRecord | null; pm: AttendanceRecord | null }> {
  const today = new Date().toISOString().split('T')[0];
  const rows = await getAttendanceForDay(internId, today);
  return {
    am: rows.find((r) => r.session === 'AM') ?? null,
    pm: rows.find((r) => r.session === 'PM') ?? null,
  };
}

export async function getAttendanceByIntern(internId: string): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('intern_id', internId)
    .order('date', { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    internId: row.intern_id,
    date: row.date,
    session: (row.session ?? 'AM') as AttendanceSession,
    timeIn: row.time_in,
    timeOut: row.time_out,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
  }));
}

export async function getTodayAttendance(internId: string): Promise<AttendanceRecord | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('intern_id', internId)
    .eq('date', today)
    .eq('session', getCurrentSession())
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    internId: data.intern_id,
    date: data.date,
    session: (data.session ?? 'AM') as AttendanceSession,
    timeIn: data.time_in,
    timeOut: data.time_out,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
  };
}
