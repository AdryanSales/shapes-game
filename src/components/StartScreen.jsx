export default function StartScreen({ onSelect }) {
  return (
    <div className="start-screen">
      <div className="start-header">
        <h1 className="start-title">Jogo das Formas</h1>
      </div>

      <h2 className="start-choose">Escolha uma fase:</h2>

      <div className="scene-cards">
        <button className="scene-card scene-card--house" onClick={() => onSelect('house')}>
          <span className="scene-card-label">Casa</span>
          <MiniHouse />
        </button>
        <button className="scene-card scene-card--face" onClick={() => onSelect('face')}>
          <span className="scene-card-label">Rosto</span>
          <MiniFace />
        </button>
      </div>
    </div>
  )
}

// Same viewBox as HouseScene (400x285), colors match SHAPE_COLORS
function MiniHouse() {
  return (
    <svg viewBox="0 0 400 285" className="scene-preview-svg">
      <rect width="400" height="285" fill="#ffffff" rx="6" />
      {/* Roof left: parallelogram */}
      <polygon points="20,155 260,155 320,15 80,15" fill="#7B3A1A" />
      {/* Roof right: triangle */}
      <polygon points="320,15 260,155 380,155" fill="#F5C800" />
      {/* Body left: rectangle */}
      <rect x="20" y="155" width="240" height="120" fill="#1A9BB5" />
      {/* Body right: square */}
      <rect x="260" y="155" width="120" height="120" fill="#2EB84B" />
    </svg>
  )
}

// Same viewBox as FaceScene (400x430), colors match SHAPE_COLORS
// Semicircle directions match DroppableSlot rendering:
//   shapeRotation !== 180 → sweep=1 → arc up (∩)
//   shapeRotation === 180 → sweep=0 → arc down (∪)
function MiniFace() {
  return (
    <svg viewBox="0 0 400 430" className="scene-preview-svg">
      <rect width="400" height="430" fill="#ffffff" rx="6" />
      {/* Brow left: semicircle arc up (cx=120, cy=80, r=55) */}
      <path d="M 65,80 A 55,55 0 0 1 175,80 Z" fill="#3A3A3A" />
      {/* Brow right: semicircle arc up (cx=280, cy=80, r=55) */}
      <path d="M 225,80 A 55,55 0 0 1 335,80 Z" fill="#3A3A3A" />
      {/* Eye left: circle (cx=120, cy=160, r=55) */}
      <circle cx="120" cy="160" r="55" fill="#CC2E2E" />
      {/* Eye right: circle (cx=280, cy=160, r=55) */}
      <circle cx="280" cy="160" r="55" fill="#CC2E2E" />
      {/* Nose: triangle */}
      <polygon points="200,210 130,310 270,310" fill="#F5C800" />
      {/* Mouth: semicircle arc down (cx=200, cy=350, r=52) */}
      <path d="M 148,350 A 52,52 0 0 0 252,350 Z" fill="#3A3A3A" />
    </svg>
  )
}
