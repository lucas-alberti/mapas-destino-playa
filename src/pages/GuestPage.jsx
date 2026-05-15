import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import MapView from '../components/guest/MapView'
import InstructionsPanel from '../components/guest/InstructionsPanel'

export default function GuestPage() {
  const { slug } = useParams()
  const [property, setProperty] = useState(null)
  const [units, setUnits] = useState([])
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      const { data: prop, error: propErr } = await supabase
        .from('map_properties')
        .select('*')
        .eq('slug', slug)
        .single()

      if (propErr || !prop) {
        setError('Propiedad no encontrada.')
        setLoading(false)
        return
      }

      const { data: unitData } = await supabase
        .from('map_units')
        .select('*')
        .eq('property_id', prop.id)
        .order('label')

      setProperty(prop)
      setUnits(unitData || [])
      setLoading(false)
    }
    load()
  }, [slug])

  function handleSelectUnit(unit) {
    setSelectedUnit(prev => (prev?.id === unit.id ? null : unit))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#025479] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/80 text-sm">Cargando mapa…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#025479] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-white text-4xl mb-3">🗺️</p>
          <p className="text-white font-medium">{error}</p>
          <p className="text-white/60 text-sm mt-1">Verificá el enlace recibido.</p>
        </div>
      </div>
    )
  }

  const sortedUnits = [...units].sort((a, b) => Number(a.label) - Number(b.label))

  return (
    <div className="min-h-screen bg-gray-100">
    <div className="max-w-[680px] mx-auto min-h-screen bg-gray-50 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.08)]">

      {/* Header */}
      <header className="bg-[#025479] text-white text-center px-4 pt-5 pb-4">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 mb-1">
          Destino Playa · {property.location}
        </p>
        <h1 className="text-xl font-bold">{property.name}</h1>
      </header>

      {/* Subtítulo */}
      <div className="text-center px-6 pt-5 pb-1">
        <p className="text-sm text-gray-500 leading-snug">
          Seleccioná tu número de unidad para ver cómo llegar
        </p>
      </div>

      {/* Botonera */}
      <div className="px-4 pt-3 pb-4">
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 text-center mb-2.5">
          Tu unidad
        </p>
        <div className="grid grid-cols-6 gap-2">
          {sortedUnits.map(unit => {
            const isSelected = selectedUnit?.id === unit.id
            const hasSelection = selectedUnit != null
            return (
              <button
                key={unit.id}
                onClick={() => handleSelectUnit(unit)}
                style={{
                  backgroundColor: isSelected
                    ? '#025479'
                    : hasSelection ? '#e0e0e0' : '#ffffff',
                  color: isSelected
                    ? '#ffffff'
                    : hasSelection ? '#aaaaaa' : '#374151',
                  boxShadow: isSelected
                    ? '0 4px 14px rgba(2,84,121,0.4)'
                    : '0 1px 3px rgba(0,0,0,0.08)',
                  transition: 'background-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s',
                }}
                className="py-2.5 rounded-xl text-sm font-semibold active:scale-95 select-none"
              >
                {unit.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Foto con callout */}
      <div className="px-4 pb-4">
        <MapView
          property={property}
          units={units}
          selectedUnit={selectedUnit}
          onSelectUnit={handleSelectUnit}
        />
      </div>

      {/* Panel instrucciones */}
      {selectedUnit && (
        <div className="px-4 pb-4">
          <InstructionsPanel unit={selectedUnit} />
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-6 mt-auto">
        <p className="text-xs text-gray-400">
          ¿Necesitás ayuda?{' '}
          {property.contact_url ? (
            <a
              href={property.contact_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#025479] font-medium underline-offset-2 hover:underline"
            >
              {property.contact_text || 'Contactate con recepción virtual.'}
            </a>
          ) : (
            <span className="text-[#025479] font-medium">
              {property.contact_text || 'Contactate con recepción virtual.'}
            </span>
          )}
        </p>
      </div>

    </div>
    </div>
  )
}
