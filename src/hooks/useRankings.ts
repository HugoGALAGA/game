import { useQuery } from "@tanstack/react-query";
import { callExternalDB } from "./useExternalDB";

export interface Player {
  id: string;
  user_id: string | null;
  name: string;
  elo: number;
  tier: string;
  wins: number;
  losses: number;
  created_at: string;
  updated_at: string;
}

// Obtener top 5 jugadores para la sección de ranking principal
export const useTopPlayers = (limit: number = 5) => {
  return useQuery({
    queryKey: ['top-players', limit],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'players',
        operation: 'select',
        data: {
          select: '*',
          orderBy: { column: 'elo', ascending: false },
          limit
        }
      });
      return data as Player[];
    },
  });
};

// Obtener TODOS los jugadores sin paginación (para búsqueda)
export const useAllPlayersNoPagination = () => {
  return useQuery({
    queryKey: ['all-players-no-pagination'],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'players',
        operation: 'select',
        data: {
          select: '*',
          orderBy: { column: 'elo', ascending: false }
        }
      });
      
      return data as Player[];
    },
  });
};

// Obtener todos los jugadores para el leaderboard completo con paginación
export const useAllPlayers = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['all-players', page, pageSize],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'players',
        operation: 'select',
        data: {
          select: '*',
          orderBy: { column: 'elo', ascending: false }
        }
      });
      
      // Simular paginación en el cliente
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      const players = (data as Player[]).slice(from, to);
      
      return { 
        players, 
        totalCount: (data as Player[]).length
      };
    },
  });
};

// Buscar jugadores por nombre
export const useSearchPlayers = (searchQuery: string) => {
  return useQuery({
    queryKey: ['search-players', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      const data = await callExternalDB({
        table: 'players',
        operation: 'select',
        data: {
          select: '*',
          orderBy: { column: 'elo', ascending: false }
        }
      });
      
      // Filtrar en el cliente
      return (data as Player[]).filter(player => 
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
    enabled: searchQuery.length > 0,
  });
};

// Obtener un jugador específico por nombre
export const usePlayerByName = (playerName: string) => {
  return useQuery({
    queryKey: ['player', playerName],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'players',
        operation: 'select',
        filters: { name: playerName }
      });
      
      const players = data as Player[];
      if (!players || players.length === 0) {
        throw new Error('Player not found');
      }
      
      return players[0];
    },
    enabled: !!playerName,
  });
};
