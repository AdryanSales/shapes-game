import { useEffect, useState } from 'react'

const rand = (min, max) => Math.random() * (max - min) + min

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

const PLAYER_COLORS = ['#2196F3', '#E53935']
const PLAYER_LABELS = ['Jogador 1', 'Jogador 2']

export default function CongratsScreen({ scores, completedBy, onBack }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const [s1, s2] = scores
  const isDraw = s1 === s2
  const winner = s1 > s2 ? 0 : 1

  const resultLine = isDraw
    ? 'Empate!'
    : `${PLAYER_LABELS[winner]} ganhou!`

  return (
    <div className={`congrats-screen ${visible ? 'congrats-visible' : ''}`}>
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

      <div className="congrats-card">
        <div className="congrats-trophy">{isDraw ? '🤝' : '🏆'}</div>
        <h1 className="congrats-title">{resultLine}</h1>

        <div className="congrats-drawings">
          <DrawingResult label="Casa" completedByPlayer={completedBy.house} />
          <DrawingResult label="Rosto" completedByPlayer={completedBy.face} />
        </div>

        <div className="congrats-scores">
          <ScoreBadge player={0} score={s1} highlight={!isDraw && winner === 0} />
          <ScoreBadge player={1} score={s2} highlight={!isDraw && winner === 1} />
        </div>

        <button className="congrats-btn" onClick={onBack}>
          Voltar ao início
        </button>
      </div>
    </div>
  )
}

function DrawingResult({ label, completedByPlayer }) {
  const color = completedByPlayer != null ? PLAYER_COLORS[completedByPlayer] : '#aaa'
  const playerLabel = completedByPlayer != null ? PLAYER_LABELS[completedByPlayer] : '—'
  return (
    <div className="drawing-result" style={{ borderColor: color }}>
      <span className="drawing-result-label">{label}</span>
      <span className="drawing-result-player" style={{ color }}>{playerLabel}</span>
    </div>
  )
}

function ScoreBadge({ player, score, highlight }) {
  return (
    <div className={`score-badge score-badge--p${player + 1} ${highlight ? 'score-badge--winner' : ''}`}>
      <span className="score-badge-label">{PLAYER_LABELS[player]}</span>
      <span className="score-badge-value">{score}</span>
    </div>
  )
}
