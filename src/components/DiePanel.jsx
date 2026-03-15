import DraggableShape from './DraggableShape.jsx'

/**
 * Die-themed panel showing all pieces for the current scene.
 * Each cell looks like a die face.
 * Used pieces are dimmed and non-draggable.
 */
export default function DiePanel({ pieces, usedPieceIds }) {
  return (
    <div className="die-panel">
      <div className="die-panel-label">Dado</div>
      <div className="die-grid">
        {pieces.map((piece) => {
          const isUsed = usedPieceIds.has(piece.id)
          return (
            <div key={piece.id} className={`die-face ${isUsed ? 'die-face--used' : ''}`}>
              {/* Corner dots for die aesthetic */}
              <span className="die-dot die-dot--tl" />
              <span className="die-dot die-dot--tr" />
              <span className="die-dot die-dot--bl" />
              <span className="die-dot die-dot--br" />
              <div className="die-face-shape">
                <DraggableShape piece={piece} size={60} disabled={isUsed} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
