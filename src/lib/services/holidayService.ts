import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type HolidayRow = Database['public']['Tables']['holidays']['Row'];

export type Holiday = {
  id: string;
  date: string;
  name: string;
};

export async function getHolidays(): Promise<Holiday[]> {
  const { data, error } = await supabase.from('holidays').select('*').order('date', { ascending: true });

  if (error) throw error;

  return data.map((row: HolidayRow) => ({
    id: row.id,
    date: row.date,
    name: row.name,
  }));
}

export async function upsertHoliday(date: string, name: string): Promise<Holiday> {
  const { data, error } = await supabase
    .from('holidays')
    .upsert({ date, name }, { on: 'date' })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    date: data.date,
    name: data.name,
  };
}

export async function deleteHoliday(date: string): Promise<void> {
  const { error } = await supabase.from('holidays').delete().eq('date', date);
  if (error) throw error;
}

export async function toggleHoliday(date: string, name: string, isCurrentlyHoliday: boolean): Promise<void> {
  if (isCurrentlyHoliday) {
    await deleteHoliday(date);
  } else {
    await upsertHoliday(date, name);
  }
}
