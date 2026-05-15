import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function PhotoUpload({ currentUrl, propertySlug, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no debe superar 10 MB.')
      return
    }

    setUploading(true)
    setError('')

    const ext = file.name.split('.').pop().toLowerCase()
    const safeName = `${propertySlug || 'prop'}-${Date.now()}.${ext}`

    const { error: upErr } = await supabase.storage
      .from('property-photos')
      .upload(safeName, file, { upsert: true, contentType: file.type })

    if (upErr) {
      setError(upErr.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('property-photos').getPublicUrl(safeName)
    onUploaded(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
      <h2 className="font-medium text-gray-900 text-sm">Foto del mapa</h2>

      {currentUrl && (
        <div className="relative">
          <img
            src={currentUrl}
            alt="Foto actual"
            className="w-full rounded-xl object-cover max-h-52"
          />
          <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            actual
          </span>
        </div>
      )}

      <label className={`
        flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition
        ${uploading ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-brand/30 hover:border-brand hover:bg-brand/5'}
      `}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="sr-only"
        />
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Subiendo…</span>
          </>
        ) : (
          <>
            <span className="text-lg">📷</span>
            <span className="text-sm text-brand font-medium">
              {currentUrl ? 'Cambiar foto' : 'Subir foto'}
            </span>
          </>
        )}
      </label>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
