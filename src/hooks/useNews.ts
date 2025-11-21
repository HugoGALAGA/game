import { useQuery } from "@tanstack/react-query";
import { callExternalDB } from "./useExternalDB";

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  author_id: string | null;
  published_at: string;
  created_at: string;
}

// Obtener todas las noticias - SIN paginación (para búsqueda)
export const useAllNews = () => {
  return useQuery({
    queryKey: ['all-news'],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'news',
        operation: 'select',
        data: {
          select: '*',
          orderBy: { column: 'published_at', ascending: false }
        }
      });
      
      return data as NewsArticle[];
    },
  });
};

// Obtener todas las noticias con paginación
export const useNews = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['news', page, pageSize],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'news',
        operation: 'select',
        data: {
          select: '*',
          orderBy: { column: 'published_at', ascending: false }
        }
      });
      
      // Simular paginación en el cliente
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      const articles = (data as NewsArticle[]).slice(from, to);
      
      return {
        articles,
        totalCount: (data as NewsArticle[]).length
      };
    },
  });
};

// Obtener todas las noticias de una categoría - SIN paginación (para búsqueda)
export const useAllNewsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['all-news-by-category', category],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'news',
        operation: 'select',
        filters: { category },
        data: {
          select: '*',
          orderBy: { column: 'published_at', ascending: false }
        }
      });
      
      return data as NewsArticle[];
    },
    enabled: !!category && category !== 'all',
  });
};

// Obtener noticias filtradas por categoría
export const useNewsByCategory = (category: string, page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['news-by-category', category, page, pageSize],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'news',
        operation: 'select',
        filters: { category },
        data: {
          select: '*',
          orderBy: { column: 'published_at', ascending: false }
        }
      });
      
      // Simular paginación en el cliente
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      const articles = (data as NewsArticle[]).slice(from, to);
      
      return {
        articles,
        totalCount: (data as NewsArticle[]).length
      };
    },
    enabled: !!category && category !== 'all',
  });
};

// Buscar noticias por título
export const useSearchNews = (searchQuery: string) => {
  return useQuery({
    queryKey: ['search-news', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      const data = await callExternalDB({
        table: 'news',
        operation: 'select',
        data: {
          select: '*',
          orderBy: { column: 'published_at', ascending: false }
        }
      });
      
      // Filtrar en el cliente
      return (data as NewsArticle[]).filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
    enabled: searchQuery.length > 0,
  });
};

// Obtener una noticia específica por ID
export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      const data = await callExternalDB({
        table: 'news',
        operation: 'select',
        filters: { id }
      });
      
      const articles = data as NewsArticle[];
      if (!articles || articles.length === 0) {
        throw new Error('News article not found');
      }
      
      return articles[0];
    },
    enabled: !!id,
  });
};
