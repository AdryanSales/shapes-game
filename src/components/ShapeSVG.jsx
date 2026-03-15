/**
 * Universal SVG shape renderer.
 * Renders the correct geometric primitive for a given type.
 * Used in: DiePanel faces, DragOverlay, DroppableSlot (placed state).
 */
export default function ShapeSVG({ type, color, size = 60, rotation = 0 }) {
  const w = size
  const h = size
  const cx = w / 2
  const cy = h / 2

  let shapeEl = null

  switch (type) {
    case 'circle':
      shapeEl = <circle cx={cx} cy={cy} r={cx * 0.82} fill={color} />
      break

    case 'triangle':
      shapeEl = (
        <polygon
          points={`${cx},${h * 0.1} ${w * 0.95},${h * 0.92} ${w * 0.05},${h * 0.92}`}
          fill={color}
        />
      )
      break

    case 'parallelogram':
      shapeEl = (
        <polygon
          points={`${w * 0.08},${h * 0.88} ${w * 0.78},${h * 0.88} ${w * 0.92},${h * 0.12} ${w * 0.22},${h * 0.12}`}
          fill={color}
        />
      )
      break

    case 'semicircle':
      // Default: flat side at bottom, arc at top (like a D rotated)
      shapeEl = (
        <path
          d={`M ${w * 0.05},${cy} A ${cx * 0.9},${cy * 0.9} 0 0 1 ${w * 0.95},${cy} Z`}
          fill={color}
        />
      )
      break

    case 'square':
      shapeEl = (
        <rect x={w * 0.1} y={h * 0.1} width={w * 0.8} height={h * 0.8} fill={color} />
      )
      break

    case 'rectangle':
      shapeEl = (
        <rect x={w * 0.05} y={h * 0.2} width={w * 0.9} height={h * 0.6} fill={color} />
      )
      break

    default:
      return null
  }

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ transform: `rotate(${rotation}deg)`, display: 'block' }}
      aria-label={type}
    >
      {shapeEl}
    </svg>
  )
}
