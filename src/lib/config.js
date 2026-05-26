// Tenant activo — configurado via VITE_TENANT en cada deploy
export const TENANT = import.meta.env.VITE_TENANT || 'destino-playa'

// Nombre de marca que aparece en el admin y la vista huésped
export const BRAND_NAME = import.meta.env.VITE_BRAND_NAME || 'Destino Playa'
