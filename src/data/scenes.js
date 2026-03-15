import { SHAPE_COLORS } from './shapes.js'

export const SCENES = {
  house: {
    id: 'house',
    label: 'Casa',
    // Pieces available to drag (each has a unique id + type + color)
    pieces: [
      { id: 'h-parallelogram', type: 'parallelogram', color: SHAPE_COLORS.parallelogram },
      { id: 'h-triangle',      type: 'triangle',      color: SHAPE_COLORS.triangle      },
      { id: 'h-rectangle',     type: 'rectangle',     color: SHAPE_COLORS.rectangle     },
      { id: 'h-square',        type: 'square',        color: SHAPE_COLORS.square        },
    ],
    // Droppable slots in the SVG scene (viewBox 400x285)
    slots: [
      {
        id: 'house-roof-left',
        accepts: 'parallelogram',
        label: 'Telhado',
        // Parallelogram: bottom (20,155)→(260,155), right diagonal →(320,15), top →(80,15), left diagonal back
        points: '20,155 260,155 320,15 80,15',
        shapeRotation: 0,
      },
      {
        id: 'house-roof-right',
        accepts: 'triangle',
        label: 'Telhado',
        // Triangle above the right (square) section: apex at (320,15)
        points: '320,15 260,155 380,155',
        shapeRotation: 0,
      },
      {
        id: 'house-body-left',
        accepts: 'rectangle',
        label: 'Parede',
        x: 20, y: 155, width: 240, height: 120,
        shapeRotation: 0,
      },
      {
        id: 'house-body-right',
        accepts: 'square',
        label: 'Porta',
        x: 260, y: 155, width: 120, height: 120,
        shapeRotation: 0,
      },
    ],
  },

  face: {
    id: 'face',
    label: 'Rosto',
    pieces: [
      { id: 'f-semi-1',  type: 'semicircle', color: SHAPE_COLORS.semicircle },
      { id: 'f-semi-2',  type: 'semicircle', color: SHAPE_COLORS.semicircle },
      { id: 'f-circle-1', type: 'circle',    color: SHAPE_COLORS.circle     },
      { id: 'f-circle-2', type: 'circle',    color: SHAPE_COLORS.circle     },
      { id: 'f-triangle', type: 'triangle',  color: SHAPE_COLORS.triangle   },
      { id: 'f-semi-3',  type: 'semicircle', color: SHAPE_COLORS.semicircle },
    ],
    slots: [
      {
        id: 'face-brow-left',
        accepts: 'semicircle',
        label: 'Sobrancelha Esquerda',
        cx: 145, cy: 155, r: 42,
        // flat side up (arc faces downward like a brow)
        shapeRotation: 180,
      },
      {
        id: 'face-brow-right',
        accepts: 'semicircle',
        label: 'Sobrancelha Direita',
        cx: 255, cy: 155, r: 42,
        shapeRotation: 180,
      },
      {
        id: 'face-eye-left',
        accepts: 'circle',
        label: 'Olho Esquerdo',
        cx: 145, cy: 225, r: 38,
        shapeRotation: 0,
      },
      {
        id: 'face-eye-right',
        accepts: 'circle',
        label: 'Olho Direito',
        cx: 255, cy: 225, r: 38,
        shapeRotation: 0,
      },
      {
        id: 'face-nose',
        accepts: 'triangle',
        label: 'Nariz',
        points: '200,285 177,325 223,325',
        shapeRotation: 0,
      },
      {
        id: 'face-mouth',
        accepts: 'semicircle',
        label: 'Boca',
        cx: 200, cy: 355, r: 50,
        // arc faces upward (smile)
        shapeRotation: 0,
      },
    ],
  },
}
