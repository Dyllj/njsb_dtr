import { supabase } from '@/lib/supabase';

export type InternProfile = {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  status: string;
  totalHours: number;
  accumulatedHours: number;
};

export async function getInternById(id: string): Promise<InternProfile | null> {
  const { data, error } = await supabase
    .from('interns')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    department: data.department,
    status: data.status,
    totalHours: Number(data.total_hours),
    accumulatedHours: Number(data.accumulated_hours),
  };
}

export async function getInterns(): Promise<InternProfile[]> {
  const { data, error } = await supabase
    .from('interns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    department: row.department,
    status: row.status,
    totalHours: Number(row.total_hours),
    accumulatedHours: Number(row.accumulated_hours),
  }));
}
