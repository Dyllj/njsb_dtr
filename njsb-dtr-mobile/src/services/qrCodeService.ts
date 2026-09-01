import { supabase } from '@/lib/supabase';

export type QrCodeRecord = {
  id: string;
  code: string;
  isActive: boolean;
  createdAt: string | null;
};

export async function getActiveQRCode(): Promise<QrCodeRecord | null> {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    code: data.code,
    isActive: data.is_active,
    createdAt: data.created_at,
  };
}

export async function getQRCodes(): Promise<QrCodeRecord[]> {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    code: row.code,
    isActive: row.is_active,
    createdAt: row.created_at,
  }));
}

export async function validateQRCode(code: string): Promise<QrCodeRecord | null> {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    code: data.code,
    isActive: data.is_active,
    createdAt: data.created_at,
  };
}
