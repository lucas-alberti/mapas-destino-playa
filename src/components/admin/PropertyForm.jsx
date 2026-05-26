import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { TENANT } from '../../lib/config'
import PhotoUpload from './PhotoUpload'
import UnitEditor from './UnitEditor'

const BASE_URL = 'https://mapas-destino-playa.vercel.app'

export default function PropertyForm({ property, onBack, onSave }) {
  const isEdit = !!property
  const [form, setForm] = useState({
    name: property?.name || '',
    slug: property?.slug || '',
    location: property?.location || '',
    photo_url: property?.photo_url || '',
    contact_text: property?.contact_text || '',
    contact_url: property?.contact_url || '',
  })
  const [units, setUnits] = useState([])
  const [editingUnit, setEditingUnit] = useState(null) // null | 'new' | unit
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState(property?.id || null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isEdit) loadUnits()
  }, [])

  async function loadUnits() {
    const { data } = await supabase
      .from('map_units')
      .select('*')
      .eq('property_id', property.id)
      .order('label')
    setUnits(data || [])
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => {
      const next = { ...f, [name]: value }
      // Auto-slug al escribir el nombre (solo en creación)
      if (name === 'name' && !isEdit) {
        next.slug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .slice(0, 60)
      }
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (isEdit) {
      const { error: err } = await supabase
        .from('map_properties')
        .update(form)
        .eq('id', property.id)
      if (err) { setError(err.message); setSaving(false); return }
      setSaving(false)
      onSave()
    } else {
      const { data, error: err } = await supabase
        .from('map_properties')
        .insert({ ...form, tenant: TENANT })
        .select()
        .single()
      if (err) { setError(err.message); setSaving(false); return }
      setSavedId(data.id)
      setSaving(false)
      // En creación, mostrar sección de unidades sin redirigir
    }
  }

  async function handleDeleteUnit(unitId) {
    if (!confirm('¿Eliminar esta unidad?')) return
    await supabase.from('map_units').delete().eq('id', unitId)
    loadUnits()
  }

  const propId = property?.id || savedId

  function copyGuestUrl() {
    const url = `${BASE_URL}/${form.slug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
    <div className="max-w-[680px] mx-auto min-h-screen bg-gray-50 shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <header className="bg-brand text-white px-4 py-4 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition text-lg"
        >
          ←
        </button>
        <h1 className="text-base font-bold">{isEdit ? 'Editar' : 'Nueva'} propiedad</h1>
      </header>

      <div className="p-4 space-y-4 pb-10">
        {/* Datos básicos */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Datos</h2>

            <div>
              <label className="text-xs text-gray-500">Nombre *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ej: Complejo Paraíso"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Slug (URL pública) *
              </label>
              <div className="flex items-center mt-1 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand/40">
                <span className="px-3 text-gray-400 text-sm bg-gray-50 self-stretch flex items-center border-r border-gray-200">
                  /
                </span>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  placeholder="complejo-paraiso"
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Ubicación</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Ej: Mar de las Pampas, Buenos Aires"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Pie de página</h2>

            <div>
              <label className="text-xs text-gray-500">Texto de contacto</label>
              <input
                name="contact_text"
                value={form.contact_text}
                onChange={handleChange}
                placeholder="Ej: Contactate con recepción virtual."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">URL de contacto (opcional)</label>
              <input
                name="contact_url"
                value={form.contact_url}
                onChange={handleChange}
                placeholder="Ej: https://wa.me/5491112345678"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
              <p className="text-[10px] text-gray-400 mt-1">Si completás este campo, el texto será un enlace.</p>
            </div>
          </div>

          {/* URL del huésped */}
          {form.slug && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">URL del huésped</h2>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                <span className="flex-1 text-xs text-gray-600 truncate select-all">
                  {BASE_URL}/<span className="text-brand font-medium">{form.slug}</span>
                </span>
                <button
                  type="button"
                  onClick={copyGuestUrl}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    backgroundColor: copied ? '#dcfce7' : '#025479',
                    color: copied ? '#16a34a' : '#ffffff',
                  }}
                >
                  {copied ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Copiado
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Foto */}
          <PhotoUpload
            currentUrl={form.photo_url}
            propertySlug={form.slug}
            onUploaded={url => setForm(f => ({ ...f, photo_url: url }))}
          />

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand text-white rounded-2xl py-3.5 font-semibold disabled:opacity-50 hover:bg-brand-dark active:scale-95 transition text-sm"
          >
            {saving
              ? 'Guardando…'
              : isEdit
              ? 'Guardar cambios'
              : savedId
              ? '✓ Propiedad creada'
              : 'Crear propiedad'}
          </button>
        </form>

        {/* Sección de unidades (disponible al editar o después de crear) */}
        {propId && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Unidades</h2>
              <button
                onClick={() => setEditingUnit('new')}
                className="text-brand text-sm font-medium hover:underline"
              >
                + Agregar
              </button>
            </div>

            {units.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-gray-300 text-3xl mb-2">🚪</p>
                <p className="text-sm text-gray-400">Sin unidades.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {units.map(u => (
                  <li key={u.id} className="flex items-center px-4 py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{u.label}</p>
                      <p className="text-xs text-gray-400">
                        {[u.floor && `Piso ${u.floor}`, u.block && `Bloque ${u.block}`]
                          .filter(Boolean)
                          .join(' · ') || '—'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingUnit(u)}
                        className="text-brand text-xs font-medium px-2.5 py-1 rounded-lg hover:bg-brand/10 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(u.id)}
                        className="text-red-500 text-xs font-medium px-2.5 py-1 rounded-lg hover:bg-red-50 transition"
                      >
                        Borrar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Finalizar */}
        {propId && (
          <button
            onClick={onSave}
            className="w-full border-2 border-brand text-brand rounded-2xl py-3 font-semibold hover:bg-brand/5 active:scale-95 transition text-sm"
          >
            Listo, volver al listado
          </button>
        )}
      </div>

      {/* Modal editor de unidad */}
      {editingUnit && (
        <UnitEditor
          unit={editingUnit === 'new' ? null : editingUnit}
          propertyId={propId}
          photoUrl={form.photo_url}
          onClose={() => setEditingUnit(null)}
          onSave={() => { setEditingUnit(null); loadUnits() }}
        />
      )}
    </div>
    </div>
  )
}
