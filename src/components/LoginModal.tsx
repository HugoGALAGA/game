import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateUsername, validateEmail, validatePassword } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (username: string) => void;
}

const LoginModal = ({ open, onOpenChange, onLogin }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signUp: authSignUp, signIn: authSignIn } = useAuth();

  const handleGuestLogin = () => {
    const validation = validateUsername(username);
    
    if (!validation.isValid) {
      toast({
        title: "Nombre de usuario inválido",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }
    
    onLogin(username.trim());
    onOpenChange(false);
    setUsername("");
    toast({
      title: "¡Bienvenido Invitado!",
      description: `Has entrado como ${username.trim()}`,
    });
  };

  const handleEmailLogin = async () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      toast({
        title: "Email inválido",
        description: emailValidation.error,
        variant: "destructive",
      });
      return;
    }
    
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "La contraseña es requerida",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await authSignIn(email.trim(), password.trim());

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Error de inicio de sesión",
            description: "Credenciales incorrectas o usuario no registrado",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        const username = data.user.user_metadata?.username || data.user.email?.split('@')[0] || "Usuario";
        onLogin(username);
        onOpenChange(false);
        setEmail("");
        setPassword("");
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      toast({
        title: "Email inválido",
        description: emailValidation.error,
        variant: "destructive",
      });
      return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Contraseña inválida",
        description: passwordValidation.error,
        variant: "destructive",
      });
      return;
    }

    const usernameValidation = validateUsername(registerUsername);
    if (!usernameValidation.isValid) {
      toast({
        title: "Nombre de usuario inválido",
        description: usernameValidation.error,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authSignUp(email.trim(), password.trim(), registerUsername.trim());

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Usuario ya registrado",
            description: "Este correo ya está registrado. Intenta iniciar sesión.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        onLogin(registerUsername.trim());
        onOpenChange(false);
        setEmail("");
        setPassword("");
        setRegisterUsername("");
        toast({
          title: "¡Cuenta creada!",
          description: "Tu cuenta ha sido creada exitosamente",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-md border-border">
        <DialogHeader>
          <DialogTitle className="font-pixel text-2xl text-accent">Iniciar Sesión</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Conecta con tu cuenta para acceder a tu perfil y estadísticas.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background/50">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="social">Redes Sociales</TabsTrigger>
          </TabsList>
          
          {/* Email/Password Tab */}
          <TabsContent value="email" className="space-y-4 pt-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-background/30 mb-4">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
              
              {/* Login Nested Tab */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-foreground">
                    Correo Electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background/50 border-border"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-foreground">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                      className="pl-10 bg-background/50 border-border"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleEmailLogin}
                  disabled={!email.trim() || !password.trim() || loading}
                  className="w-full bg-gradient-neon font-bold shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] transition-all duration-300 hover:scale-105"
                >
                  {loading ? "Iniciando..." : "Iniciar Sesión"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">O</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guest-username-login" className="text-foreground">
                    Entrar como Invitado
                  </Label>
                  <Input
                    id="guest-username-login"
                    type="text"
                    placeholder="Nombre de usuario..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGuestLogin()}
                    className="bg-background/50 border-border"
                    disabled={loading}
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground">
                    Permite letras, números, espacios y los caracteres: _ - .
                  </p>
                </div>

                <Button
                  onClick={handleGuestLogin}
                  disabled={!username.trim() || loading}
                  variant="outline"
                  className="w-full border-primary/50 hover:bg-primary/20 hover:scale-105 transition-all duration-300"
                >
                  Continuar como Invitado
                </Button>
              </TabsContent>
              
              {/* Register Nested Tab */}
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username" className="text-foreground">
                    Nombre de Usuario
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Nombre de jugador..."
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      className="pl-10 bg-background/50 border-border"
                      disabled={loading}
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Este será tu nombre visible en el juego
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-foreground">
                    Correo Electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background/50 border-border"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-foreground">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailSignup()}
                      className="pl-10 bg-background/50 border-border"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    La contraseña debe tener al menos 6 caracteres
                  </p>
                </div>

                <Button
                  onClick={handleEmailSignup}
                  disabled={!registerUsername.trim() || !email.trim() || !password.trim() || loading}
                  className="w-full bg-gradient-neon font-bold shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] transition-all duration-300 hover:scale-105"
                >
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">O</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guest-username-register" className="text-foreground">
                    Entrar como Invitado
                  </Label>
                  <Input
                    id="guest-username-register"
                    type="text"
                    placeholder="Nombre de usuario..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGuestLogin()}
                    className="bg-background/50 border-border"
                    disabled={loading}
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground">
                    Permite letras, números, espacios y los caracteres: _ - .
                  </p>
                </div>

                <Button
                  onClick={handleGuestLogin}
                  disabled={!username.trim() || loading}
                  variant="outline"
                  className="w-full border-primary/50 hover:bg-primary/20 hover:scale-105 transition-all duration-300"
                >
                  Continuar como Invitado
                </Button>
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          {/* Social Login Tab */}
          <TabsContent value="social" className="space-y-4 pt-4">
            <div className="space-y-3">
              <Button
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? "Conectando..." : "Continuar con Google"}
              </Button>
              
              <Button
                onClick={() => handleSocialLogin("github")}
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
                {loading ? "Conectando..." : "Continuar con GitHub"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
