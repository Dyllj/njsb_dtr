import { supabase } from '@/lib/supabase';

export type ReportRecord = {
  id: string;
  title: string;
  type: string;
  generatedAt: string;
  owner: string;
  createdAt: string | null;
};

export async function getReports(): Promise<ReportRecord[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('generated_at', { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    generatedAt: row.generated_at,
    owner: row.owner,
    createdAt: row.created_at,
  }));
}
