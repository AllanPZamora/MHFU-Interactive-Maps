// src/pages/OldDesertMap.jsx
import { useState, useEffect } from 'react'
import MapCanvas from '../components/MapCanvas'
import InfoPanel from '../components/InfoPanel'

const MAP_META = {
  id:       'old_desert',
  name:     'Old Desert',
  areas:    7,
  imageUrl: '/maps/old_desert.png',
}

export default function OldDesertMap({ onBack }) {
  const [mapData,    setMapData]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [activeZone, setActiveZone] = useState(null)
  const [activeSpot, setActiveSpot] = useState(null)
  const [devMode,    setDevMode]    = useState(false)

  useEffect(() => {
    import('../data/old_desert.json')
      .then(mod => { setMapData(mod.default); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function handleSelectHotspot(hotspot) {
    if (activeZone === hotspot.zone) {
      setActiveZone(null); setActiveSpot(null)
    } else {
      setActiveZone(hotspot.zone); setActiveSpot(hotspot)
    }
  }

  return (
    <div className="mappage">
      <header className="mappage-header">
        <button className="btn-back" onClick={onBack} aria-label="Back to map select">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Maps
        </button>
        <h2 className="mappage-title">{MAP_META.name}</h2>
        <span className="mappage-badge">{MAP_META.areas} Areas</span>
        <button
          className={`dev-toggle ${devMode ? 'dev-toggle--on' : ''}`}
          onClick={() => setDevMode(d => !d)}
          title="Toggle pin placement mode"
        >
          {devMode ? '🔴 Dev ON' : '🛠 Dev'}
        </button>
      </header>

      <div className="mappage-body">
        <div className="mappage-left">
          {loading ? (
            <div className="mappage-loading"><span>Loading map data…</span></div>
          ) : (
            <MapCanvas
              map={MAP_META}
              hotspots={mapData?.hotspots ?? []}
              activeZone={activeZone}
              onSelectHotspot={handleSelectHotspot}
              devMode={devMode}
            />
          )}
        </div>
        <div className="mappage-right">
          <InfoPanel hotspot={activeSpot} />
        </div>
      </div>
    </div>
  )
}
