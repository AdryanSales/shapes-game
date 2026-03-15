import { useEffect, useState } from 'react'
import { SCENES } from '../data/scenes.js'

// Generates a random number in [min, max]
const rand = (min, max) => Math.random() * (max - min) + min

// Pre-generate confetti pieces (stable, created once)
const CONFETTI_PIECES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: rand(0, 100),
  size: rand(8, 18),
  color: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF922B', '#CC5DE8', '#FA5252', '#74C0FC'][i % 8],
  delay: rand(0, 1.5),
  duration: rand(2.2, 3.8),
  rotation: rand(0, 360),
  drift: rand(-40, 40),
}))

export default function CongratsScreen({ activeScene, onBack }) {
  const [visible, setVisible] = useState(false)
  const scene = SCENES[activeScene]

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`congrats-screen ${visible ? 'congrats-visible' : ''}`}>
      {/* Confetti */}
      <div className="confetti-container" aria-hidden="true">
        {CONFETTI_PIECES.map(p => (
          <div
            key={p.id}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--drift': `${p.drift}px`,
              borderRadius: p.id % 3 === 0 ? '50%' : p.id % 3 === 1 ? '2px' : '0',
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="congrats-card">
        <div className="congrats-trophy">🏆</div>
        <h1 className="congrats-title">Parabéns!</h1>
        <p className="congrats-subtitle">
          Você completou o{' '}
          <strong>{scene?.label}</strong>
          !
        </p>
        <div className="congrats-stars">⭐⭐⭐</div>
        <button className="congrats-btn" onClick={onBack}>
          🔄 Voltar ao início
        </button>
      </div>
    </div>
  )
}
