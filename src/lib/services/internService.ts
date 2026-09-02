import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type InternRow = Database['public']['Tables']['interns']['Row'];
type InternInsert = Database['public']['Tables']['interns']['Insert'];
type InternUpdate = Database['public']['Tables']['interns']['Update'];

export type Intern = {
  id: string;
  firstName: string;
  lastName: string;
  status: 'Active' | 'Inactive';
  totalHours: number;
  accumulatedHours: number;
  username: string | null;
  email: string | null;
  password: string | null;
};

export async function getInterns(): Promise<Intern[]> {
  const { data, error } = await supabase
    .from('interns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((row: InternRow) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    status: row.status as 'Active' | 'Inactive',
    totalHours: Number(row.total_hours),
    accumulatedHours: Number(row.accumulated_hours),
    username: row.username,
    email: row.email,
    password: row.password,
  }));
}

export async function getInternCount(): Promise<number> {
  const { count, error } = await supabase
    .from('interns')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active');

  if (error) throw error;
  return count ?? 0;
}

export async function createIntern(intern: Omit<Intern, 'id'>): Promise<Intern> {
  const insertData: InternInsert = {
    id: `I-${Date.now().toString(36).toUpperCase()}`,
    first_name: intern.firstName,
    last_name: intern.lastName,
    status: intern.status,
    total_hours: intern.totalHours,
    accumulated_hours: intern.accumulatedHours,
    username: intern.username,
    email: intern.email,
    password: intern.password,
  };

  const { data, error } = await supabase.from('interns').insert(insertData).select().single();

  if (error) throw error;

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    status: data.status as 'Active' | 'Inactive',
    totalHours: Number(data.total_hours),
    accumulatedHours: Number(data.accumulated_hours),
    username: data.username,
    email: data.email,
    password: data.password,
  };
}

export async function updateIntern(id: string, intern: Omit<Intern, 'id'>): Promise<Intern> {
  const updateData: InternUpdate = {
    first_name: intern.firstName,
    last_name: intern.lastName,
    status: intern.status,
    total_hours: intern.totalHours,
    accumulated_hours: intern.accumulatedHours,
    username: intern.username,
    email: intern.email,
  };

  // Only update password if a new one is provided (null = keep existing)
  if (intern.password) {
    updateData.password = intern.password;
  }

  const { data, error } = await supabase
    .from('interns')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    status: data.status as 'Active' | 'Inactive',
    totalHours: Number(data.total_hours),
    accumulatedHours: Number(data.accumulated_hours),
    username: data.username,
    email: data.email,
    password: data.password,
  };
}

export async function deleteIntern(id: string): Promise<void> {
  const { error } = await supabase.from('interns').delete().eq('id', id);
  if (error) throw error;
}
