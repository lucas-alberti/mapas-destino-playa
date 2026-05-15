// seed-grand-mana.js — Carga las 18 unidades del Grand Maná del Mar
// Uso: node scripts/seed-grand-mana.js
// Requiere que la propiedad con slug "grand-mana" exista en map_properties.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Leer .env manualmente (sin dependencia de dotenv)
const envPath = resolve(__dirname, '../.env')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

const SLUG = 'grand-mana'

const UNITS = [
  {
    label: '1', floor: 'Planta baja', block: 'Ed. Izquierdo',
    pos_x: 9.5,  pos_y: 75.0,
    steps: ['Entrá por el acceso principal.', 'Girá a tu izquierda.', 'Primera puerta del pasillo exterior.'],
    tip: 'La más cercana al jardín frontal izquierdo.',
  },
  {
    label: '2', floor: '1° piso', block: 'Ed. Izquierdo',
    pos_x: 10.0, pos_y: 44.5,
    steps: ['Entrá y girá a tu izquierda.', 'Subí la escalera al 1° piso.', 'Primera puerta a tu izquierda.'],
    tip: 'La escalera está al fondo del pasillo cubierto.',
  },
  {
    label: '3', floor: '2° piso', block: 'Ed. Izquierdo',
    pos_x: 9.5,  pos_y: 20.5,
    steps: ['Entrá y girá a tu izquierda.', 'Subí hasta el 2° piso.', 'Primera puerta. Balcón con vista al frente.'],
    tip: '',
  },
  {
    label: '4', floor: 'Planta baja', block: 'Ed. Central izq.',
    pos_x: 31.5, pos_y: 79.5,
    steps: ['Entrá y avanzá hacia el centro.', 'Buscá el módulo central izquierdo.', 'Planta baja, al nivel del acceso central.'],
    tip: 'Está casi al lado del cartel del complejo.',
  },
  {
    label: '5', floor: '1° piso', block: 'Ed. Central izq.',
    pos_x: 31.5, pos_y: 56.0,
    steps: ['Avanzá hacia el centro.', 'Tomá la escalera interior del módulo central izquierdo.', 'Subí al 1° piso. Primera puerta.'],
    tip: '',
  },
  {
    label: '6', floor: '2° piso', block: 'Ed. Central izq.',
    pos_x: 31.5, pos_y: 41.0,
    steps: ['Avanzá hacia el centro.', 'Tomá la escalera interior del módulo central izquierdo.', 'Subí al 2° piso. Queda a tu izquierda.'],
    tip: 'Balcón con vista al jardín central.',
  },
  {
    label: '7', floor: 'Planta baja', block: 'Ed. Derecho',
    pos_x: 68.0, pos_y: 74.0,
    steps: ['Entrá y girá a tu derecha.', 'Avanzá por el pasillo del Edificio Derecho.', 'Planta baja, primera puerta a la derecha.'],
    tip: '',
  },
  {
    label: '8', floor: '1° piso', block: 'Ed. Derecho',
    pos_x: 68.0, pos_y: 59.5,
    steps: ['Entrá y girá a tu derecha.', 'Subí la escalera al 1° piso.', 'Primera puerta a tu derecha.'],
    tip: '',
  },
  {
    label: '9', floor: '2° piso', block: 'Ed. Derecho',
    pos_x: 68.5, pos_y: 48.0,
    steps: ['Entrá y girá a tu derecha.', 'Subí hasta el 2° piso.', 'Primera puerta. Tiene balcón panorámico.'],
    tip: 'Vista panorámica al frente desde el balcón.',
  },
  {
    label: '10', floor: 'Planta baja', block: 'Ed. Derecho ext.',
    pos_x: 93.5, pos_y: 75.0,
    steps: ['Entrá y girá a tu derecha.', 'Avanzá hasta el fondo del pasillo.', 'Planta baja, fachada exterior derecha.'],
    tip: '',
  },
  {
    label: '11', floor: '1° piso', block: 'Ed. Derecho ext.',
    pos_x: 93.5, pos_y: 47.5,
    steps: ['Ingresá al Edificio Derecho.', 'Subí la escalera al 1° piso.', 'Extremo exterior del piso.'],
    tip: '',
  },
  {
    label: '12', floor: '2° piso', block: 'Ed. Derecho ext.',
    pos_x: 86.5, pos_y: 21.5,
    steps: ['Ingresá al Edificio Derecho.', 'Subí hasta el 2° piso.', 'Última del pasillo. Balcón en esquina.'],
    tip: 'Balcón esquinero con vista amplia.',
  },
  {
    label: '13', floor: 'Planta baja', block: 'Ed. Central',
    pos_x: 37.0, pos_y: 72.5,
    steps: ['Entrá y avanzá al centro.', 'Planta baja, al pie de la escalera central.'],
    tip: 'Justo detrás del cartel principal.',
  },
  {
    label: '14', floor: '1° piso', block: 'Ed. Central izq.',
    pos_x: 36.5, pos_y: 63.0,
    steps: ['Avanzá al centro.', 'Subí la escalera central al 1° piso.', 'A tu izquierda al llegar.'],
    tip: '',
  },
  {
    label: '15', floor: '2° piso', block: 'Ed. Central izq.',
    pos_x: 36.5, pos_y: 51.5,
    steps: ['Avanzá al centro.', 'Subí la escalera central al 2° piso.', 'A tu izquierda.'],
    tip: '',
  },
  {
    label: '16', floor: 'Planta baja', block: 'Ed. Central der.',
    pos_x: 51.0, pos_y: 74.5,
    steps: ['Avanzá al centro.', 'Planta baja, lado derecho del módulo central.'],
    tip: 'Al lado del jardín con pendiente verde.',
  },
  {
    label: '17', floor: '1° piso', block: 'Ed. Central der.',
    pos_x: 51.0, pos_y: 62.5,
    steps: ['Avanzá al centro.', 'Subí la escalera central al 1° piso.', 'A tu derecha al llegar.'],
    tip: '',
  },
  {
    label: '18', floor: '2° piso', block: 'Ed. Central der.',
    pos_x: 49.5, pos_y: 51.5,
    steps: ['Avanzá al centro.', 'Subí la escalera central al 2° piso.', 'A tu derecha. Balcón con vista al jardín.'],
    tip: 'Vista al jardín central desde el balcón.',
  },
]

