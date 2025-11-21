import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SocialSidebar from "@/components/SocialSidebar";
import Footer from "@/components/Footer";
import { useAllPlayers, useAllPlayersNoPagination } from "@/hooks/useRankings";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tierData = {
  Master: { color: "text-accent", icon: "👑" },
  Diamond: { color: "text-cyan-400", icon: "💎" },
  Platinum: { color: "text-emerald-400", icon: "🔷" },
  Gold: { color: "text-yellow-400", icon: "🥇" },
  Silver: { color: "text-gray-400", icon: "🥈" },
  Bronze: { color: "text-orange-400", icon: "🥉" },
};

const GlobalLeaderboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("elo-desc");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const playersPerPage = 10;
  
  const hasSearch = searchQuery.trim().length > 0;
  
  // Si hay búsqueda, traer TODOS los jugadores
  const { data: allPlayersData, isLoading: isLoadingAll } = useAllPlayersNoPagination();
  
  // Si NO hay búsqueda, usar paginación normal
  const { data: paginatedData, isLoading: isLoadingPaginated } = useAllPlayers(currentPage, playersPerPage);
  
  const isLoading = hasSearch ? isLoadingAll : isLoadingPaginated;
  
  const allPlayers = hasSearch 
    ? (allPlayersData || [])
    : (paginatedData?.players || []);
    
  const totalCount = hasSearch
    ? (allPlayersData?.length || 0)
    : (paginatedData?.totalCount || 0);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const filteredPlayers = hasSearch
    ? allPlayers.filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allPlayers;
  
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case "elo-desc": return b.elo - a.elo;
      case "elo-asc": return a.elo - b.elo;
      case "wins": return b.wins - a.wins;
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });
  
  // Calcular el ranking global de cada jugador basado en ELO
  const allPlayersSortedByElo = hasSearch 
    ? [...(allPlayersData || [])].sort((a, b) => b.elo - a.elo)
    : [];
  
  const playersWithGlobalRank = sortedPlayers.map(player => {
    const globalRank = hasSearch
      ? allPlayersSortedByElo.findIndex(p => p.id === player.id) + 1
      : 0; // Se calculará después para los no filtrados
    return { ...player, globalRank };
  });
  
  // Calcular total para paginación
  const totalForPagination = hasSearch ? filteredPlayers.length : totalCount;
  const totalPages = Math.max(1, Math.ceil(totalForPagination / playersPerPage));
  
  // Si hay búsqueda, paginar los resultados filtrados y ordenados
  const displayedPlayers = hasSearch
    ? playersWithGlobalRank.slice((currentPage - 1) * playersPerPage, currentPage * playersPerPage)
    : playersWithGlobalRank;

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <SocialSidebar />
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-primary border-4 border-foreground/20 hover:bg-primary/90 transition-all duration-200 flex items-center justify-center shadow-arcade btn-arcade animate-fade-in"
        >
          <ArrowUp className="h-6 w-6 text-foreground" />
        </button>
      )}
      
      <main className="pt-24 pb-16 container mx-auto px-4 animate-fade-in">
        {/* Title */}
        <h1 className="font-pixel text-4xl md:text-6xl text-center pixel-title mb-12">
          Global Leaderboard
        </h1>
        
        {/* Search Bar and Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar Jugador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card border-2 border-border hover:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[240px] h-12 bg-card border-2 border-border hover:border-primary transition-colors">
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-2 border-border shadow-arcade">
                <SelectItem value="elo-desc">ELO (Descendente)</SelectItem>
                <SelectItem value="elo-asc">ELO (Ascendente)</SelectItem>
                <SelectItem value="wins">Victorias</SelectItem>
                <SelectItem value="name">Nombre (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Table */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-card/90 rounded-lg p-6 md:p-8 shadow-arcade border-4 border-foreground/20 card-arcade backdrop-blur-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-bold">Rank</TableHead>
                  <TableHead className="text-muted-foreground font-bold">Player</TableHead>
                  <TableHead className="text-muted-foreground font-bold text-right">ELO</TableHead>
                  <TableHead className="text-muted-foreground font-bold">Tier</TableHead>
                  <TableHead className="text-muted-foreground font-bold text-right">Wins</TableHead>
                  <TableHead className="text-muted-foreground font-bold text-right">Losses</TableHead>
                  <TableHead className="text-muted-foreground font-bold text-right">Win %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Cargando jugadores...
                    </TableCell>
                  </TableRow>
                ) : displayedPlayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No se encontraron jugadores
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedPlayers.map((player, index) => {
                    const displayRank = hasSearch 
                      ? player.globalRank 
                      : (currentPage - 1) * playersPerPage + index + 1;
                    
                    return (
                  <TableRow
                    key={player.id}
                    onClick={() => navigate(`/player/${player.name}`)}
                    className="border-border/50 hover:bg-primary/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                  >
                    <TableCell className="font-pixel text-lg">
                      <span className={displayRank <= 3 ? "text-accent" : "text-foreground"}>
                        #{displayRank}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {player.name}
                    </TableCell>
                    <TableCell className="text-right text-primary font-bold text-lg">
                      {player.elo}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const cleanTier = player.tier?.trim() as keyof typeof tierData;
                        const tier = tierData[cleanTier] || { color: "text-foreground", icon: "🎮" };
                        return (
                          <span className={`flex items-center gap-2 ${tier.color}`}>
                            <span className="text-xl">{tier.icon}</span>
                            <span className="font-semibold">{cleanTier}</span>
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-right text-emerald-400 font-semibold">
                      {player.wins}
                    </TableCell>
                    <TableCell className="text-right text-red-400 font-semibold">
                      {player.losses}
                    </TableCell>
                    <TableCell className="text-right text-primary font-bold">
                      {player.wins + player.losses > 0 
                        ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
                        : "0.0"}%
                    </TableCell>
                  </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-card border-2 border-border hover:bg-primary hover:border-primary btn-arcade disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-primary text-foreground btn-arcade" : "bg-card border-2 border-border hover:bg-primary/20 btn-arcade"}
                >
                  {page}
                </Button>
              ))}
              
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
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GlobalLeaderboard;
