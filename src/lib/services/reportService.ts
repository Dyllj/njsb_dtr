import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type ReportRow = Database['public']['Tables']['reports']['Row'];
type ReportInsert = Database['public']['Tables']['reports']['Insert'];
type ReportUpdate = Database['public']['Tables']['reports']['Update'];

export type ReportRecord = {
  id: string;
  title: string;
  type: 'Attendance' | 'Summary';
  generatedAt: string;
  owner: string;
};

export async function getReports(): Promise<ReportRecord[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('generated_at', { ascending: false });

  if (error) throw error;

  return data.map((row: ReportRow) => ({
    id: row.id,
    title: row.title,
    type: row.type as 'Attendance' | 'Summary',
    generatedAt: row.generated_at,
    owner: row.owner,
  }));
}

export async function createReport(report: Omit<ReportRecord, 'id'>): Promise<ReportRecord> {
  const insertData: ReportInsert = {
    id: `R-${Date.now().toString(36).toUpperCase()}`,
    title: report.title,
    type: report.type,
    generated_at: report.generatedAt,
    owner: report.owner,
  };

  const { data, error } = await supabase.from('reports').insert(insertData).select().single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    type: data.type as 'Attendance' | 'Summary',
    generatedAt: data.generated_at,
    owner: data.owner,
  };
}

export async function updateReport(id: string, report: Omit<ReportRecord, 'id'>): Promise<ReportRecord> {
  const updateData: ReportUpdate = {
    title: report.title,
    type: report.type,
    generated_at: report.generatedAt,
    owner: report.owner,
  };

  const { data, error } = await supabase
    .from('reports')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    type: data.type as 'Attendance' | 'Summary',
    generatedAt: data.generated_at,
    owner: data.owner,
  };
}

export async function deleteReport(id: string): Promise<void> {
  const { error } = await supabase.from('reports').delete().eq('id', id);
  if (error) throw error;
}
