import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
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
        <button className="back-button" onClick={onBack}><RiArrowGoBackLine /> Voltar</button>
        <div className="game-die-col">
          <Scoreboard
            currentPlayer={currentPlayer}
            scores={scores}
            completedBy={completedBy}
          />
          <DicePanel
            currentDicePiece={currentDicePiece}
            onRoll={handleRoll}
            gameCanRoll={canRoll}
            turnMessage={turnMessage}
          />
        </div>
        <div className="game-scene-col">
          <div className="game-scenes-row">
            <HouseScene
              placedShapes={placedShapes}
              placedBy={placedBy}
              wrongSlotId={wrongSlotId}
            />
            <FaceScene
              placedShapes={placedShapes}
              placedBy={placedBy}
              wrongSlotId={wrongSlotId}
            />
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activePiece ? (
          <div className="drag-overlay-shape">
            <ShapeSVG
              type={activePiece.type}
              color={activePiece.color}
              size={72}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
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
        <span className="player-card-name">J{player + 1}</span>
        <span className="player-card-score">{score}</span>
      </div>
      <div className="player-card-drawings">
        <span className={`drawing-chip ${houseByMe ? 'drawing-chip--done' : ''}`}>Casa</span>
        <span className={`drawing-chip ${faceByMe  ? 'drawing-chip--done' : ''}`}>Rosto</span>
      </div>
    </div>
  )
}
