import DroppableSlot from './DroppableSlot.jsx'
import { SCENES } from '../data/scenes.js'

const ALL_PIECES = [...SCENES.house.pieces, ...SCENES.face.pieces]

export default function HouseScene({ placedShapes, placedBy, wrongSlotId }) {
  const scene = SCENES.house

  const getPlacedPiece = (slotId) => {
    const pieceId = placedShapes[slotId]
    if (!pieceId) return null
    return ALL_PIECES.find(p => p.id === pieceId) || null
  }

  return (
    <svg viewBox="0 0 400 285" className="scene-svg" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="285" fill="#ffffff" />

      {scene.slots.map(slot => (
        <DroppableSlot
          key={slot.id}
          slot={slot}
          placedPiece={getPlacedPiece(slot.id)}
          placedByPlayer={placedBy[slot.id] ?? null}
          isWrong={wrongSlotId === slot.id}
        />
      ))}

      {scene.slots.map(slot => {
        if (placedShapes[slot.id]) return null
        let lx, ly
        if (slot.x !== undefined) { lx = slot.x + slot.width / 2; ly = slot.y + slot.height / 2 + 5 }
        else if (slot.points) {
          const pts = slot.points.split(' ').map(p => p.split(',').map(Number))
          lx = pts.reduce((s, p) => s + p[0], 0) / pts.length
          ly = pts.reduce((s, p) => s + p[1], 0) / pts.length + 5
        }
        return (
          <text key={`label-${slot.id}`} x={lx} y={ly} textAnchor="middle" fontSize="10" fill="#777" fontFamily="Nunito, sans-serif">
            {slot.label}
          </text>
        )
      })}
    </svg>
  )
}
