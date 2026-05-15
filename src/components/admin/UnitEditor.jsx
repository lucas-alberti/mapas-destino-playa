import { useState, useRef, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

export default function UnitEditor({ unit, propertyId, photoUrl, onClose, onSave }) {
  const isEdit = !!unit
  const [form, setForm] = useState({
    label: unit?.label || '',
    floor: unit?.floor || '',
    block: unit?.block || '',
    tip: unit?.tip || '',
    pos_x: unit?.pos_x ?? 50,
    pos_y: unit?.pos_y ?? 50,
    steps: unit?.steps ? [...unit.steps] : [],
  })
  const [stepInput, setStepInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const imgRef = useRef(null)
  const isDragging = useRef(false)

  function updatePos(clientX, clientY) {
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
    setForm(f => ({
      ...f,
      pos_x: Math.round(x * 10) / 10,
      pos_y: Math.round(y * 10) / 10,
    }))
  }

  const handlePointerDown = useCallback((e) => {
    e.preventDefault()
    isDragging.current = true
    updatePos(e.clientX, e.clientY)

    function onMove(ev) {
      if (!isDragging.current) return
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY
      updatePos(cx, cy)
    }
    function onUp() {
      isDragging.current = false
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function addStep() {
    if (!stepInput.trim()) return
    setForm(f => ({ ...f, steps: [...f.steps, stepInput.trim()] }))
    setStepInput('')
  }

  function removeStep(i) {
    setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }))
  }

  function moveStep(i, dir) {
    setForm(f => {
      const steps = [...f.steps]
      const j = i + dir
      if (j < 0 || j >= steps.length) return f;
      [steps[i], steps[j]] = [steps[j], steps[i]]
      return { ...f, steps }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      label: form.label,
      floor: form.floor || null,
      block: form.block || null,
      tip: form.tip || null,
      steps: form.steps,
      pos_x: form.pos_x,
      pos_y: form.pos_y,
      property_id: propertyId,
    }

    const { error: err } = isEdit
      ? await supabase.from('map_units').update(payload).eq('id', unit.id)
      : await supabase.from('map_units').insert(payload)

    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-semibold text-gray-900">
            {isEdit ? 'Editar' : 'Nueva'} unidad
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-4 space-y-5">
          {/* Posicionamiento sobre la foto */}
          {photoUrl ? (
            <div>
              <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                <span>📍</span>
                Tocá o arrastrá sobre la foto para posicionar
              </p>
              <div
                className="relative rounded-xl overflow-hidden cursor-crosshair select-none touch-none"
                onPointerDown={handlePointerDown}
              >
                <img
                  ref={imgRef}
                  src={photoUrl}
                  alt="Mapa"
                  className="w-full block pointer-events-none"
                  draggable={false}
                />
                {/* Pin de posición */}
                <div
                  style={{ left: `${form.pos_x}%`, top: `${form.pos_y}%` }}
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className="w-6 h-6 rounded-full bg-yellow-400 border-3 border-white shadow-lg ring-4 ring-yellow-400/30" />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap shadow">
                    {form.label || '?'}
                  </div>
                </div>
                {/* Coords */}
                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {form.pos_x.toFixed(1)}%, {form.pos_y.toFixed(1)}%
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              Guardá la propiedad con una foto primero para posicionar el ícono.
            </p>
          )}

          {/* Campos básicos */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-500">Label *</label>
              <input
                name="label"
                value={form.label}
                onChange={handleChange}
                required
                placeholder="Ej: Unidad 101"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Piso</label>
              <input
                name="floor"
                value={form.floor}
                onChange={handleChange}
                placeholder="Ej: 1"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Bloque</label>
              <input
                name="block"
                value={form.block}
                onChange={handleChange}
                placeholder="Ej: A"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          {/* Pasos */}
          <div>
            <label className="text-xs text-gray-500">Pasos / instrucciones</label>
            <div className="mt-1.5 space-y-2">
              {form.steps.map((step, i) => (
                <div key={i} className="flex gap-2 items-center bg-gray-50 rounded-xl px-3 py-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-gray-700">{step}</span>
                  <div className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveStep(i, -1)}
                      disabled={i === 0}
                      className="text-gray-300 hover:text-gray-500 disabled:opacity-30 px-0.5"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStep(i, 1)}
                      disabled={i === form.steps.length - 1}
                      className="text-gray-300 hover:text-gray-500 disabled:opacity-30 px-0.5"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="text-red-400 hover:text-red-600 px-0.5 ml-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  value={stepInput}
                  onChange={e => setStepInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addStep() } }}
                  placeholder="Escribí un paso y presioná +"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                />
                <button
                  type="button"
                  onClick={addStep}
                  className="px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark active:scale-95 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Consejo */}
          <div>
            <label className="text-xs text-gray-500">Consejo (opcional)</label>
            <textarea
              name="tip"
              value={form.tip}
              onChange={handleChange}
              rows={2}
              placeholder="Ej: La llave está bajo la maceta junto a la puerta…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand text-white rounded-xl py-3 font-semibold disabled:opacity-50 hover:bg-brand-dark active:scale-95 transition"
          >
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear unidad'}
          </button>
        </form>
      </div>
    </div>
  )
}
