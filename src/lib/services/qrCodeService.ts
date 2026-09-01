import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type QrRow = Database['public']['Tables']['qr_codes']['Row'];
type QrInsert = Database['public']['Tables']['qr_codes']['Insert'];
type QrUpdate = Database['public']['Tables']['qr_codes']['Update'];

export type QrCodeRecord = {
  id: string;
  code: string;
  isActive: boolean;
  createdAt: string | null;
};

export async function getQRCodes(): Promise<QrCodeRecord[]> {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((row: QrRow) => ({
    id: row.id,
    code: row.code,
    isActive: row.is_active,
    createdAt: row.created_at,
  }));
}

export async function createQRCode(code: string): Promise<QrCodeRecord> {
  const { data: existing } = await supabase
    .from('qr_codes')
    .select('id')
    .eq('is_active', true)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('qr_codes')
      .update({ is_active: false })
      .eq('id', existing.id);
  }

  const insertData: QrInsert = {
    id: `QC-${Date.now().toString(36).toUpperCase()}`,
    code,
    is_active: true,
  };

  const { data, error } = await supabase.from('qr_codes').insert(insertData).select().single();

  if (error) throw error;

  return {
    id: data.id,
    code: data.code,
    isActive: data.is_active,
    createdAt: data.created_at,
  };
}

export async function updateQRCode(id: string, updates: { isActive?: boolean }): Promise<QrCodeRecord> {
  const updateData: QrUpdate = {
    is_active: updates.isActive,
  };

  const { data, error } = await supabase
    .from('qr_codes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    code: data.code,
    isActive: data.is_active,
    createdAt: data.created_at,
  };
}

export async function deleteQRCode(id: string): Promise<void> {
  const { error } = await supabase.from('qr_codes').delete().eq('id', id);
  if (error) throw error;
}
