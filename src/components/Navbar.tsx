import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginModal from "./LoginModal";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || null;

  const scrollToSection = (id: string) => {
    // First navigate to home if not already there
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleLogin = (usernameParam: string) => {
    // El modal cierra y el estado se actualiza automáticamente por useAuth
    setLoginModalOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-sm border-b-4 border-foreground/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
              className="font-pixel text-xs md:text-sm pixel-title hover:opacity-80 transition-opacity cursor-pointer"
            >
              DINKY BATTLE
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold">
                About
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-2 border-foreground/20 shadow-solid">
                <DropdownMenuItem 
                  onClick={() => scrollToSection("story")}
                  className="cursor-pointer hover:bg-primary/30"
                >
                  Story
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => scrollToSection("features")}
                  className="cursor-pointer hover:bg-primary/30"
                >
                  Features
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => scrollToSection("characters")}
              className="text-foreground hover:text-primary transition-colors text-sm font-semibold"
            >
              Characters
            </button>

            <button
              onClick={() => window.location.href = "/leaderboard"}
              className="text-foreground hover:text-primary transition-colors text-sm font-semibold"
            >
              Ranking
            </button>

            <button
              onClick={() => window.location.href = "/news"}
              className="text-foreground hover:text-primary transition-colors text-sm font-semibold"
            >
              News
            </button>

            <button
              onClick={() => window.location.href = "/assets"}
              className="text-foreground hover:text-primary transition-colors text-sm font-semibold"
            >
              Assets
            </button>
          </div>

          {/* Login/User Section */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {username ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/30 border-2 border-foreground/20 flex items-center justify-center">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold">{username}</span>
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-2 border-foreground/20 shadow-solid">
                  <DropdownMenuItem 
                    onClick={() => navigate(`/player/${username}`)}
                    className="cursor-pointer hover:bg-primary/30"
                  >
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-destructive/30 text-destructive font-semibold"
                  >
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => setLoginModalOpen(true)}
                className="bg-secondary text-foreground hover:bg-secondary/90 btn-arcade text-sm font-bold"
              >
                Login
              </Button>
            )}
            
            <Button 
              size="sm"
              className="bg-primary text-foreground hover:bg-primary/90 btn-arcade text-sm font-bold"
            >
              Download
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t-4 border-foreground/20">
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection("story")}
                className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-primary/20 transition-colors font-semibold"
              >
                Story
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-primary/20 transition-colors font-semibold"
              >
                Game Features
              </button>
            </div>
            <button
              onClick={() => scrollToSection("characters")}
              className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-primary/20 transition-colors font-semibold"
            >
              CHARACTERS
            </button>
            <button
              onClick={() => window.location.href = "/leaderboard"}
              className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-primary/20 transition-colors font-semibold"
            >
              RANKING
            </button>
            <button
              onClick={() => window.location.href = "/news"}
              className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-primary/20 transition-colors font-semibold"
            >
              NEWS
            </button>
            <button
              onClick={() => window.location.href = "/assets"}
              className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-primary/20 transition-colors font-semibold"
            >
              ASSETS
            </button>
            
            <div className="px-4 space-y-2">
              {username ? (
                <>
                  <Button 
                    onClick={() => {
                      navigate(`/player/${username}`);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-secondary text-foreground hover:bg-secondary/90 btn-arcade font-bold"
                  >
                    Mi Perfil ({username})
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    className="w-full bg-destructive text-foreground hover:bg-destructive/90 btn-arcade font-bold"
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    setLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-secondary text-foreground hover:bg-secondary/90 btn-arcade font-bold"
                >
                  LOGIN
                </Button>
              )}
              
              <Button className="w-full bg-primary text-foreground hover:bg-primary/90 btn-arcade font-bold">
                DOWNLOAD DEMO
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
        onLogin={handleLogin}
      />
    </nav>
  );
};

export default Navbar;
