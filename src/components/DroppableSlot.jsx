import { useDroppable } from '@dnd-kit/core'

const PLAYER_COLORS = ['#2196F3', '#E53935'] // J1 = azul, J2 = vermelho

export default function DroppableSlot({ slot, placedPiece, placedByPlayer, isWrong }) {
  const { setNodeRef, isOver } = useDroppable({ id: slot.id })

  const isFilled = !!placedPiece
  const strokeColor = isWrong
    ? '#ff4444'
    : isOver
    ? '#FF8C00'
    : isFilled && placedByPlayer != null
    ? PLAYER_COLORS[placedByPlayer]
    : '#aaaaaa'
  const strokeWidth = isOver || isWrong ? 3 : isFilled ? 3 : 2
  const strokeDash  = isFilled ? 'none' : '8,5'
  const filter      = isOver ? 'drop-shadow(0 0 6px rgba(255,140,0,0.7))' : 'none'

  // Center of the slot, used for the player badge
  const getCenter = () => {
    if (slot.cx !== undefined) {
      return { x: slot.cx, y: slot.cy }
    }
    if (slot.x !== undefined) {
      return { x: slot.x + slot.width / 2, y: slot.y + slot.height / 2 }
    }
    if (slot.points) {
      const pts = slot.points.split(' ').map(p => p.split(',').map(Number))
      return {
        x: pts.reduce((s, p) => s + p[0], 0) / pts.length,
        y: pts.reduce((s, p) => s + p[1], 0) / pts.length,
      }
    }
    return null
  }

  const renderPlacedShape = () => {
    if (!placedPiece) return null

    if (slot.cx !== undefined) {
      const { cx, cy, r } = slot
      if (slot.accepts === 'circle') {
        return <circle cx={cx} cy={cy} r={r} fill={placedPiece.color} className="placed-shape" />
      }
      if (slot.shapeRotation === 180) {
        return <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 0 ${cx + r},${cy} Z`} fill={placedPiece.color} className="placed-shape" />
      }
      return <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy} Z`} fill={placedPiece.color} className="placed-shape" />
    }

    if (slot.x !== undefined) {
      return (
        <rect x={slot.x} y={slot.y} width={slot.width} height={slot.height}
          fill={placedPiece.color} className="placed-shape" />
      )
    }

    if (slot.points) {
      return <polygon points={slot.points} fill={placedPiece.color} className="placed-shape" />
    }

    return null
  }

  const renderOutline = () => {
    const props = {
      fill: isFilled ? 'none' : 'rgba(255,255,255,0.15)',
      stroke: strokeColor,
      strokeWidth,
      strokeDasharray: strokeDash,
      style: { filter },
    }

    if (slot.cx !== undefined && slot.r !== undefined) {
      if (slot.accepts === 'circle') {
        return <circle cx={slot.cx} cy={slot.cy} r={slot.r} {...props} />
      }
      const { cx, cy, r } = slot
      if (slot.shapeRotation === 180) {
        return <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 0 ${cx + r},${cy} Z`} {...props} />
      }
      return <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy} Z`} {...props} />
    }

    if (slot.x !== undefined) {
      return <rect x={slot.x} y={slot.y} width={slot.width} height={slot.height} {...props} />
    }

    if (slot.points) {
      return <polygon points={slot.points} {...props} />
    }

    return null
  }

  const renderPlayerBadge = () => {
    if (!isFilled || placedByPlayer == null) return null
    const center = getCenter()
    if (!center) return null
    const color = PLAYER_COLORS[placedByPlayer]
    return (
      <g>
        <circle cx={center.x} cy={center.y} r={13} fill={color} opacity={0.92} />
        <text
          x={center.x} y={center.y + 5}
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fill="white"
          fontFamily="Nunito, sans-serif"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {placedByPlayer + 1}
        </text>
      </g>
    )
  }

  return (
    <g
      ref={setNodeRef}
      className={`drop-slot ${isFilled ? 'filled' : ''} ${isWrong ? 'wrong' : ''}`}
      aria-label={slot.label}
    >
      {renderOutline()}
      {renderPlacedShape()}
      {renderPlayerBadge()}
    </g>
  )
}
