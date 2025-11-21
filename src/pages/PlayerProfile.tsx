import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import SocialSidebar from "@/components/SocialSidebar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { usePlayerProfile, useMatchHistory, useWeaponStats } from "@/hooks/useProfile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import defaultRobotAvatar from "@/assets/default-robot-avatar.png";

const tierData = {
  Master: { color: "text-accent", icon: "👑" },
  Diamond: { color: "text-cyan-400", icon: "💎" },
  Platinum: { color: "text-emerald-400", icon: "🔷" },
  Gold: { color: "text-yellow-400", icon: "🥇" },
  Silver: { color: "text-gray-400", icon: "🥈" },
  Bronze: { color: "text-orange-400", icon: "🥉" },
};

const mockPlayerData = {
  DragonSlayer_X: {
    name: "DragonSlayer_X",
    elo: 2847,
    tier: "Master",
    wins: 284,
    losses: 56,
    avatar: defaultRobotAvatar,
    eloHistory: [
      { match: "1", elo: 2650 },
      { match: "2", elo: 2680 },
      { match: "3", elo: 2720 },
      { match: "4", elo: 2710 },
      { match: "5", elo: 2750 },
      { match: "6", elo: 2780 },
      { match: "7", elo: 2810 },
      { match: "8", elo: 2790 },
      { match: "9", elo: 2820 },
      { match: "10", elo: 2847 },
    ],
    weaponPreferences: [
      { name: "Espada", value: 45, color: "#00f5ff" },
      { name: "Arco", value: 30, color: "#ff006e" },
      { name: "Guantes", value: 25, color: "#ffd700" },
    ],
    recentMatches: [
      { result: "Victoria", opponent: "PixelMaster99", eloChange: "+27", date: "2025-01-15" },
      { result: "Victoria", opponent: "CyberNinja", eloChange: "+25", date: "2025-01-14" },
      { result: "Derrota", opponent: "ThunderFist", eloChange: "-18", date: "2025-01-13" },
      { result: "Victoria", opponent: "ShadowDancer", eloChange: "+28", date: "2025-01-12" },
      { result: "Victoria", opponent: "BlazeFury", eloChange: "+24", date: "2025-01-11" },
    ],
  },
};

