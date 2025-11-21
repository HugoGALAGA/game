-- TABLA 1: PROFILES (Perfiles de Usuario)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);
COMMENT ON TABLE public.profiles IS 'Perfiles públicos para usuarios registrados.';

-- TABLA 2: PLAYERS (Jugadores y Ranking)
CREATE TABLE IF NOT EXISTS public.players (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  elo integer NOT NULL DEFAULT 1200,
  tier text NOT NULL DEFAULT 'Bronze',
  wins integer NOT NULL DEFAULT 0,
  losses integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.players IS 'Datos de ranking y ELO de los jugadores.';

-- TABLA 3: NEWS (Noticias)
CREATE TABLE IF NOT EXISTS public.news (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.news IS 'Artículos para la sección de noticias.';

-- TABLA 4: ASSETS (Recursos Descargables)
CREATE TABLE IF NOT EXISTS public.assets (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL,
  format text NOT NULL,
  size text,
  download_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.assets IS 'Recursos descargables como música, wallpapers, etc.';

-- Función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger para actualizar updated_at en players
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_players_updated_at ON public.players;
CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON public.players
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();