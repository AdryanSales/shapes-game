import { useState, useEffect, useCallback } from 'react'
import { SCENES } from '../data/scenes.js'

// Combined pieces and slots from both scenes
const ALL_PIECES    = [...SCENES.house.pieces, ...SCENES.face.pieces]
const ALL_SLOTS     = [...SCENES.house.slots,  ...SCENES.face.slots]
const HOUSE_SLOT_IDS = new Set(SCENES.house.slots.map(s => s.id))
const FACE_SLOT_IDS  = new Set(SCENES.face.slots.map(s => s.id))

export function useGameState() {
  const [phase, setPhase] = useState('start') // 'start' | 'playing' | 'congrats'
  const [placedShapes, setPlacedShapes] = useState({}) // { slotId: pieceId }
  const [placedBy, setPlacedBy] = useState({})         // { slotId: 0|1 }
  const [completedBy, setCompletedBy] = useState({ house: null, face: null }) // who completed each drawing
  const [usedPieceIds, setUsedPieceIds] = useState(new Set())
  const [activeId, setActiveId] = useState(null)
  const [wrongSlotId, setWrongSlotId] = useState(null)
  const [currentDicePiece, setCurrentDicePiece] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(0) // 0 = Jogador 1, 1 = Jogador 2
  const [canRoll, setCanRoll] = useState(true)
  const [turnMessage, setTurnMessage] = useState(null)

  // Win detection: all slots from both scenes filled
  const isWon = ALL_SLOTS.every(slot => placedShapes[slot.id] != null)

  // Scores: 1 point per drawing completed (max 2)
  const scores = [
    (completedBy.house === 0 ? 1 : 0) + (completedBy.face === 0 ? 1 : 0),
    (completedBy.house === 1 ? 1 : 0) + (completedBy.face === 1 ? 1 : 0),
  ]

  useEffect(() => {
    if (isWon && phase === 'playing') {
      const t = setTimeout(() => setPhase('congrats'), 800)
      return () => clearTimeout(t)
    }
  }, [isWon, phase])

  const switchPlayer = useCallback(() => {
    setCurrentPlayer(p => 1 - p)
    setCanRoll(true)
    setCurrentDicePiece(null)
    setTurnMessage(null)
  }, [])

  const startGame = useCallback(() => {
    setPlacedShapes({})
    setPlacedBy({})
    setCompletedBy({ house: null, face: null })
    setUsedPieceIds(new Set())
    setActiveId(null)
    setWrongSlotId(null)
    setCurrentDicePiece(null)
    setCurrentPlayer(0)
    setCanRoll(true)
    setTurnMessage(null)
    setPhase('playing')
  }, [])

  const resetGame = useCallback(() => {
    setPhase('start')
    setPlacedShapes({})
    setPlacedBy({})
    setCompletedBy({ house: null, face: null })
    setUsedPieceIds(new Set())
    setActiveId(null)
    setWrongSlotId(null)
    setCurrentDicePiece(null)
    setCurrentPlayer(0)
    setCanRoll(true)
    setTurnMessage(null)
  }, [])

  const handleRoll = useCallback((shapeType) => {
    const piece = ALL_PIECES.find(
      p => p.type === shapeType && !usedPieceIds.has(p.id)
    )
    setCurrentDicePiece(piece ?? null)
    setCanRoll(false)
    if (!piece) {
      setTurnMessage('Forma indisponível! Passando a vez...')
      setTimeout(() => switchPlayer(), 900)
    }
  }, [usedPieceIds, switchPlayer])

  const handleDragStart = useCallback(({ active }) => {
    setActiveId(active.id)
  }, [])

  const handleDragEnd = useCallback(({ active, over }) => {
    setActiveId(null)

    if (!over) return

    const pieceId = active.id
    const slotId  = over.id

    const piece = ALL_PIECES.find(p => p.id === pieceId)
    const slot  = ALL_SLOTS.find(s => s.id === slotId)

    if (!piece || !slot) return
    if (placedShapes[slotId]) return
    if (usedPieceIds.has(pieceId)) return

    // Wrong shape type → player loses turn
    if (piece.type !== slot.accepts) {
      setWrongSlotId(slotId)
      setTimeout(() => setWrongSlotId(null), 600)
      setCurrentDicePiece(null)
      setTurnMessage('Forma errada! Perdeu a vez...')
      setTimeout(() => switchPlayer(), 800)
      return
    }

    // Correct placement
    const newPlacedShapes = { ...placedShapes, [slotId]: pieceId }
    setPlacedShapes(newPlacedShapes)
    setPlacedBy(prev => ({ ...prev, [slotId]: currentPlayer }))
    setUsedPieceIds(prev => new Set([...prev, pieceId]))
    setCurrentDicePiece(null)
    setCanRoll(true)

    // Check if this piece completed a drawing
    const houseNowDone = [...HOUSE_SLOT_IDS].every(id => newPlacedShapes[id] != null)
    const faceNowDone  = [...FACE_SLOT_IDS].every(id => newPlacedShapes[id] != null)
    setCompletedBy(prev => {
      const next = { ...prev }
      if (houseNowDone && prev.house === null) next.house = currentPlayer
      if (faceNowDone  && prev.face  === null) next.face  = currentPlayer
      return next
    })
  }, [placedShapes, usedPieceIds, currentPlayer, switchPlayer])

  return {
    phase,
    placedShapes,
    placedBy,
    completedBy,
    scores,
    usedPieceIds,
    activeId,
    wrongSlotId,
    isWon,
    currentDicePiece,
    currentPlayer,
    canRoll,
    turnMessage,
    startGame,
    resetGame,
    handleDragStart,
    handleDragEnd,
    handleRoll,
  }
}
