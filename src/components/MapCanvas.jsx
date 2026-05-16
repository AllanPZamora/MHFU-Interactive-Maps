// src/components/MapCanvas.jsx
// Renders the map image and overlays clickable resource-type icons at each hotspot.
// Hotspot x/y are stored as percentages of the image dimensions for responsiveness.

const TYPE_ICONS = {
  mining:    { icon: '⛏', bg: '#b87333', border: '#7a4a1a' },
  gathering: { icon: '🌿', bg: '#3a6a3a', border: '#1a3a1a' },
  bug:       { icon: '🦋', bg: '#6a4a8a', border: '#3a1a5a' },
  fishing:   { icon: '🎣', bg: '#2a5a8a', border: '#0a2a5a' },
  bonepile:  { icon: '🦴', bg: '#7a6a4a', border: '#4a3a1a' },
}

// A hotspot may have multiple resource types — render one icon per type
function HotspotIcons({ hotspot, isActive, onClick }) {
  const types = hotspot.resources.map(r => r.type)
  // Offset multiple icons slightly so they don't fully overlap
  return (
    <>
      {types.map((type, idx) => {
        const meta = TYPE_ICONS[type] || { icon: '📦', bg: '#888', border: '#555' }
        const offsetX = types.length > 1 ? (idx - (types.length - 1) / 2) * 22 : 0
        return (
          <button
            key={type}
            className={`map-hotspot ${isActive ? 'map-hotspot--active' : ''}`}
            style={{
              left:  `${hotspot.x}%`,
              top:   `${hotspot.y}%`,
              transform: `translate(calc(-50% + ${offsetX}px), -50%)`,
              '--hs-bg':     meta.bg,
              '--hs-border': meta.border,
            }}
            onClick={() => onClick(hotspot)}
            aria-label={`Zone ${hotspot.zone} — ${type}`}
            title={`Zone ${hotspot.zone}`}
          >
            <span className="map-hotspot-icon">{meta.icon}</span>
            <span className="map-hotspot-zone">{hotspot.zone}</span>
          </button>
        )
      })}
    </>
  )
}

export default function MapCanvas({ map, hotspots, activeZone, onSelectHotspot }) {
  return (
    <div className="map-canvas-wrap">
      {map.imageUrl ? (
        <div className="map-canvas-inner">
          <img
            src={map.imageUrl}
            alt={map.name}
            className="map-canvas-img"
            draggable={false}
          />
          {hotspots.map(hs => (
            <HotspotIcons
              key={hs.zone}
              hotspot={hs}
              isActive={activeZone === hs.zone}
              onClick={onSelectHotspot}
            />
          ))}
        </div>
      ) : (
        <div className="map-canvas-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/>
            <line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
          <p>Add <code>public/maps/{map.id}.png</code><br/>to display this map</p>

          {/* Dev preview: show hotspot positions even without image */}
          <div className="map-canvas-devgrid">
            {hotspots.map(hs => (
              <button
                key={hs.zone}
                className={`map-hotspot map-hotspot--dev ${activeZone === hs.zone ? 'map-hotspot--active' : ''}`}
                style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                onClick={() => onSelectHotspot(hs)}
                title={`Zone ${hs.zone}`}
              >
                <span className="map-hotspot-icon">
                  {TYPE_ICONS[hs.resources[0]?.type]?.icon || '📦'}
                </span>
                <span className="map-hotspot-zone">{hs.zone}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
