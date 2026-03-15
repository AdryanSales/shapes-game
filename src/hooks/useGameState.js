import { useState, useEffect, useCallback } from 'react'
import { SCENES } from '../data/scenes.js'

export function useGameState() {
  const [phase, setPhase] = useState('start') // 'start' | 'playing' | 'congrats'
  const [activeScene, setActiveScene] = useState(null)
  const [placedShapes, setPlacedShapes] = useState({}) // { slotId: pieceId }
  const [usedPieceIds, setUsedPieceIds] = useState(new Set())
  const [activeId, setActiveId] = useState(null) // piece being dragged
  const [wrongSlotId, setWrongSlotId] = useState(null)
  const [currentDicePiece, setCurrentDicePiece] = useState(null)

  const currentScene = activeScene ? SCENES[activeScene] : null

  // Win detection
  const isWon = currentScene
    ? currentScene.slots.every(slot => placedShapes[slot.id] != null)
    : false

  useEffect(() => {
    if (isWon && phase === 'playing') {
      const t = setTimeout(() => setPhase('congrats'), 800)
      return () => clearTimeout(t)
    }
  }, [isWon, phase])

  const selectScene = useCallback((sceneId) => {
    setActiveScene(sceneId)
    setPlacedShapes({})
    setUsedPieceIds(new Set())
    setActiveId(null)
    setWrongSlotId(null)
    setCurrentDicePiece(null)
    setPhase('playing')
  }, [])

  const resetGame = useCallback(() => {
    setPhase('start')
    setActiveScene(null)
    setPlacedShapes({})
    setUsedPieceIds(new Set())
    setActiveId(null)
    setWrongSlotId(null)
    setCurrentDicePiece(null)
  }, [])

  const handleRoll = useCallback((shapeType) => {
    if (!currentScene) return
    const piece = currentScene.pieces.find(
      p => p.type === shapeType && !usedPieceIds.has(p.id)
    )
    setCurrentDicePiece(piece ?? null)
  }, [currentScene, usedPieceIds])

  const handleDragStart = useCallback(({ active }) => {
    setActiveId(active.id)
  }, [])

  const handleDragEnd = useCallback(({ active, over }) => {
    setActiveId(null)

    if (!over || !currentScene) return

    const pieceId = active.id
    const slotId = over.id

    const piece = currentScene.pieces.find(p => p.id === pieceId)
    const slot = currentScene.slots.find(s => s.id === slotId)

    if (!piece || !slot) return

    // Slot already filled
    if (placedShapes[slotId]) return

    // Piece already placed
    if (usedPieceIds.has(pieceId)) return

    // Wrong shape type
    if (piece.type !== slot.accepts) {
      setWrongSlotId(slotId)
      setTimeout(() => setWrongSlotId(null), 600)
      return
    }

    // Success
    setPlacedShapes(prev => ({ ...prev, [slotId]: pieceId }))
    setUsedPieceIds(prev => new Set([...prev, pieceId]))
    setCurrentDicePiece(null)
  }, [currentScene, placedShapes, usedPieceIds])

  return {
    phase,
    activeScene,
    currentScene,
    placedShapes,
    usedPieceIds,
    activeId,
    wrongSlotId,
    isWon,
    currentDicePiece,
    selectScene,
    resetGame,
    handleDragStart,
    handleDragEnd,
    handleRoll,
  }
}
