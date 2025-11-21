import { Trophy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import rankingBackground from "@/assets/ranking-background.png";
import { useTopPlayers } from "@/hooks/useRankings";

const RankingSection = () => {
  const { data: players = [], isLoading } = useTopPlayers(5);
  return (
    <section 
      id="ranking" 
      className="relative min-h-screen py-20 flex items-center justify-center"
      style={{
        backgroundImage: `url(${rankingBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/90" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-4xl md:text-6xl pixel-title inline-block pb-4">
            COMMUNITY RANKING
          </h2>
        </div>

        {/* Ranking Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card/70 rounded-lg p-8 md:p-12 shadow-arcade border-4 border-foreground/20 card-arcade backdrop-blur-sm">
            {/* Trophy Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-winner flex items-center justify-center shadow-arcade border-4 border-foreground/20 animate-float">
                <Trophy className="w-10 h-10 text-foreground" />
              </div>
            </div>

            {/* Top 5 Table */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  Cargando rankings...
                </div>
              ) : players.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No hay jugadores registrados todavía
                </div>
              ) : (
                players.map((player, index) => (
                <div
                  key={player.id}
                  className={`
                    flex items-center justify-between p-4 rounded-lg transition-all duration-200 btn-arcade
                    ${index + 1 === 1
                      ? "bg-accent/40 border-4 border-accent" 
                      : index + 1 === 2
                      ? "bg-card/80 border-4 border-secondary"
                      : index + 1 === 3
                      ? "bg-card/80 border-4 border-primary"
                      : "bg-card/60 border-4 border-foreground/20"
                    }
                  `}
                >
                  {/* Rank */}
                  <div className="flex items-center gap-4 flex-1">
                    <span className={`
                      font-pixel text-2xl md:text-3xl w-12 text-center
                      ${index + 1 === 1 ? "text-accent drop-shadow-lg" : "text-foreground"}
                    `}>
                      #{index + 1}
                    </span>

                    {/* Player Name */}
                    <span className="text-lg md:text-xl font-bold text-foreground">
                      {player.name}
                    </span>
                  </div>

                  {/* ELO */}
                  <div className="text-right">
                    <span className="text-sm text-foreground/70 block font-semibold">ELO</span>
                    <span className="text-xl md:text-2xl font-bold text-primary drop-shadow-md">
                      {player.elo}
                    </span>
                  </div>
                </div>
              ))
              )}
            </div>

            {/* View Full Rankings Button */}
            <div className="mt-12 text-center">
              <Button
                size="lg"
                className="bg-primary text-foreground hover:bg-primary/90 font-bold text-base md:text-lg px-10 py-7 btn-arcade"
                onClick={() => window.location.href = "/leaderboard"}
              >
                View Full Rankings & Stats
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-body mt-4 drop-shadow-md">
                Track your progress and compete with players worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RankingSection;
