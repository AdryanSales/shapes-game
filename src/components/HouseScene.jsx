import DroppableSlot from './DroppableSlot.jsx'
import { SCENES } from '../data/scenes.js'

export default function HouseScene({ placedShapes, usedPieceIds, wrongSlotId, currentScene }) {
  const scene = SCENES.house

  const getPlacedPiece = (slotId) => {
    const pieceId = placedShapes[slotId]
    if (!pieceId) return null
    return scene.pieces.find(p => p.id === pieceId) || null
  }

  return (
    <svg
      viewBox="0 0 400 285"
      className="scene-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* White background */}
      <rect width="400" height="285" fill="#ffffff" />

      {/* Droppable slots */}
      <DroppableSlot
        slot={scene.slots[0]}
        placedPiece={getPlacedPiece('house-roof-left')}
        isWrong={wrongSlotId === 'house-roof-left'}
      />
      <DroppableSlot
        slot={scene.slots[1]}
        placedPiece={getPlacedPiece('house-roof-right')}
        isWrong={wrongSlotId === 'house-roof-right'}
      />
      <DroppableSlot
        slot={scene.slots[2]}
        placedPiece={getPlacedPiece('house-body-left')}
        isWrong={wrongSlotId === 'house-body-left'}
      />
      <DroppableSlot
        slot={scene.slots[3]}
        placedPiece={getPlacedPiece('house-body-right')}
        isWrong={wrongSlotId === 'house-body-right'}
      />

      {/* Labels */}
      {scene.slots.map(slot => {
        if (placedShapes[slot.id]) return null
        let lx, ly
        if (slot.cx !== undefined) { lx = slot.cx; ly = slot.cy + 5 }
        else if (slot.x !== undefined) { lx = slot.x + slot.width / 2; ly = slot.y + slot.height / 2 + 5 }
        else if (slot.points) {
          const pts = slot.points.split(' ').map(p => p.split(',').map(Number))
          lx = pts.reduce((s, p) => s + p[0], 0) / pts.length
          ly = pts.reduce((s, p) => s + p[1], 0) / pts.length + 5
        }
        return (
          <text key={slot.id} x={lx} y={ly} textAnchor="middle" fontSize="10" fill="#777" fontFamily="Nunito, sans-serif">
            {slot.label}
          </text>
        )
      })}
    </svg>
  )
}
