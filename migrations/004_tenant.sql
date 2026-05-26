-- 004_tenant.sql
-- Soporte multi-tenant en map_properties

ALTER TABLE map_properties ADD COLUMN IF NOT EXISTS tenant text NOT NULL DEFAULT 'destino-playa';
CREATE INDEX IF NOT EXISTS map_properties_tenant_idx ON map_properties(tenant);
UPDATE map_properties SET tenant = 'destino-playa' WHERE tenant = '';
