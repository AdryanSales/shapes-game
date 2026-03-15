import { useGameState } from './hooks/useGameState.js'
import StartScreen from './components/StartScreen.jsx'
import GameScreen from './components/GameScreen.jsx'
import CongratsScreen from './components/CongratsScreen.jsx'

export default function App() {
  const gameState = useGameState()

  if (gameState.phase === 'start') {
    return <StartScreen onSelect={gameState.selectScene} />
  }

  if (gameState.phase === 'playing') {
    return (
      <GameScreen
        activeScene={gameState.activeScene}
        currentScene={gameState.currentScene}
        placedShapes={gameState.placedShapes}
        usedPieceIds={gameState.usedPieceIds}
        activeId={gameState.activeId}
        wrongSlotId={gameState.wrongSlotId}
        handleDragStart={gameState.handleDragStart}
        handleDragEnd={gameState.handleDragEnd}
        onBack={gameState.resetGame}
      />
    )
  }

  if (gameState.phase === 'congrats') {
    return (
      <CongratsScreen
        activeScene={gameState.activeScene}
        onBack={gameState.resetGame}
      />
    )
  }

  return null
}
