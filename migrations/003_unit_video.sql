-- 003_unit_video.sql
-- Agrega campo de video YouTube por unidad

ALTER TABLE map_units ADD COLUMN IF NOT EXISTS video_url text;
