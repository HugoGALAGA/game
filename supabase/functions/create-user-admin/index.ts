import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar la API key administrativa
    const adminKey = req.headers.get('x-admin-key');
    const expectedAdminKey = Deno.env.get('ADMIN_API_KEY');

    if (!adminKey || adminKey !== expectedAdminKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized - Invalid admin key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, password, username } = await req.json();

    // Validaciones
    if (!email || !password || !username) {
      return new Response(
        JSON.stringify({ success: false, error: 'email, password and username are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cliente de Supabase con service role para usar Admin API
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 1. Crear usuario en auth.users usando Admin API
    console.log(`Creating user in auth: ${email}`);
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        username: username
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return new Response(
        JSON.stringify({ success: false, error: authError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = authData.user.id;
    console.log(`User created in auth with ID: ${userId}`);

    // Cliente para la BD externa
    const externalSupabase = createClient(
      Deno.env.get('EXTERNAL_SUPABASE_URL') ?? '',
      Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY') ?? ''
    );

    // 2. Crear perfil en la BD externa
    console.log(`Creating profile in external DB for user: ${userId}`);
    const { error: profileError } = await externalSupabase
      .from('profiles')
      .insert({
        id: userId,
        username: username
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Intentar eliminar el usuario de auth si falla la creación del perfil
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ success: false, error: `Profile creation failed: ${profileError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Crear jugador en la BD externa
    console.log(`Creating player in external DB for user: ${userId}`);
    const { error: playerError } = await externalSupabase
      .from('players')
      .insert({
        user_id: userId,
        name: username,
        elo: 200,
        tier: 'Bronze',
        wins: 0,
        losses: 0
      });

    if (playerError) {
      console.error('Error creating player:', playerError);
      // Intentar limpiar si falla
      await externalSupabase.from('profiles').delete().eq('id', userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ success: false, error: `Player creation failed: ${playerError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`User created successfully: ${email} (${userId})`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          user_id: userId,
          email: email,
          username: username
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in create-user-admin function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
