-- ============================================================
-- Migración 001 — mapas-destino-playa
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Proyecto: wlaaflgidjxmgvoaoyvd
-- ============================================================

-- Tabla de propiedades
CREATE TABLE IF NOT EXISTS map_properties (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text        UNIQUE NOT NULL,
  name       text        NOT NULL,
  location   text,
  photo_url  text,
  created_at timestamptz DEFAULT now()
);

-- Tabla de unidades
CREATE TABLE IF NOT EXISTS map_units (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid        NOT NULL REFERENCES map_properties(id) ON DELETE CASCADE,
  label       text        NOT NULL,
  floor       text,
  block       text,
  steps       jsonb       NOT NULL DEFAULT '[]'::jsonb,
  tip         text,
  pos_x       float8,
  pos_y       float8,
  created_at  timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS map_properties_slug_idx    ON map_properties(slug);
CREATE INDEX IF NOT EXISTS map_units_property_id_idx  ON map_units(property_id);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE map_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_units      ENABLE ROW LEVEL SECURITY;

-- Lectura pública (vista del huésped)
CREATE POLICY "public_read_properties"
  ON map_properties FOR SELECT USING (true);

CREATE POLICY "public_read_units"
  ON map_units FOR SELECT USING (true);

-- Escritura para el panel admin (anon key + password en el cliente)
-- Si preferís usar service_role en producción, eliminá estas 6 políticas
-- y en su lugar configurá la clave de servicio solo en el backend.
CREATE POLICY "anon_insert_properties"
  ON map_properties FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_update_properties"
  ON map_properties FOR UPDATE USING (true);

CREATE POLICY "anon_delete_properties"
  ON map_properties FOR DELETE USING (true);

CREATE POLICY "anon_insert_units"
  ON map_units FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_update_units"
  ON map_units FOR UPDATE USING (true);

CREATE POLICY "anon_delete_units"
  ON map_units FOR DELETE USING (true);

-- ============================================================
-- Storage bucket property-photos
-- ============================================================

-- Crear el bucket público (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-photos', 'property-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-photos');

CREATE POLICY "storage_anon_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-photos');

CREATE POLICY "storage_anon_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'property-photos');

CREATE POLICY "storage_anon_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-photos');
