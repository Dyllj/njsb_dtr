import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type AdminRow = Database['public']['Tables']['profiles']['Row'];
type AdminInsert = Database['public']['Tables']['profiles']['Insert'];
type AdminUpdate = Database['public']['Tables']['profiles']['Update'];

export type AdminRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
};

function toAdminRecord(row: AdminRow): AdminRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status as 'Active' | 'Inactive',
  };
};

export async function getAdmins(): Promise<AdminRecord[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(toAdminRecord);
}

export async function createAdmin(admin: Omit<AdminRecord, 'id'>, password = 'changeme123'): Promise<AdminRecord> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: admin.email,
    password,
  });

  if (authError || !authData.user) {
    throw authError ?? new Error('Failed to create auth user');
  }

  const insertData: AdminInsert = {
    id: authData.user.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.status,
  };

  const { data, error } = await supabase.from('profiles').insert(insertData).select().single();

  if (error) throw error;

  return toAdminRecord(data);
}

export async function updateAdmin(id: string, admin: Omit<AdminRecord, 'id'>): Promise<AdminRecord> {
  const updateData: AdminUpdate = {
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.status,
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return toAdminRecord(data);
}

export async function deleteAdmin(id: string): Promise<void> {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
}
