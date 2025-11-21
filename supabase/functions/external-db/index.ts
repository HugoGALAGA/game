import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create external Supabase client
    const externalSupabase = createClient(
      Deno.env.get('EXTERNAL_SUPABASE_URL')!,
      Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY')!
    );

    const { table, operation, data, filters } = await req.json();

    console.log(`External DB request - Table: ${table}, Operation: ${operation}`);

    let result;

    switch (operation) {
      case 'select': {
        let query = externalSupabase.from(table).select(data?.select || '*');
        
        // Apply filters if provided
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        // Apply ordering if provided
        if (data?.orderBy) {
          query = query.order(data.orderBy.column, { ascending: data.orderBy.ascending ?? true });
        }
        
        // Apply limit if provided
        if (data?.limit) {
          query = query.limit(data.limit);
        }

        result = await query;
        break;
      }

      case 'insert': {
        result = await externalSupabase
          .from(table)
          .insert(data.records)
          .select();
        break;
      }

      case 'update': {
        let query = externalSupabase.from(table).update(data.updates);
        
        // Apply filters for the update
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        result = await query.select();
        break;
      }

      case 'delete': {
        let query = externalSupabase.from(table).delete();
        
        // Apply filters for the delete
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        result = await query;
        break;
      }

      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    if (result.error) {
      console.error('External DB Error:', result.error);
      throw result.error;
    }

    console.log(`External DB success - ${operation} on ${table}:`, result.data?.length || 0, 'records');

    return new Response(
      JSON.stringify({ success: true, data: result.data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('External DB function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
