import { useDraggable } from '@dnd-kit/core'
import ShapeSVG from './ShapeSVG.jsx'

export default function DraggableShape({ piece, size = 64, disabled = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: piece.id,
    disabled,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable-shape ${isDragging ? 'is-dragging' : ''} ${disabled ? 'is-used' : ''}`}
      {...listeners}
      {...attributes}
      title={piece.type}
    >
      <ShapeSVG type={piece.type} color={disabled ? '#ccc' : piece.color} size={size} />
    </div>
  )
}
