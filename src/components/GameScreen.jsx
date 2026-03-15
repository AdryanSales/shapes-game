import { DndContext, DragOverlay, MouseSensor, TouchSensor, useDndMonitor, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'
// Centers the 72px overlay on the cursor regardless of the dragged element's size
const OVERLAY_HALF = 36 // half of size={72} ShapeSVG
function snapOverlayToCursor({ activatorEvent, draggingNodeRect, transform }) {
  if (!activatorEvent || !draggingNodeRect) return transform
  const cx = 'clientX' in activatorEvent
    ? activatorEvent.clientX
    : activatorEvent.touches?.[0]?.clientX ?? 0
  const cy = 'clientY' in activatorEvent
    ? activatorEvent.clientY
    : activatorEvent.touches?.[0]?.clientY ?? 0
  return {
    ...transform,
    x: transform.x + cx - draggingNodeRect.left - OVERLAY_HALF,
    y: transform.y + cy - draggingNodeRect.top  - OVERLAY_HALF,
  }
}
import { RiArrowGoBackLine } from 'react-icons/ri'
import { SCENES } from '../data/scenes.js'
import DicePanel from './DicePanel.jsx'
import HouseScene from './HouseScene.jsx'
import FaceScene from './FaceScene.jsx'
import ShapeSVG from './ShapeSVG.jsx'

const ALL_PIECES = [...SCENES.house.pieces, ...SCENES.face.pieces]

export default function GameScreen({
  placedShapes,
  placedBy,
  completedBy,
  scores,
  activeId,
  wrongSlotId,
  currentDicePiece,
  currentPlayer,
  canRoll,
  turnMessage,
  handleDragStart,
  handleDragEnd,
  handleRoll,
  onBack,
}) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } })
  )

  const activePiece = activeId
    ? ALL_PIECES.find(p => p.id === activeId)
    : null

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="game-screen">

        {/* Scoreboard */}
        <div className="game-header">
          <Scoreboard
            currentPlayer={currentPlayer}
            scores={scores}
            completedBy={completedBy}
          />
        </div>

        {/* Scenes */}
        <div className="game-scenes-area">
          <div className="game-scenes-row">
            <SceneCard title="Casa">
              <HouseScene
                placedShapes={placedShapes}
                placedBy={placedBy}
                wrongSlotId={wrongSlotId}
              />
            </SceneCard>
            <SceneCard title="Rosto">
              <FaceScene
                placedShapes={placedShapes}
                placedBy={placedBy}
                wrongSlotId={wrongSlotId}
              />
            </SceneCard>
          </div>
        </div>

        {/* Dice */}
        <div className="game-dice-area">
          <DicePanel
            currentDicePiece={currentDicePiece}
            onRoll={handleRoll}
            gameCanRoll={canRoll}
            turnMessage={turnMessage}
            currentPlayer={currentPlayer}
          />
        </div>

        <button className="back-button" onClick={onBack}>
          <RiArrowGoBackLine /> Voltar
        </button>
      </div>

      <DragOverlay dropAnimation={null} modifiers={[snapOverlayToCursor]}>
        {activePiece ? (
          <div className="drag-overlay-shape">
            <ShapeSVG type={activePiece.type} color={activePiece.color} size={72} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function SceneCard({ title, children }) {
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)

  useDndMonitor({
    onDragStart: () => setDragging(true),
    onDragEnd:   () => setDragging(false),
    onDragCancel:() => setDragging(false),
  })

  const cls = ['scene-card',
    hovered  ? 'scene-card--hovered'  : '',
    dragging ? 'scene-card--dragging' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cls}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="scene-card-title">{title}</span>
      {children}
    </div>
  )
}

function Scoreboard({ currentPlayer, scores, completedBy }) {
  return (
    <div className="scoreboard">
      <PlayerCard player={0} score={scores[0]} completedBy={completedBy} isActive={currentPlayer === 0} />
      <PlayerCard player={1} score={scores[1]} completedBy={completedBy} isActive={currentPlayer === 1} />
    </div>
  )
}

function PlayerCard({ player, score, completedBy, isActive }) {
  const houseByMe = completedBy.house === player
  const faceByMe  = completedBy.face  === player
  return (
    <div className={`player-card player-card--p${player + 1} ${isActive ? 'player-card--active' : ''}`}>
      <div className="player-card-top">
        <span className="player-card-name">Jogador {player + 1}</span>
      </div>
      <span className="player-card-score">{score}</span>
      <div className="player-card-drawings">
        <span className={`drawing-chip ${houseByMe ? 'drawing-chip--done' : ''}`}>Casa</span>
        <span className={`drawing-chip ${faceByMe  ? 'drawing-chip--done' : ''}`}>Rosto</span>
      </div>
    </div>
  )
}
