import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import SocialSidebar from "@/components/SocialSidebar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNews, useNewsByCategory, useAllNews, useAllNewsByCategory } from "@/hooks/useNews";

type NewsCategory = "ALL" | "GAME UPDATES" | "EVENTS" | "DEV NOTES" | "ANNOUNCEMENTS";

const categoryMap: Record<NewsCategory, string | null> = {
  "ALL": null,
  "GAME UPDATES": "updates",
  "EVENTS": "events",
  "DEV NOTES": "dev-notes",
  "ANNOUNCEMENTS": "announcements",
};

const categoryColors: Record<string, string> = {
  "updates": "bg-primary/20 text-primary border-primary/50",
  "events": "bg-accent/20 text-accent border-accent/50",
  "dev-notes": "bg-secondary/20 text-secondary-foreground border-secondary/50",
  "announcements": "bg-destructive/20 text-destructive border-destructive/50",
};

const News = () => {
  const [activeFilter, setActiveFilter] = useState<NewsCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  
  const mappedCategory = categoryMap[activeFilter];
  const hasSearch = searchQuery.trim().length > 0;
  
  // Si hay búsqueda, traer TODOS los datos sin paginar
  const { data: allNewsData, isLoading: isLoadingAll } = useAllNews();
  const { data: allNewsByCategoryData, isLoading: isLoadingAllCategory } = useAllNewsByCategory(mappedCategory || '');
  
  // Si NO hay búsqueda, usar paginación normal
  const { data: paginatedData, isLoading: isLoadingPaginated } = mappedCategory 
    ? useNewsByCategory(mappedCategory, currentPage, articlesPerPage)
    : useNews(currentPage, articlesPerPage);
  
  const isLoading = hasSearch 
    ? (mappedCategory ? isLoadingAllCategory : isLoadingAll)
    : isLoadingPaginated;
  
  // Obtener todos los artículos según si hay filtro de categoría o no
  const allArticles = hasSearch 
    ? (mappedCategory ? (allNewsByCategoryData || []) : (allNewsData || []))
    : (paginatedData?.articles || []);
  
  // Aplicar búsqueda si existe
  const filteredArticles = hasSearch
    ? allArticles.filter((article) => {
        const matchesSearch = 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
    : allArticles;
  
  // Calcular paginación
  const totalCount = hasSearch 
    ? filteredArticles.length 
    : (paginatedData?.totalCount || 0);
    
  const totalPages = Math.max(1, Math.ceil(totalCount / articlesPerPage));
  
  // Si hay búsqueda, paginar los resultados filtrados
  const displayedArticles = hasSearch
    ? filteredArticles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage)
    : filteredArticles;
  
  // Reset to page 1 when filters change
  const handleFilterChange = (filter: NewsCategory) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <SocialSidebar />
      
      <main className="pt-24 pb-16 container mx-auto px-4 animate-fade-in">
        {/* Title */}
        <h1 className="font-pixel text-4xl md:text-6xl text-center pixel-title mb-12">
          News & Updates
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar por título, tipo o fecha..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 h-12 bg-card border-2 border-border hover:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {(["ALL", "GAME UPDATES", "EVENTS", "DEV NOTES", "ANNOUNCEMENTS"] as NewsCategory[]).map((filter) => (
            <Button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={
                activeFilter === filter
                  ? "bg-primary text-foreground hover:bg-primary/90 btn-arcade font-bold"
                  : "bg-card border-2 border-border text-foreground hover:bg-primary/20 hover:border-primary btn-arcade font-semibold"
              }
            >
              {filter}
            </Button>
          ))}
        </div>
        
        {/* Results Info */}
        {filteredArticles.length > 0 && (
          <div className="max-w-5xl mx-auto mb-4 text-center text-muted-foreground text-sm">
            Mostrando {filteredArticles.length} de {totalCount} noticias
          </div>
        )}
        
        {/* News Grid */}
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 mb-8">
          {isLoading ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              Cargando noticias...
            </div>
          ) : displayedArticles.length > 0 ? (
            displayedArticles.map((article) => (
            <div
              key={article.id}
              className="bg-card/90 rounded-lg p-6 shadow-arcade border-4 border-foreground/20 card-arcade hover:border-primary hover:scale-[1.03] transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start gap-4 mb-4">
                <Badge className={`${categoryColors[article.category?.toLowerCase()] ?? "bg-muted/20 text-muted-foreground border-muted/50"} px-3 py-1 font-bold border-2`}>
                  {article.category}
                </Badge>
                <span className="text-sm text-muted-foreground ml-auto">
                  {new Date(article.published_at).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              
              <p className="text-body leading-relaxed">
                {article.excerpt}
              </p>
            </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground text-lg">No se encontraron noticias con los filtros aplicados.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalCount > articlesPerPage && (
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="bg-card border-2 border-border hover:bg-primary hover:border-primary btn-arcade disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? "bg-primary text-foreground btn-arcade" : "bg-card border-2 border-border hover:bg-primary/20 btn-arcade"}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-muted-foreground">...</span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  className="bg-card border-2 border-border hover:bg-primary/20 btn-arcade"
                >
                  {totalPages}
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="bg-card border-2 border-border hover:bg-primary hover:border-primary btn-arcade disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