async function seed() {
  console.log(`Buscando propiedad con slug "${SLUG}"…`)

  const { data: property, error: propErr } = await supabase
    .from('map_properties')
    .select('id, name')
    .eq('slug', SLUG)
    .single()

  if (propErr || !property) {
    console.error(`✗ No se encontró la propiedad con slug "${SLUG}".`)
    if (propErr) console.error('  Supabase error:', propErr.code, '—', propErr.message)
    console.error('  → Ejecutá migrations/001_initial.sql en Supabase y creá la propiedad desde /admin.')
    process.exit(1)
  }

  console.log(`✓ Propiedad encontrada: "${property.name}" (${property.id})`)

  // Borrar unidades previas para evitar duplicados en re-ejecuciones
  const { error: delErr } = await supabase
    .from('map_units')
    .delete()
    .eq('property_id', property.id)

  if (delErr) {
    console.error('✗ Error al limpiar unidades previas:', delErr.message)
    process.exit(1)
  }

  console.log('  Unidades previas eliminadas.')

  // Insertar las 18 unidades
  const rows = UNITS.map(u => ({
    property_id: property.id,
    label:       u.label,
    floor:       u.floor,
    block:       u.block,
    pos_x:       u.pos_x,
    pos_y:       u.pos_y,
    steps:       u.steps,
    tip:         u.tip || null,
  }))

  const { data: inserted, error: insErr } = await supabase
    .from('map_units')
    .insert(rows)
    .select('id, label')

  if (insErr) {
    console.error('✗ Error al insertar unidades:', insErr.message)
    process.exit(1)
  }

  console.log(`✓ ${inserted.length} unidades insertadas:`)
  inserted.forEach(u => console.log(`  · Unidad ${u.label} — ${u.id}`))
  console.log('\n¡Listo! Visitá http://localhost:5173/grand-mana para verlas.')
}

seed()
