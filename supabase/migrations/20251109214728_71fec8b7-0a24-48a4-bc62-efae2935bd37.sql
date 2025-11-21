-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Políticas para PROFILES
-- Todos pueden ver perfiles
CREATE POLICY "Perfiles son visibles por todos"
  ON public.profiles FOR SELECT
  USING (true);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Usuarios pueden insertar su propio perfil
CREATE POLICY "Usuarios pueden insertar su perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas para PLAYERS
-- Todos pueden ver el ranking
CREATE POLICY "Ranking es visible por todos"
  ON public.players FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden insertar jugadores
CREATE POLICY "Usuarios autenticados pueden crear jugadores"
  ON public.players FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Usuarios pueden actualizar sus propios datos de jugador
CREATE POLICY "Usuarios pueden actualizar sus datos"
  ON public.players FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para NEWS
-- Todos pueden ver noticias
CREATE POLICY "Noticias son visibles por todos"
  ON public.news FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden crear noticias
CREATE POLICY "Usuarios autenticados pueden crear noticias"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Autores pueden actualizar sus propias noticias
CREATE POLICY "Autores pueden actualizar sus noticias"
  ON public.news FOR UPDATE
  USING (auth.uid() = author_id);

-- Autores pueden eliminar sus propias noticias
CREATE POLICY "Autores pueden eliminar sus noticias"
  ON public.news FOR DELETE
  USING (auth.uid() = author_id);

-- Políticas para ASSETS
-- Todos pueden ver assets
CREATE POLICY "Assets son visibles por todos"
  ON public.assets FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden crear assets
CREATE POLICY "Usuarios autenticados pueden crear assets"
  ON public.assets FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Fijar search_path en funciones existentes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;