-- Arreglar el search_path de las funciones creadas para seguridad
CREATE OR REPLACE FUNCTION public.calculate_tier_from_elo(elo_value integer)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.auto_assign_tier()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.tier := public.calculate_tier_from_elo(NEW.elo);
  RETURN NEW;
END;
$$;