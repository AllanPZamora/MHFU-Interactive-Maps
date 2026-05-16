// src/components/InfoPanel.jsx
// Right-side panel: shows resource nodes and item drop rates for a selected hotspot.
// Lazy-loads JSON data per map so large datasets don't block the initial render.

const TYPE_META = {
  mining:    { label: 'Mining',    icon: '⛏', color: '#b87333' },
  gathering: { label: 'Gathering', icon: '🌿', color: '#4a7a4a' },
  bug:       { label: 'Bug Spot',  icon: '🦋', color: '#7a5a9a' },
  fishing:   { label: 'Fishing',   icon: '🎣', color: '#3a6a9a' },
  bonepile:  { label: 'Bone Pile', icon: '🦴', color: '#9a8a6a' },
}

function RateBar({ rate }) {
  return (
    <div className="ip-rate-bar-wrap">
      <div
        className="ip-rate-bar"
        style={{ width: `${rate}%` }}
        data-high={rate >= 60}
      />
      <span className="ip-rate-label">{rate}%</span>
    </div>
  )
}

function ResourceNode({ resource }) {
  const meta = TYPE_META[resource.type] || { label: resource.type, icon: '📦', color: '#888' }
  return (
    <div className="ip-resource">
      <div className="ip-resource-header" style={{ '--node-color': meta.color }}>
        <span className="ip-resource-icon">{meta.icon}</span>
        <span className="ip-resource-label">{resource.label || meta.label}</span>
      </div>
      <ul className="ip-item-list">
        {resource.items.map((item, i) => (
          <li key={i} className="ip-item">
            <span className="ip-item-name">{item.name}</span>
            <RateBar rate={item.rate} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function InfoPanel({ hotspot }) {
  if (!hotspot) {
    return (
      <div className="info-panel info-panel--empty">
        <div className="ip-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p className="ip-empty-text">Select a resource icon<br/>on the map to view items</p>
      </div>
    )
  }

  return (
    <div className="info-panel">
      <div className="ip-header">
        <span className="ip-zone-badge">Zone {hotspot.zone}</span>
        <span className="ip-resource-count">
          {hotspot.resources.length} resource{hotspot.resources.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="ip-body">
        {hotspot.resources.map((res, i) => (
          <ResourceNode key={i} resource={res} />
        ))}
      </div>
    </div>
  )
}
