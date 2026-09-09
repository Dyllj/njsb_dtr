import type { GenericSchema, GenericTable, GenericView, GenericFunction } from '@supabase/postgrest-js'

type DB = {
  Tables: {
    test: {
      Row: { id: string }
      Insert: { id: string }
      Update: { id?: string }
      Relationships: []
    }
  }
  Views: Record<string, never>
  Functions: Record<string, never>
}

type Test = DB extends GenericSchema ? 'yes' : 'no'
type Test2 = DB['Tables']['test'] extends GenericTable ? 'yes' : 'no'
