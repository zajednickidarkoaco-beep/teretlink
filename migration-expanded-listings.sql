-- =====================================================
-- MIGRACIJA: PROŠIRENA POLJA ZA TURE I KAMIONE
-- Na osnovu industry standarda: TIMOCOM, Trans.eu, CargoAgent
-- Pokrenuti u Supabase Dashboard → SQL Editor
-- =====================================================

-- -------------------------------------------------------
-- LOADS TABLE - nova polja
-- -------------------------------------------------------
ALTER TABLE public.loads
  ADD COLUMN IF NOT EXISTS origin_postal_code TEXT,
  ADD COLUMN IF NOT EXISTS destination_postal_code TEXT,
  ADD COLUMN IF NOT EXISTS weight_tonnes DECIMAL(10,3),
  ADD COLUMN IF NOT EXISTS loading_meters DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS volume_m3 DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS load_type TEXT,
  ADD COLUMN IF NOT EXISTS pallet_count INTEGER,
  ADD COLUMN IF NOT EXISTS is_stackable BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_ftl BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS adr_classes TEXT[],
  ADD COLUMN IF NOT EXISTS loading_methods TEXT[],
  ADD COLUMN IF NOT EXISTS temperature_min DECIMAL(5,1),
  ADD COLUMN IF NOT EXISTS temperature_max DECIMAL(5,1),
  ADD COLUMN IF NOT EXISTS reference_number TEXT,
  ADD COLUMN IF NOT EXISTS loading_time TEXT,
  ADD COLUMN IF NOT EXISTS unloading_time TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- -------------------------------------------------------
-- TRUCKS TABLE - nova polja
-- -------------------------------------------------------
ALTER TABLE public.trucks
  ADD COLUMN IF NOT EXISTS origin_postal_code TEXT,
  ADD COLUMN IF NOT EXISTS destination_postal_code TEXT,
  ADD COLUMN IF NOT EXISTS weight_capacity DECIMAL(10,3),
  ADD COLUMN IF NOT EXISTS loading_meters DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS adr_capable BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS adr_classes TEXT[],
  ADD COLUMN IF NOT EXISTS loading_methods TEXT[],
  ADD COLUMN IF NOT EXISTS temperature_min DECIMAL(5,1),
  ADD COLUMN IF NOT EXISTS temperature_max DECIMAL(5,1),
  ADD COLUMN IF NOT EXISTS truck_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- -------------------------------------------------------
-- PROVERA - trebalo bi da vrati sve kolone
-- -------------------------------------------------------
DO $$
BEGIN
  RAISE NOTICE '✅ MIGRACIJA USPEŠNO ZAVRŠENA!';
  RAISE NOTICE '';
  RAISE NOTICE '📦 Nova polja u LOADS tabeli:';
  RAISE NOTICE '  • origin_postal_code, destination_postal_code';
  RAISE NOTICE '  • weight_tonnes, loading_meters, volume_m3';
  RAISE NOTICE '  • load_type, pallet_count, is_stackable, is_ftl';
  RAISE NOTICE '  • adr_classes, loading_methods';
  RAISE NOTICE '  • temperature_min, temperature_max';
  RAISE NOTICE '  • reference_number, loading_time, unloading_time';
  RAISE NOTICE '  • contact_phone';
  RAISE NOTICE '';
  RAISE NOTICE '🚛 Nova polja u TRUCKS tabeli:';
  RAISE NOTICE '  • origin_postal_code, destination_postal_code';
  RAISE NOTICE '  • weight_capacity, loading_meters';
  RAISE NOTICE '  • adr_capable, adr_classes, loading_methods';
  RAISE NOTICE '  • temperature_min, temperature_max';
  RAISE NOTICE '  • truck_count, contact_phone';
END $$;
