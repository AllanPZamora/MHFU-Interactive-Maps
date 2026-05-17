// src/components/MapCanvas.jsx

import { useRef, useState } from 'react'

const TYPE_ICONS = {
  mining:    { img: '/mapicons/mining.png',   bg: '#b87333', border: '#7a4a1a', label: 'Mining'    },
  gathering: { img: '/mapicons/herb.png',     bg: '#3a6a3a', border: '#1a3a1a', label: 'Gathering' },
  bug:       { img: '/mapicons/bug.png',      bg: '#6a4a8a', border: '#3a1a5a', label: 'Bug Spot'  },
  fishing:   { img: '/mapicons/fish.png',     bg: '#2a5a8a', border: '#0a2a5a', label: 'Fishing'   },
  bonepile:  { img: '/mapicons/bone.png',     bg: '#7a6a4a', border: '#4a3a1a', label: 'Bone Pile' },
  mushroom:  { img: '/mapicons/mushroom.png', bg: '#5a7a3a', border: '#2a4a1a', label: 'Mushroom'  },
  honey:     { img: '/mapicons/honey.png',    bg: '#9a7a1a', border: '#5a4a0a', label: 'Honey'     },
  stone:     { img: '/mapicons/stone.png',    bg: '#6a6a6a', border: '#3a3a3a', label: 'Stone'     },
  wetstone:  { img: '/mapicons/wetstone.png', bg: '#4a6a7a', border: '#1a3a4a', label: 'Whetstone' },
  bait:      { img: '/mapicons/bait.png',     bg: '#2a5a8a', border: '#0a2a5a', label: 'Bait'      },
  egg:       { img: '/mapicons/egg.png',      bg: '#9a8a5a', border: '#5a4a2a', label: 'Egg'       },
}

const RESOURCE_TYPES = Object.entries(TYPE_ICONS).map(([key, val]) => ({ key, ...val }))

