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

function MiniHouse() {
  return (
    <svg viewBox="0 0 120 110" className="scene-preview-svg">
      <rect width="120" height="110" fill="#B3E5FC" rx="6" />
      <rect y="90" width="120" height="20" fill="#81C784" />
      <polygon points="60,8 15,52 105,52" fill="#F5C800" />
      <rect x="15" y="52" width="90" height="50" fill="#1A9BB5" />
      <rect x="22" y="60" width="26" height="26" fill="#B3E5FC" />
      <rect x="72" y="60" width="26" height="26" fill="#B3E5FC" />
    </svg>
  )
}

function MiniFace() {
  return (
    <svg viewBox="0 0 120 130" className="scene-preview-svg">
      <rect width="120" height="130" fill="#FFF9E6" rx="6" />
      <ellipse cx="60" cy="68" rx="48" ry="58" fill="#FFE0B2" stroke="#FFCA28" strokeWidth="2.5" />
      {/* brows */}
      <path d="M 25,42 A 17,17 0 0 0 59,42 Z" fill="#3A3A3A" />
      <path d="M 61,42 A 17,17 0 0 0 95,42 Z" fill="#3A3A3A" />
      {/* eyes */}
      <circle cx="42" cy="65" r="13" fill="#CC2E2E" />
      <circle cx="78" cy="65" r="13" fill="#CC2E2E" />
      {/* nose */}
      <polygon points="60,82 51,100 69,100" fill="#F5C800" />
      {/* mouth */}
      <path d="M 35,112 A 25,25 0 0 0 85,112 Z" fill="#3A3A3A" />
    </svg>
  )
}
