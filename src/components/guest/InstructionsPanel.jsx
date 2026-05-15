import { useEffect, useRef } from 'react'

export default function InstructionsPanel({ unit }) {
  const panelRef = useRef(null)

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [unit.id])

  const steps = Array.isArray(unit.steps) ? unit.steps : []

  return (
    <div ref={panelRef} className="bg-white rounded-2xl shadow-sm overflow-hidden">

      {/* Cabecera */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: '#025479' }}
        >
          {unit.label}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">
            Unidad {unit.label}
            {unit.floor ? ` — ${unit.floor}` : ''}
          </p>
          {unit.block && (
            <p className="text-xs text-gray-400 mt-0.5">{unit.block}</p>
          )}
        </div>
      </div>

      {/* Pasos */}
      {steps.length > 0 && (
        <div className="px-4 py-4 space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold mt-0.5"
                style={{ backgroundColor: '#025479' }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-gray-700 leading-snug">{step}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      {unit.tip && (
        <div className="mx-4 mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <span className="text-amber-500 text-base mt-0.5">💡</span>
          <p className="text-sm text-amber-800 leading-snug">{unit.tip}</p>
        </div>
      )}

      {steps.length === 0 && !unit.tip && (
        <p className="px-4 py-4 text-sm text-gray-400">Sin instrucciones disponibles.</p>
      )}

    </div>
  )
}
