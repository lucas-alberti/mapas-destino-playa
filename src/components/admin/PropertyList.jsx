import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { TENANT, BRAND_NAME } from '../../lib/config'

export default function PropertyList({ onEdit, onCreate }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('map_properties')
      .select('*')
      .eq('tenant', TENANT)
      .order('created_at', { ascending: false })
    setProperties(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id, name) {
    if (!confirm(`¿Eliminar "${name}"? También se borrarán sus unidades.`)) return
    await supabase.from('map_properties').delete().eq('id', id)
    load()
  }

  function copyLink(slug) {
    const url = `${window.location.origin}/${slug}`
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="min-h-screen bg-gray-100">
    <div className="max-w-[680px] mx-auto min-h-screen bg-gray-50 shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <header className="bg-brand text-white px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold">Propiedades</h1>
          <p className="text-white/60 text-xs">{BRAND_NAME}</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-white text-brand px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-gray-100 active:scale-95 transition"
        >
          + Nueva
        </button>
      </header>

      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-5xl mb-3">🏖️</p>
            <p className="text-gray-500 text-sm">No hay propiedades aún.</p>
            <button
              onClick={onCreate}
              className="mt-4 bg-brand text-white px-5 py-2 rounded-xl text-sm font-semibold"
            >
              Crear primera propiedad
            </button>
          </div>
        ) : (
          properties.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex gap-3 p-3">
                {p.photo_url ? (
                  <img
                    src={p.photo_url}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                    🏠
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                  {p.location && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{p.location}</p>
                  )}
                  <p className="text-xs text-brand/80 mt-0.5">/{p.slug}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 flex divide-x divide-gray-100">
                <button
                  onClick={() => copyLink(p.slug)}
                  className="flex-1 py-2 text-xs text-gray-500 hover:bg-gray-50 transition"
                >
                  Copiar link
                </button>
                <button
                  onClick={() => onEdit(p)}
                  className="flex-1 py-2 text-xs text-brand font-medium hover:bg-brand/5 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="flex-1 py-2 text-xs text-red-500 hover:bg-red-50 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  )
}
