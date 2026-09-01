import { supabase } from '@/lib/supabase';

export type AttendanceRecord = {
  id: string;
  internId: string;
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  status: string;
  notes: string | null;
  createdAt: string | null;
};

export async function recordCheckIn(internId: string): Promise<AttendanceRecord> {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('attendance')
    .upsert(
      {
        intern_id: internId,
        date: today,
        time_in: now,
        status: 'PRESENT',
      },
      { onConflict: 'intern_id,date' }
    )
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    internId: data.intern_id,
    date: data.date,
    timeIn: data.time_in,
    timeOut: data.time_out,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
  };
}

export async function recordCheckOut(internId: string): Promise<AttendanceRecord> {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('attendance')
    .update({ time_out: now })
    .eq('intern_id', internId)
    .eq('date', today)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    internId: data.intern_id,
    date: data.date,
    timeIn: data.time_in,
    timeOut: data.time_out,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
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
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    internId: data.intern_id,
    date: data.date,
    timeIn: data.time_in,
    timeOut: data.time_out,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
  };
}
