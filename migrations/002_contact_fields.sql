-- 002_contact_fields.sql
-- Agrega campos de contacto editables a map_properties

ALTER TABLE map_properties
  ADD COLUMN IF NOT EXISTS contact_text text,
  ADD COLUMN IF NOT EXISTS contact_url  text;
