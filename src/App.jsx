import { useGameState } from './hooks/useGameState.js'
import StartScreen from './components/StartScreen.jsx'
import GameScreen from './components/GameScreen.jsx'
import CongratsScreen from './components/CongratsScreen.jsx'

const DEV_CONGRATS = import.meta.env.DEV && window.location.hash === '#congrats'

const MOCK_SCORES      = [3, 5]
const MOCK_COMPLETED_BY = { house: 1, face: 0 }

export default function App() {
  if (DEV_CONGRATS) {
    return <CongratsScreen scores={MOCK_SCORES} completedBy={MOCK_COMPLETED_BY} onBack={() => {}} />
  }

  const gameState = useGameState()

  if (gameState.phase === 'start') {
    return <StartScreen onStart={gameState.startGame} />
  }

  if (gameState.phase === 'playing') {
    return (
      <GameScreen
        placedShapes={gameState.placedShapes}
        placedBy={gameState.placedBy}
        completedBy={gameState.completedBy}
        scores={gameState.scores}
        activeId={gameState.activeId}
        wrongSlotId={gameState.wrongSlotId}
        currentDicePiece={gameState.currentDicePiece}
        currentPlayer={gameState.currentPlayer}
        canRoll={gameState.canRoll}
        turnMessage={gameState.turnMessage}
        handleDragStart={gameState.handleDragStart}
        handleDragEnd={gameState.handleDragEnd}
        handleRoll={gameState.handleRoll}
        onBack={gameState.resetGame}
      />
    )
  }

  if (gameState.phase === 'congrats') {
    return <CongratsScreen scores={gameState.scores} completedBy={gameState.completedBy} onBack={gameState.resetGame} />
  }

  return null
}
