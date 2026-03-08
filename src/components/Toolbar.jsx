export default function Toolbar({ autosaveStatus, placementMode, onAddHotspot, onTogglePresentation, presentation }) {
  return (
    <header className="toolbar">
      <button type="button" onClick={onAddHotspot} className={placementMode ? 'active' : ''}>
        {placementMode ? 'Click on scene…' : 'Add Hotspot'}
      </button>
      <button type="button" onClick={onTogglePresentation}>{presentation ? 'Exit Presentation' : 'Presentation Mode'}</button>
      <span className={`autosave ${autosaveStatus}`}>Autosave: {autosaveStatus}</span>
    </header>
  )
}
