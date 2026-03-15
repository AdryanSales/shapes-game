import DroppableSlot from './DroppableSlot.jsx'
import { SCENES } from '../data/scenes.js'

export default function FaceScene({ placedShapes, wrongSlotId }) {
  const scene = SCENES.face

  const getPlacedPiece = (slotId) => {
    const pieceId = placedShapes[slotId]
    if (!pieceId) return null
    return scene.pieces.find(p => p.id === pieceId) || null
  }

  return (
    <svg
      viewBox="0 0 400 450"
      className="scene-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="400" height="450" fill="#FFF9E6" />

      {/* Head outline (decorative oval) */}
      <ellipse
        cx="200" cy="250"
        rx="160" ry="195"
        fill="#FFE0B2"
        stroke="#FFCA28"
        strokeWidth="4"
      />

      {/* Droppable slots */}
      <DroppableSlot
        slot={scene.slots[0]}
        placedPiece={getPlacedPiece('face-brow-left')}
        isWrong={wrongSlotId === 'face-brow-left'}
      />
      <DroppableSlot
        slot={scene.slots[1]}
        placedPiece={getPlacedPiece('face-brow-right')}
        isWrong={wrongSlotId === 'face-brow-right'}
      />
      <DroppableSlot
        slot={scene.slots[2]}
        placedPiece={getPlacedPiece('face-eye-left')}
        isWrong={wrongSlotId === 'face-eye-left'}
      />
      <DroppableSlot
        slot={scene.slots[3]}
        placedPiece={getPlacedPiece('face-eye-right')}
        isWrong={wrongSlotId === 'face-eye-right'}
      />
      <DroppableSlot
        slot={scene.slots[4]}
        placedPiece={getPlacedPiece('face-nose')}
        isWrong={wrongSlotId === 'face-nose'}
      />
      <DroppableSlot
        slot={scene.slots[5]}
        placedPiece={getPlacedPiece('face-mouth')}
        isWrong={wrongSlotId === 'face-mouth'}
      />

      {/* Hint labels */}
      {scene.slots.map(slot => {
        if (placedShapes[slot.id]) return null
        let lx, ly
        if (slot.cx !== undefined) { lx = slot.cx; ly = slot.cy + 5 }
        else if (slot.points) {
          const pts = slot.points.split(' ').map(p => p.split(',').map(Number))
          lx = pts.reduce((s, p) => s + p[0], 0) / pts.length
          ly = pts.reduce((s, p) => s + p[1], 0) / pts.length + 5
        }
        return (
          <text key={slot.id} x={lx} y={ly} textAnchor="middle" fontSize="9" fill="#999" fontFamily="Nunito, sans-serif">
            {slot.label}
          </text>
        )
      })}
    </svg>
  )
}
