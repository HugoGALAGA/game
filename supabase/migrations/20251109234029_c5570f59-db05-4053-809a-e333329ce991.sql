-- Función para calcular el tier correcto basado en el ELO
CREATE OR REPLACE FUNCTION public.calculate_tier_from_elo(elo_value integer)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  CASE
    WHEN elo_value >= 5001 THEN RETURN 'Master';
    WHEN elo_value >= 3001 THEN RETURN 'Diamond';
    WHEN elo_value >= 2001 THEN RETURN 'Platinum';
    WHEN elo_value >= 1201 THEN RETURN 'Gold';
    WHEN elo_value >= 501 THEN RETURN 'Silver';
    ELSE RETURN 'Bronze';
  END CASE;
END;
$$;

-- Trigger function para auto-asignar el tier correcto antes de INSERT o UPDATE
CREATE OR REPLACE FUNCTION public.auto_assign_tier()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Calcular y asignar el tier correcto basado en el ELO
  NEW.tier := public.calculate_tier_from_elo(NEW.elo);
  RETURN NEW;
END;
$$;

-- Crear el trigger en la tabla players
DROP TRIGGER IF EXISTS trigger_auto_assign_tier ON public.players;
CREATE TRIGGER trigger_auto_assign_tier
  BEFORE INSERT OR UPDATE OF elo
  ON public.players
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_tier();

-- Actualizar los tiers existentes para que sean consistentes
UPDATE public.players
SET tier = public.calculate_tier_from_elo(elo);