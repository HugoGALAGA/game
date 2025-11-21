import { supabase } from "@/integrations/supabase/client";

interface ExternalDBRequest {
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  data?: {
    select?: string;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    records?: any;
    updates?: any;
  };
  filters?: Record<string, any>;
}

export const callExternalDB = async (request: ExternalDBRequest) => {
  const { data, error } = await supabase.functions.invoke('external-db', {
    body: request
  });

  if (error) {
    console.error('External DB error:', error);
    throw error;
  }

  if (!data.success) {
    console.error('External DB operation failed:', data.error);
    throw new Error(data.error);
  }

  return data.data;
};
