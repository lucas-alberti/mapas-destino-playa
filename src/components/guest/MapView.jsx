import { extractYouTubeId } from '../admin/UnitEditor'

export default function MapView({ property, selectedUnit }) {
  const videoId = selectedUnit?.video_url ? extractYouTubeId(selectedUnit.video_url) : null

  // Unit selected WITH video → embed YouTube, hide photo
  if (videoId) {
    return (
      <div className="w-full shadow-md" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            key={videoId}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title="Video de llegada"
          />
        </div>
      </div>
    )
  }

  // No photo at all
  if (!property.photo_url) {
    return (
      <div
        className="w-full rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm"
        style={{ minHeight: 180 }}
      >
        Sin foto de propiedad
      </div>
    )
  }

  // Default: photo with optional callout
  return (
    <div className="relative w-full shadow-md" style={{ borderRadius: 16 }}>
      <img
        src={property.photo_url}
        alt={property.name}
        className="w-full object-cover block"
        style={{ borderRadius: 16 }}
        draggable={false}
      />

      {selectedUnit && selectedUnit.pos_x != null && selectedUnit.pos_y != null && (
        <UnitCallout unit={selectedUnit} />
      )}
    </div>
  )
}

function UnitCallout({ unit }) {
  // When the unit is near the top (pos_y < 40), show callout BELOW the dot
  const below = unit.pos_y < 40

  const dot = (
    <div style={{ position: 'relative', width: 14, height: 14 }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        backgroundColor: '#f97316',
        animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite',
        opacity: 0.6,
      }} />
      <div style={{
        position: 'relative',
        width: 14,
        height: 14,
        borderRadius: '50%',
        backgroundColor: '#f97316',
        border: '2px solid white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
      }} />
    </div>
  )

  const arrow = below
    ? /* ▲ pointing up (toward the dot above) */
      <div style={{
        width: 0,
        height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderBottom: '6px solid #025479',
        marginBottom: -1,
      }} />
    : /* ▼ pointing down (toward the dot below) */
      <div style={{
        width: 0,
        height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '6px solid #025479',
        marginTop: -1,
      }} />

  const label = (
    <div
      style={{
        backgroundColor: '#025479',
        color: '#fff',
        borderRadius: 8,
        padding: '5px 10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap',
        animation: 'labelIn 0.2s ease-out',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>{unit.floor}</div>
      <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.8, lineHeight: 1.3 }}>{unit.block}</div>
    </div>
  )

  return (
    <div
      style={{
        position: 'absolute',
        left: `clamp(60px, ${unit.pos_x}%, calc(100% - 60px))`,
        top: `${unit.pos_y}%`,
        transform: below ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
        gap: below ? 2 : 0,
      }}
    >
      {below ? (
        <>
          {dot}
          {arrow}
          {label}
        </>
      ) : (
        <>
          {label}
          {arrow}
          <div style={{ marginTop: 2 }}>{dot}</div>
        </>
      )}
    </div>
  )
}
