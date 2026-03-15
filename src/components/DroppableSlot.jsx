import { useDroppable } from '@dnd-kit/core'

/**
 * A droppable slot rendered inside an SVG scene.
 * Renders the outline guide + placed shape when filled.
 * Supports both circle/semicircle slots (cx/cy/r) and rect/polygon slots.
 */
export default function DroppableSlot({ slot, placedPiece, isWrong }) {
  const { setNodeRef, isOver } = useDroppable({ id: slot.id })

  const isFilled = !!placedPiece
  const strokeColor = isWrong
    ? '#ff4444'
    : isOver
    ? '#FF8C00'
    : '#aaaaaa'
  const strokeWidth = isOver || isWrong ? 3 : 2
  const strokeDash = isFilled ? 'none' : '8,5'
  const filter = isOver ? 'drop-shadow(0 0 6px rgba(255,140,0,0.7))' : 'none'

  // Render the placed shape inside the slot bounds
  const renderPlacedShape = () => {
    if (!placedPiece) return null

    const rotation = slot.shapeRotation || 0

    // For circle/semicircle slots: use cx/cy/r
    if (slot.cx !== undefined) {
      const diameter = slot.r * 2
      return (
        <g
          transform={`translate(${slot.cx}, ${slot.cy}) rotate(${rotation})`}
          className="placed-shape"
        >
          <PlacedShapeSVG
            type={placedPiece.type}
            color={placedPiece.color}
            size={diameter}
            centered
          />
        </g>
      )
    }

    // For rect slots: fill the exact slot rectangle
    if (slot.x !== undefined) {
      return (
        <rect
          x={slot.x}
          y={slot.y}
          width={slot.width}
          height={slot.height}
          fill={placedPiece.color}
          className="placed-shape"
        />
      )
    }

    // For polygon slots (triangle, parallelogram, etc.): fill the exact slot shape
    if (slot.points) {
      return (
        <polygon
          points={slot.points}
          fill={placedPiece.color}
          className="placed-shape"
        />
      )
    }

    return null
  }

  // Build the outline shape element
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
      // semicircle: arc path
      const { cx, cy, r } = slot
      if (slot.shapeRotation === 180) {
        // brow: flat at top, arc at bottom
        return (
          <path
            d={`M ${cx - r},${cy} A ${r},${r} 0 0 0 ${cx + r},${cy} Z`}
            {...props}
          />
        )
      }
      // mouth: flat at top, arc at bottom (smile)
      return (
        <path
          d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy} Z`}
          {...props}
        />
      )
    }

    if (slot.x !== undefined) {
      return <rect x={slot.x} y={slot.y} width={slot.width} height={slot.height} {...props} />
    }

    if (slot.points) {
      return <polygon points={slot.points} {...props} />
    }

    return null
  }

  return (
    <g
      ref={setNodeRef}
      className={`drop-slot ${isFilled ? 'filled' : ''} ${isWrong ? 'wrong' : ''}`}
      aria-label={slot.label}
    >
      {renderOutline()}
      {renderPlacedShape()}
    </g>
  )
}

// Helper: renders an SVG shape centered at origin (for placement inside <g transform>)
function PlacedShapeSVG({ type, color, size, width, height, centered }) {
  const w = width ?? size
  const h = height ?? size
  const cx = w / 2
  const cy = h / 2

  let el = null
  switch (type) {
    case 'circle':
      el = <circle cx={0} cy={0} r={Math.min(cx, cy) * 0.88} fill={color} />
      break
    case 'triangle':
      el = (
        <polygon
          points={`0,${-cy * 0.88} ${cx * 0.88},${cy * 0.88} ${-cx * 0.88},${cy * 0.88}`}
          fill={color}
        />
      )
      break
    case 'parallelogram':
      el = (
        <polygon
          points={`${-cx * 0.55},${cy * 0.82} ${cx * 0.82},${cy * 0.82} ${cx * 0.55},${-cy * 0.82} ${-cx * 0.82},${-cy * 0.82}`}
          fill={color}
        />
      )
      break
    case 'semicircle':
      el = (
        <path
          d={`M ${-cx * 0.88},0 A ${cx * 0.88},${cy * 0.88} 0 0 1 ${cx * 0.88},0 Z`}
          fill={color}
        />
      )
      break
    case 'square':
      el = <rect x={-cx * 0.85} y={-cy * 0.85} width={w * 0.85} height={h * 0.85} fill={color} />
      break
    case 'rectangle':
      el = <rect x={-cx * 0.88} y={-cy * 0.65} width={w * 0.88} height={h * 0.65} fill={color} />
      break
    default:
      return null
  }

  return (
    <g className="placed-shape-inner">
      {el}
    </g>
  )
}
