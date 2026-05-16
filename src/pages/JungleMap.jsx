// src/pages/JungleMap.jsx
// One page per map. Lazy-loads its own JSON so large data files
// don't bloat the initial bundle. Copy this file for each new map,
// swap the import path and map metadata.

import { useState, useEffect } from 'react'
import MapCanvas from '../components/MapCanvas'
import InfoPanel from '../components/InfoPanel'

const MAP_META = {
  id:       'jungle',
  name:     'Jungle',
  areas:    10,
  imageUrl: '/maps/jungle.png',
}

export default function JungleMap({ onBack }) {
  const [mapData,     setMapData]     = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [activeZone,  setActiveZone]  = useState(null)
  const [activeSpot,  setActiveSpot]  = useState(null)

  // Lazy-load the JSON data for this map only
  useEffect(() => {
    import('../data/jungle.json')
      .then(mod => {
        setMapData(mod.default)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function handleSelectHotspot(hotspot) {
    if (activeZone === hotspot.zone) {
      // Clicking the same zone deselects it
      setActiveZone(null)
      setActiveSpot(null)
    } else {
      setActiveZone(hotspot.zone)
      setActiveSpot(hotspot)
    }
  }

  return (
    <div className="mappage">
      {/* ── Top bar ─────────────────────────────────────── */}
      <header className="mappage-header">
        <button className="btn-back" onClick={onBack} aria-label="Back to map select">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Maps
        </button>
        <h2 className="mappage-title">{MAP_META.name}</h2>
        <span className="mappage-badge">{MAP_META.areas} Areas</span>
      </header>

      {/* ── Split layout ─────────────────────────────────── */}
      <div className="mappage-body">

        {/* Left — map + hotspots */}
        <div className="mappage-left">
          {loading ? (
            <div className="mappage-loading">
              <span>Loading map data…</span>
            </div>
          ) : (
            <MapCanvas
              map={MAP_META}
              hotspots={mapData?.hotspots ?? []}
              activeZone={activeZone}
              onSelectHotspot={handleSelectHotspot}
            />
          )}
        </div>

        {/* Right — info panel */}
        <div className="mappage-right">
          <InfoPanel hotspot={activeSpot} />
        </div>

      </div>
    </div>
  )
}
