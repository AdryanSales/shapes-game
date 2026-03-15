import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { RiArrowGoBackLine } from 'react-icons/ri'
import DicePanel from './DicePanel.jsx'
import HouseScene from './HouseScene.jsx'
import FaceScene from './FaceScene.jsx'
import ShapeSVG from './ShapeSVG.jsx'

export default function GameScreen({
  activeScene,
  currentScene,
  placedShapes,
  usedPieceIds,
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
    ? currentScene.pieces.find(p => p.id === activeId)
    : null

  const SceneComponent = activeScene === 'house' ? HouseScene : FaceScene

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="game-screen">
        <button className="back-button" onClick={onBack}><RiArrowGoBackLine /> Voltar</button>
        <div className="game-die-col">
          <div className="player-indicator">
            <div className={`player-tag ${currentPlayer === 0 ? 'player-tag--active' : ''}`}>
              Jogador 1
            </div>
            <div className={`player-tag ${currentPlayer === 1 ? 'player-tag--active' : ''}`}>
              Jogador 2
            </div>
          </div>
          <DicePanel
            currentDicePiece={currentDicePiece}
            onRoll={handleRoll}
            gameCanRoll={canRoll}
            turnMessage={turnMessage}
          />
        </div>
        <div className="game-scene-col">
          <SceneComponent
            placedShapes={placedShapes}
            usedPieceIds={usedPieceIds}
            wrongSlotId={wrongSlotId}
            currentScene={currentScene}
          />
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
