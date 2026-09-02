import { supabase } from '@/lib/supabase';

export type InternProfile = {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  status: string;
  totalHours: number;
  accumulatedHours: number;
  username: string | null;
  email: string | null;
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
    username: data.username ?? null,
    email: data.email ?? null,
  };
}

export async function loginIntern(internId: string, password: string): Promise<InternProfile> {
  const { data, error } = await supabase
    .from('interns')
    .select('*')
    .eq('id', internId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Invalid Intern ID or password.');

  if (data.status !== 'Active') {
    throw new Error('This intern account is inactive. Contact your administrator.');
  }

  if (data.password !== password) {
    throw new Error('Invalid Intern ID or password.');
  }

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    department: data.department,
    status: data.status,
    totalHours: Number(data.total_hours),
    accumulatedHours: Number(data.accumulated_hours),
    username: data.username ?? null,
    email: data.email ?? null,
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
    username: row.username ?? null,
    email: row.email ?? null,
  }));
}

export type InternProfileUpdate = {
  firstName?: string;
  lastName?: string;
  department?: string;
  username?: string | null;
  email?: string | null;
  password?: string | null;
};

export async function updateInternProfile(
  id: string,
  updates: InternProfileUpdate
): Promise<InternProfile> {
  const updateData: Record<string, string | number | null> = {};

  if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
  if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
  if (updates.department !== undefined) updateData.department = updates.department;
  if (updates.username !== undefined) updateData.username = updates.username;
  if (updates.email !== undefined) updateData.email = updates.email;

  // Only update password if a non-empty value is provided
  if (updates.password) {
    updateData.password = updates.password;
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
    department: data.department,
    status: data.status,
    totalHours: Number(data.total_hours),
    accumulatedHours: Number(data.accumulated_hours),
    username: data.username ?? null,
    email: data.email ?? null,
  };
}
