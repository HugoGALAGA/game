import { useQuery } from "@tanstack/react-query";
import { callExternalDB } from "./useExternalDB";

export interface Asset {
  id: string;
  title: string;
  description: string | null;
  type: string;
  format: string;
  size: string | null;
  download_url: string;
  created_at: string;
}

// Obtener todos los assets
export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'assets',
        operation: 'select',
        data: {
          select: '*',
          orderBy: { column: 'created_at', ascending: false }
        }
      });
      return data as Asset[];
    },
  });
};

// Obtener assets por tipo (music, image, video, other)
export const useAssetsByType = (type: string) => {
  return useQuery({
    queryKey: ['assets-by-type', type],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'assets',
        operation: 'select',
        filters: { type },
        data: {
          select: '*',
          orderBy: { column: 'created_at', ascending: false }
        }
      });
      return data as Asset[];
    },
    enabled: !!type,
  });
};

// Obtener un asset específico por ID
export const useAssetById = (id: string) => {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'assets',
        operation: 'select',
        filters: { id }
      });
      
      const assets = data as Asset[];
      if (!assets || assets.length === 0) {
        throw new Error('Asset not found');
      }
      
      return assets[0];
    },
    enabled: !!id,
  });
};
