import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { callExternalDB } from "./useExternalDB";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Verificar sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Registro con email y contraseña
  const signUp = async (email: string, password: string, username: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: username,
        }
      }
    });

    // Si el registro fue exitoso, sincronizar con la BD externa
    if (data.user && !error) {
      try {
        // Crear perfil en la BD externa
        await callExternalDB({
          table: 'profiles',
          operation: 'insert',
          data: {
            records: {
              id: data.user.id,
              username: username
            }
          }
        });

        // Crear jugador en la BD externa
        await callExternalDB({
          table: 'players',
          operation: 'insert',
          data: {
            records: {
              user_id: data.user.id,
              name: username,
              elo: 200,
              tier: 'Bronze',
              wins: 0,
              losses: 0
            }
          }
        });
      } catch (externalError) {
        console.error('Error sincronizando con BD externa:', externalError);
        // Permitimos que el registro continúe aunque falle la sincronización
      }
    }

    return { data, error };
  };

  // Login con email y contraseña
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  // Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
