import { useState } from 'react'
import JungleMap from './pages/JungleMap'
import './App.css'

const MAPS = [
  { id: 'jungle',   name: 'Jungle',           areas: 10, imageUrl: null },
  { id: 'swamp',    name: 'Swamp',            areas: 10, imageUrl: null },
  { id: 'volcano',  name: 'Volcano',          areas: 11, imageUrl: null },
  { id: 'desert',   name: 'Desert',           areas: 10, imageUrl: null },
  { id: 'forest',   name: 'Forest & Hills',   areas: 9,  imageUrl: null },
  { id: 'tower',    name: 'Tower',            areas: 7,  imageUrl: null },
  { id: 'tundra',   name: 'Snowy Mountains',  areas: 10, imageUrl: null },
  { id: 'castle',   name: 'Castle Schrade',   areas: 10, imageUrl: null },
]

// ─── Welcome Screen ───────────────────────────────────────────────────────────
function WelcomeScreen({ onEnter }) {
  return (
    <div className="screen welcome-screen">
      <div className="welcome-bg">
        <div className="bg-ring ring1" />
        <div className="bg-ring ring2" />
        <div className="bg-ring ring3" />
        <div className="bg-glow" />
      </div>
      <div className="welcome-content">
        <div className="title-block">
          <span className="title-eyebrow">Monster Hunter Freedom Unite</span>
          <h1 className="title-main">
            <span className="title-line1">Interactive</span>
            <span className="title-line2">Maps</span>
          </h1>
          <div className="title-divider">
            <span className="title-divider-icon">⬥ ⬥ ⬥</span>
          </div>
          <p className="title-sub">
            Explore hunting areas, track item locations,
            and plan your quests.
          </p>
        </div>
        <button className="btn-enter" onClick={onEnter}>
          <span>Enter</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Map Select Screen ────────────────────────────────────────────────────────
function MapSelectScreen({ onSelectMap, onBack }) {
  return (
    <div className="screen select-screen">
      <header className="select-header">
        <button className="btn-back" onClick={onBack} aria-label="Back to welcome">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <div className="select-title-block">
          <h2>Select a Map</h2>
          <span className="select-count">{MAPS.length} areas</span>
        </div>
      </header>

      <div className="map-grid">
        {MAPS.map((map) => (
          <button key={map.id} className="map-card" onClick={() => onSelectMap(map)}>
            <div className="map-card-thumb">
              {map.imageUrl
                ? <img src={map.imageUrl} alt={map.name} />
                : <div className="map-card-placeholder">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                      <line x1="9" y1="3" x2="9" y2="18"/>
                      <line x1="15" y1="6" x2="15" y2="21"/>
                    </svg>
                  </div>
              }
            </div>
            <div className="map-card-info">
              <span className="map-card-name">{map.name}</span>
              <span className="map-card-areas">{map.areas} areas</span>
            </div>
            <svg className="map-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Map View Screen ──────────────────────────────────────────────────────────
function MapViewScreen({ map, onBack }) {
  return (
    <div className="screen map-screen">
      <header className="map-header">
        <button className="btn-back" onClick={onBack} aria-label="Back to map select">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Maps
        </button>
        <h2 className="map-title">{map.name}</h2>
        <span className="map-areas-badge">{map.areas} Areas</span>
      </header>

      <div className="map-canvas-wrapper">
        {map.imageUrl
          ? (
            <div className="map-canvas">
              <img src={map.imageUrl} alt={map.name + ' map'} className="map-img" />
            </div>
          )
          : (
            <div className="map-canvas map-canvas--empty">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.25">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/>
                <line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              <p>Add <code>public/maps/{map.id}.png</code> to load this map</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]       = useState('welcome')
  const [activeMap, setActiveMap] = useState(null)

  return (
    <div className="app">
      {screen === 'welcome' && (
        <WelcomeScreen onEnter={() => setScreen('select')} />
      )}
      {screen === 'select' && (
        <MapSelectScreen
          onSelectMap={(map) => { setActiveMap(map); setScreen('map') }}
          onBack={() => setScreen('welcome')}
        />
      )}
      {screen === 'map' && activeMap && (
        activeMap.id === 'jungle' ? (
          <JungleMap onBack={() => setScreen('select')} />
        ) : (
          <MapViewScreen
            map={activeMap}
            onBack={() => setScreen('select')}
          />
        )
      )}
    </div>
  )
}
