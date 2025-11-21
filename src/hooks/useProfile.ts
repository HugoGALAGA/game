import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { callExternalDB } from "./useExternalDB";

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

export interface PlayerProfile extends Profile {
  player_data?: {
    id: string;
    elo: number;
    tier: string;
    wins: number;
    losses: number;
  } | null;
}

export interface MatchHistory {
  id: string;
  opponent_name: string;
  result: string;
  elo_change: number;
  player_elo_before: number;
  player_elo_after: number;
  played_at: string;
}

export interface WeaponStat {
  weapon_name: string;
  times_used: number;
  wins_with_weapon: number;
  losses_with_weapon: number;
}

// Obtener perfil del usuario actual
export const useCurrentProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const data = await callExternalDB({
        table: 'profiles',
        operation: 'select',
        filters: { id: userId }
      });
      
      const profiles = data as Profile[];
      if (!profiles || profiles.length === 0) {
        throw new Error('Profile not found');
      }
      
      return profiles[0];
    },
    enabled: !!userId,
  });
};

// Obtener perfil completo con datos de jugador
export const usePlayerProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['player-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Obtener perfil
      const profileData = await callExternalDB({
        table: 'profiles',
        operation: 'select',
        filters: { id: userId }
      });
      
      const profiles = profileData as Profile[];
      if (!profiles || profiles.length === 0) {
        throw new Error('Profile not found');
      }

      // Obtener datos de jugador si existen
      const playerData = await callExternalDB({
        table: 'players',
        operation: 'select',
        filters: { user_id: userId },
        data: { select: 'id, elo, tier, wins, losses' }
      });
      
      const players = playerData as any[];

      return {
        ...profiles[0],
        player_data: players && players.length > 0 ? players[0] : null
      } as PlayerProfile;
    },
    enabled: !!userId,
  });
};

// Actualizar perfil de usuario
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, username, avatar_url }: { 
      userId: string; 
      username?: string; 
      avatar_url?: string;
    }) => {
      const updates: any = {};
      if (username !== undefined) updates.username = username;
      if (avatar_url !== undefined) updates.avatar_url = avatar_url;

      const data = await callExternalDB({
        table: 'profiles',
        operation: 'update',
        filters: { id: userId },
        data: { updates }
      });
      
      const profiles = data as Profile[];
      if (!profiles || profiles.length === 0) {
        throw new Error('Profile update failed');
      }
      
      return profiles[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['player-profile', variables.userId] });
    },
  });
};

// Obtener historial de partidas del jugador
export const useMatchHistory = (playerId: string | undefined) => {
  return useQuery({
    queryKey: ['match-history', playerId],
    queryFn: async () => {
      if (!playerId) return [];

      const data = await callExternalDB({
        table: 'match_history',
        operation: 'select',
        filters: { player_id: playerId },
        data: {
          orderBy: { column: 'played_at', ascending: false },
          limit: 10
        }
      });
      
      return data as MatchHistory[];
    },
    enabled: !!playerId,
  });
};

// Obtener estadísticas de armas del jugador
export const useWeaponStats = (playerId: string | undefined) => {
  return useQuery({
    queryKey: ['weapon-stats', playerId],
    queryFn: async () => {
      if (!playerId) return [];

      const data = await callExternalDB({
        table: 'weapon_stats',
        operation: 'select',
        filters: { player_id: playerId }
      });
      
      return data as WeaponStat[];
    },
    enabled: !!playerId,
  });
};
