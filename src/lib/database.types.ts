export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          status: 'Active' | 'Inactive';
          created_at: string | null;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: string;
          status?: 'Active' | 'Inactive';
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          status?: 'Active' | 'Inactive';
          created_at?: string | null;
        };
      };
      interns: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          department: string;
          status: 'Active' | 'Inactive';
          total_hours: number;
          accumulated_hours: number;
          created_at: string | null;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          department: string;
          status?: 'Active' | 'Inactive';
          total_hours?: number;
          accumulated_hours?: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          department?: string;
          status?: 'Active' | 'Inactive';
          total_hours?: number;
          accumulated_hours?: number;
          created_at?: string | null;
        };
      };
      attendance: {
        Row: {
          id: string;
          intern_id: string;
          date: string;
          time_in: string | null;
          time_out: string | null;
          status: 'PRESENT' | 'ABSENT' | 'LATE' | 'UNDERTIME';
          notes: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          intern_id: string;
          date: string;
          time_in?: string | null;
          time_out?: string | null;
          status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'UNDERTIME';
          notes?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          intern_id?: string;
          date?: string;
          time_in?: string | null;
          time_out?: string | null;
          status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'UNDERTIME';
          notes?: string | null;
          created_at?: string | null;
        };
      };
      reports: {
        Row: {
          id: string;
          title: string;
          type: 'Attendance' | 'Summary';
          generated_at: string;
          owner: string;
          created_at: string | null;
        };
        Insert: {
          id: string;
          title: string;
          type: 'Attendance' | 'Summary';
          generated_at: string;
          owner: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          type?: 'Attendance' | 'Summary';
          generated_at?: string;
          owner?: string;
          created_at?: string | null;
        };
      };
      holidays: {
        Row: {
          id: string;
          date: string;
          name: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          date: string;
          name: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          date?: string;
          name?: string;
          created_at?: string | null;
        };
      };
      qr_codes: {
        Row: {
          id: string;
          code: string;
          is_active: boolean;
          created_at: string | null;
        };
        Insert: {
          id: string;
          code: string;
          is_active?: boolean;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          is_active?: boolean;
          created_at?: string | null;
        };
      };
    };
  };
}