const PlayerProfile = () => {
  const { playerName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading, error } = usePlayerProfile(user?.id);
  const { data: matchHistory, isLoading: loadingMatches } = useMatchHistory(profile?.player_data?.id);
  const { data: weaponStats, isLoading: loadingWeapons } = useWeaponStats(profile?.player_data?.id);
  
  // Calcular porcentajes de uso de armas
  const weaponPreferences = weaponStats && weaponStats.length > 0
    ? (() => {
        const total = weaponStats.reduce((sum, w) => sum + w.times_used, 0);
        const colors = ["#00f5ff", "#ff006e", "#ffd700", "#8b5cf6", "#10b981"];
        return weaponStats
          .map((stat, index) => ({
            name: stat.weapon_name,
            value: total > 0 ? Math.round((stat.times_used / total) * 100) : 0,
            color: colors[index % colors.length]
          }))
          .filter(w => w.value > 0);
      })()
    : null;

  // Formatear historial de partidas
  const recentMatches = matchHistory && matchHistory.length > 0
    ? matchHistory.map(match => ({
        result: match.result,
        opponent: match.opponent_name,
        eloChange: match.elo_change >= 0 ? `+${match.elo_change}` : `${match.elo_change}`,
        date: new Date(match.played_at).toLocaleDateString('es-ES')
      }))
    : null;

  // Generar historial de evolución de ELO desde las partidas
  const eloHistory = matchHistory && matchHistory.length > 0
    ? matchHistory
        .slice()
        .reverse() // Más antiguas primero
        .map((match, index) => ({
          match: `${index + 1}`,
          elo: match.player_elo_after
        }))
    : null;
  
  // Usar datos del perfil real o datos mock como fallback
  const playerData = profile ? {
    name: profile.username,
    elo: profile.player_data?.elo || 200,
    tier: profile.player_data?.tier || "Bronze",
    wins: profile.player_data?.wins || 0,
    losses: profile.player_data?.losses || 0,
    avatar: defaultRobotAvatar,
    eloHistory: eloHistory,
    weaponPreferences: weaponPreferences,
    recentMatches: recentMatches,
  } : mockPlayerData[playerName as keyof typeof mockPlayerData] || mockPlayerData.DragonSlayer_X;
  
  const winRate = playerData.wins + playerData.losses > 0 
    ? ((playerData.wins / (playerData.wins + playerData.losses)) * 100).toFixed(1)
    : "0.0";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground animate-fade-in">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Cargando perfil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground animate-fade-in">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4">
          <div className="text-center">
            <p className="text-xl text-muted-foreground mb-4">Debes iniciar sesión para ver tu perfil</p>
            <Button onClick={() => navigate("/")}>Volver al inicio</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <Navbar />
      <SocialSidebar />
      
      <main className="pt-24 pb-16 container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/leaderboard")}
          className="mb-6 hover:bg-primary/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Ranking
        </Button>

        {/* Profile Header */}
        <div className="card-glass rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-glow-cyan">
              <img src={playerData.avatar} alt={playerData.name} className="w-full h-full object-cover" />
            </div>
            
            {/* Player Info */}
            <div className="flex-1">
              <h1 className="font-pixel text-3xl md:text-5xl text-accent neon-text mb-4">
                {playerData.name}
              </h1>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  {(() => {
                    const cleanTier = playerData.tier?.trim() as keyof typeof tierData;
                    const tier = tierData[cleanTier] || { color: "text-foreground", icon: "🎮" };
                    return (
                      <>
                        <span className={`text-3xl`}>
                          {tier.icon}
                        </span>
                        <div>
                          <p className={`text-xl font-bold ${tier.color}`}>
                            {cleanTier}
                          </p>
                          <p className="text-2xl font-bold text-primary">{playerData.elo} ELO</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="border-l-2 border-border/50 pl-6">
                  <p className="text-muted-foreground text-sm">Récord</p>
                  <p className="text-xl font-bold">
                    <span className="text-emerald-400">{playerData.wins}V</span> / <span className="text-red-400">{playerData.losses}D</span>
                  </p>
                  <p className="text-sm text-muted-foreground">Win Rate: <span className="text-primary font-bold">{winRate}%</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ELO Evolution Chart */}
          <div className="card-glass rounded-2xl p-6 shadow-2xl">
            <h2 className="font-pixel text-xl text-accent mb-6">Evolución de ELO</h2>
            {playerData.eloHistory && playerData.eloHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={playerData.eloHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="match" 
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: "Últimas 10 Partidas", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    domain={['dataMin - 50', 'dataMax + 50']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="elo" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground text-lg mb-2">Sin datos de evolución</p>
                  <p className="text-sm text-muted-foreground">Las partidas se registrarán aquí cuando juegues</p>
                </div>
              </div>
            )}
          </div>

          {/* Weapon Preferences Chart */}
          <div className="card-glass rounded-2xl p-6 shadow-2xl">
            <h2 className="font-pixel text-xl text-accent mb-6">Armas Preferidas</h2>
            {playerData.weaponPreferences && playerData.weaponPreferences.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={playerData.weaponPreferences}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine={{ stroke: "hsl(var(--foreground))", strokeWidth: 1 }}
                  >
                    {playerData.weaponPreferences.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ color: "hsl(var(--foreground))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground text-lg mb-2">Sin estadísticas de armas</p>
                  <p className="text-sm text-muted-foreground">Usa diferentes armas en partidas para ver tus preferencias</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Match History */}
        <div className="card-glass rounded-2xl p-6 md:p-8 shadow-2xl">
          <h2 className="font-pixel text-2xl text-accent mb-6">Historial de Partidas Recientes</h2>
          {playerData.recentMatches && playerData.recentMatches.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-bold">Resultado</TableHead>
                  <TableHead className="text-muted-foreground font-bold">Oponente</TableHead>
                  <TableHead className="text-muted-foreground font-bold text-right">Cambio de ELO</TableHead>
                  <TableHead className="text-muted-foreground font-bold text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playerData.recentMatches.map((match, index) => (
                  <TableRow
                    key={index}
                    className="border-border/30 hover:bg-primary/10 transition-colors"
                  >
                    <TableCell className={`font-bold ${match.result === "Victoria" ? "text-emerald-400" : "text-red-400"}`}>
                      {match.result}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{match.opponent}</TableCell>
                    <TableCell className={`text-right font-bold ${match.eloChange.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                      {match.eloChange}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{match.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-2">Sin partidas registradas</p>
              <p className="text-sm text-muted-foreground">Tu historial de combates aparecerá aquí</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlayerProfile;
