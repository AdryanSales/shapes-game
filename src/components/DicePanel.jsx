import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import ShapeSVG from './ShapeSVG.jsx'

const DICE_FACES  = ['circle', 'triangle', 'parallelogram', 'semicircle', 'square', 'rectangle']
const FACE_SIDES  = ['front',  'back',     'right',         'left',       'top',    'bottom']

const FACE_ROTATIONS = [
  { x:   0, y:   0 },
  { x:   0, y: 180 },
  { x:   0, y: -90 },
  { x:   0, y:  90 },
  { x: -90, y:   0 },
  { x:  90, y:   0 },
]

const FACE_COLORS = {
  circle:        '#CC2E2E',
  triangle:      '#F5C800',
  parallelogram: '#7B3A1A',
  semicircle:    '#3A3A3A',
  square:        '#2EB84B',
  rectangle:     '#1A9BB5',
}

function calcNextRotation(current, faceIndex) {
  const target = FACE_ROTATIONS[faceIndex]
  const normX  = ((current.x % 360) + 360) % 360
  const normY  = ((current.y % 360) + 360) % 360
  const tNormX = ((target.x  % 360) + 360) % 360
  const tNormY = ((target.y  % 360) + 360) % 360
  const diffX  = ((tNormX - normX) + 360) % 360
  const diffY  = ((tNormY - normY) + 360) % 360
  return { x: current.x + diffX + 720, y: current.y + diffY + 720 }
}

// Tray with drag applied directly so the whole area is the hit target
function DraggableTray({ piece }) {
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
    id: piece.id,
  })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`dice-tray dice-tray--active ${isDragging ? 'dice-tray--dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <ShapeSVG type={piece.type} color={piece.color} size={84} />
    </div>
  )
}

export default function DicePanel({ currentDicePiece, onRoll, gameCanRoll, turnMessage }) {
  const [rotation,  setRotation]  = useState({ x: -20, y: 30 })
  const [isRolling, setIsRolling] = useState(false)

  function handleRoll() {
    if (isRolling || !gameCanRoll) return
    const faceIndex = Math.floor(Math.random() * 6)
    setRotation(prev => calcNextRotation(prev, faceIndex))
    setIsRolling(true)
    setTimeout(() => {
      setIsRolling(false)
      onRoll(DICE_FACES[faceIndex])
    }, 950)
  }

  const canRoll = !isRolling && gameCanRoll

  const hintText = turnMessage
    ? turnMessage
    : currentDicePiece
    ? 'Arraste a forma!'
    : isRolling
    ? 'Rolando...'
    : gameCanRoll
    ? 'Clique no dado'
    : 'Aguarde...'

  return (
    <div className="dice-panel">
      {currentDicePiece && <DraggableTray piece={currentDicePiece} />}

      <div
        className={`dice-scene ${canRoll ? 'dice-scene--clickable' : ''}`}
        onClick={handleRoll}
        title="Clique para rolar!"
      >
        <div
          className="dice-cube"
          style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
          {DICE_FACES.map((shape, i) => (
            <div key={shape} className={`dice-face3d dice-face3d--${FACE_SIDES[i]}`}>
              <ShapeSVG type={shape} color={FACE_COLORS[shape]} size={54} />
            </div>
          ))}
        </div>
      </div>

      <p className={`dice-hint ${turnMessage ? 'dice-hint--alert' : ''}`}>
        {hintText}
      </p>
    </div>
  )
}