// ── Popup that appears on click to pick a resource type ──────────────────────
function ResourcePicker({ x, y, screenX, screenY, onPick, onCancel }) {
  return (
    <div
      className="dev-picker"
      style={{ left: screenX, top: screenY }}
      onClick={e => e.stopPropagation()}
    >
      <div className="dev-picker-header">
        <span>📍 {x}%, {y}%</span>
        <button className="dev-picker-close" onClick={onCancel}>✕</button>
      </div>
      <div className="dev-picker-label">Select resource type:</div>
      <div className="dev-picker-grid">
        {RESOURCE_TYPES.map(type => (
          <button
            key={type.key}
            className="dev-picker-option"
            style={{ '--opt-bg': type.bg, '--opt-border': type.border }}
            onClick={() => onPick(type.key)}
          >
            <img src={type.img} alt={type.label} />
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Existing hotspot icons ────────────────────────────────────────────────────
function HotspotIcons({ hotspot, isActive, onClick, devMode }) {
  const types = hotspot.resources.map(r => r.type)
  return (
    <>
      {types.map((type, idx) => {
        const meta = TYPE_ICONS[type] || { img: '/mapicons/stone.png', bg: '#888', border: '#555' }
        const offsetX = types.length > 1 ? (idx - (types.length - 1) / 2) * 22 : 0
        return (
          <button
            key={type}
            className={`map-hotspot ${isActive ? 'map-hotspot--active' : ''} ${devMode ? 'map-hotspot--dev-live' : ''}`}
            style={{
              left:      `${hotspot.x}%`,
              top:       `${hotspot.y}%`,
              transform: `translate(calc(-50% + ${offsetX}px), -50%)`,
              '--hs-bg':     meta.bg,
              '--hs-border': meta.border,
            }}
            onClick={() => onClick(hotspot)}
            aria-label={`Zone ${hotspot.zone} — ${type}`}
            title={`Zone ${hotspot.zone}`}
          >
            <span className="map-hotspot-icon"><img src={meta.img} alt={type} /></span>
            <span className="map-hotspot-zone">{hotspot.zone}</span>
          </button>
        )
      })}
    </>
  )
}

// ── Main MapCanvas ────────────────────────────────────────────────────────────
export default function MapCanvas({ map, hotspots, activeZone, onSelectHotspot, devMode }) {
  const innerRef  = useRef(null)
  const [pins,    setPins]    = useState([])
  const [pending, setPending] = useState(null)  // { x, y, screenX, screenY }
  const [copied,  setCopied]  = useState(false)

  function handleMapClick(e) {
    if (!devMode) return
    if (e.target.closest('.map-hotspot') || e.target.closest('.dev-pin') || e.target.closest('.dev-picker')) return

    const rect = innerRef.current.getBoundingClientRect()
    const x  = parseFloat(((e.clientX - rect.left) / rect.width  * 100).toFixed(1))
    const y  = parseFloat(((e.clientY - rect.top)  / rect.height * 100).toFixed(1))

    // Position the picker near the click but keep it inside the canvas
    const pickerW = 220, pickerH = 200
    let screenX = e.clientX - rect.left + 12
    let screenY = e.clientY - rect.top  + 12
    if (screenX + pickerW > rect.width)  screenX = (e.clientX - rect.left) - pickerW - 12
    if (screenY + pickerH > rect.height) screenY = (e.clientY - rect.top)  - pickerH - 12

    setPending({ x, y, screenX, screenY })
  }

  function handlePick(type) {
    if (!pending) return
    setPins(prev => [...prev, { id: Date.now(), x: pending.x, y: pending.y, type }])
    setPending(null)
  }

  function removePin(id) {
    setPins(prev => prev.filter(p => p.id !== id))
  }

  function copyAll() {
    const text = pins
      .map((p, i) =>
        `{ "zone": ${i + 1}, "x": ${p.x}, "y": ${p.y}, "resources": [\n` +
        `    { "type": "${p.type}", "label": "${TYPE_ICONS[p.type]?.label ?? p.type}", "items": [] }\n  ] }`
      )
      .join(',\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function clearAll() { setPins([]) }

  return (
    <div className="map-canvas-wrap">

      {/* ── Dev toolbar ── */}
      {devMode && (
        <div className="dev-toolbar">
          <span className="dev-toolbar-label">📍 DEV MODE — click the map to place pins</span>
          <div className="dev-toolbar-actions">
            <span className="dev-pin-count">{pins.length} pin{pins.length !== 1 ? 's' : ''}</span>
            <button className="dev-btn" onClick={copyAll} disabled={pins.length === 0}>
              {copied ? '✓ Copied!' : 'Copy JSON'}
            </button>
            <button className="dev-btn dev-btn--danger" onClick={clearAll} disabled={pins.length === 0}>
              Clear
            </button>
          </div>
        </div>
      )}

      {map.imageUrl ? (
        <div
          className={`map-canvas-inner ${devMode ? 'map-canvas-inner--dev' : ''}`}
          ref={innerRef}
          onClick={handleMapClick}
        >
          <div className="map-canvas-back" />
          <div className="map-canvas-map" style={{ backgroundImage: `url(${map.imageUrl})` }} />
          <img src={map.imageUrl} alt={map.name} className="map-canvas-img" draggable={false} />

          {/* Existing hotspots */}
          {hotspots.map(hs => (
            <HotspotIcons
              key={hs.zone}
              hotspot={hs}
              isActive={activeZone === hs.zone}
              onClick={onSelectHotspot}
              devMode={devMode}
            />
          ))}

          {/* Placed pins */}
          {devMode && pins.map((pin, idx) => {
            const meta = TYPE_ICONS[pin.type] || { img: '/mapicons/stone.png', bg: '#888', label: pin.type }
            return (
              <button
                key={pin.id}
                className="dev-pin"
                style={{ left: `${pin.x}%`, top: `${pin.y}%`, '--pin-bg': meta.bg }}
                onClick={e => { e.stopPropagation(); removePin(pin.id) }}
                title={`Pin ${idx + 1} — ${meta.label} (click to remove)`}
              >
                <span className="dev-pin-number">{idx + 1}</span>
                <img className="dev-pin-type-img" src={meta.img} alt={meta.label} />
                <span className="dev-pin-coords">{pin.x}, {pin.y}</span>
              </button>
            )
          })}

          {/* Resource picker popup */}
          {devMode && pending && (
            <ResourcePicker
              x={pending.x}
              y={pending.y}
              screenX={pending.screenX}
              screenY={pending.screenY}
              onPick={handlePick}
              onCancel={() => setPending(null)}
            />
          )}
        </div>
      ) : (
        <div className="map-canvas-empty">
          <p>Add <code>public/maps/{map.id}.png</code> to display this map</p>
        </div>
      )}

      {/* Pin list */}
      {devMode && pins.length > 0 && (
        <div className="dev-pin-list">
          <div className="dev-pin-list-title">Placed Pins</div>
          {pins.map((pin, idx) => {
            const meta = TYPE_ICONS[pin.type] || { label: pin.type, img: '/mapicons/stone.png' }
            return (
              <div key={pin.id} className="dev-pin-row">
                <span className="dev-pin-row-num">#{idx + 1}</span>
                <img className="dev-pin-row-img" src={meta.img} alt={meta.label} />
                <span className="dev-pin-row-type">{meta.label}</span>
                <code>{pin.x}, {pin.y}</code>
                <button className="dev-pin-remove" onClick={() => removePin(pin.id)}>✕</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
