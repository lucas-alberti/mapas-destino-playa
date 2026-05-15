import { useState } from 'react'
import PropertyList from '../components/admin/PropertyList'
import PropertyForm from '../components/admin/PropertyForm'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [view, setView] = useState('list') // 'list' | 'create' | 'edit'
  const [editingProperty, setEditingProperty] = useState(null)

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError('')
    } else {
      setError('Contraseña incorrecta.')
    }
  }

  function openEdit(property) {
    setEditingProperty(property)
    setView('edit')
  }

  function openCreate() {
    setEditingProperty(null)
    setView('create')
  }

  function handleSaved() {
    setView('list')
    setEditingProperty(null)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-brand flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-xs shadow-2xl">
          <div className="text-center mb-6">
            <p className="text-3xl mb-2">🗺️</p>
            <h1 className="text-xl font-bold text-brand">Panel Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Destino Playa</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              autoFocus
              onChange={e => setPassword(e.target.value)}
              className="
                w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-brand/40
              "
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-brand text-white rounded-xl py-3 font-semibold hover:bg-brand-dark transition active:scale-95"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (view === 'create' || view === 'edit') {
    return (
      <PropertyForm
        property={editingProperty}
        onBack={() => setView('list')}
        onSave={handleSaved}
      />
    )
  }

  return (
    <PropertyList
      onEdit={openEdit}
      onCreate={openCreate}
    />
  )
}
