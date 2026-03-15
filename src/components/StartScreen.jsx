import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// x, y as percentages (numbers)
const SHAPES = [
  { type: 'circle',        x: -8,  y: 70, size: 140, color: '#FFD93D', opacity: 0.55, anim: 'float-a' },
  { type: 'triangle',      x: 78,  y: -4, size: 110, color: '#FF6B6B', opacity: 0.6,  anim: 'float-b' },
  { type: 'square',        x: 82,  y: 55, size: 80,  color: '#6BCB77', opacity: 0.5,  anim: 'float-a' },
  { type: 'semicircle',    x: 70,  y: 80, size: 100, color: '#74C0FC', opacity: 0.45, anim: 'float-c' },
  { type: 'rectangle',     x: -4,  y: 8,  size: 90,  color: '#CC5DE8', opacity: 0.45, anim: 'float-b' },
  { type: 'parallelogram', x: 5,   y: 42, size: 70,  color: '#FF922B', opacity: 0.5,  anim: 'float-c' },
  { type: 'circle',        x: 44,  y: -6, size: 55,  color: '#fff',    opacity: 0.2,  anim: 'float-a' },
  { type: 'triangle',      x: 38,  y: 88, size: 65,  color: '#FFD93D', opacity: 0.35, anim: 'float-b' },
]

const FRICTION = 0.84
const PUSH     = 0.28

function buildShape(type, size, color, opacity) {
  const c = { fill: color, opacity }
  if (type === 'circle')
    return <circle cx={size/2} cy={size/2} r={size/2} {...c} />
  if (type === 'triangle')
    return <polygon points={`${size/2},0 ${size},${size} 0,${size}`} {...c} />
  if (type === 'square')
    return <rect width={size} height={size} rx={size*0.1} {...c} />
  if (type === 'rectangle')
    return <rect width={size} height={size*0.55} rx={size*0.08} {...c} />
  if (type === 'semicircle')
    return <path d={`M0,${size/2} A${size/2},${size/2} 0 0,1 ${size},${size/2} Z`} {...c} />
  if (type === 'parallelogram') {
    const sk = size * 0.28
    return <polygon points={`${sk},0 ${size},0 ${size-sk},${size*0.6} 0,${size*0.6}`} {...c} />
  }
}

export default function StartScreen({ onStart }) {
  const containerRef = useRef(null)
  const physRef      = useRef(null)   // [{x, y, vx, vy, r}]
  const boundsRef    = useRef({ w: 0, h: 0 })
  const dragRef      = useRef(null)   // {index, prevX, prevY}
  const rafRef       = useRef(null)
  const [pos, setPos] = useState(null)

  // Init physics from real pixel positions
  useLayoutEffect(() => {
    const { width: w, height: h } = containerRef.current.getBoundingClientRect()
    boundsRef.current = { w, h }
    physRef.current = SHAPES.map(s => ({
      x:  s.x / 100 * w + s.size / 2,
      y:  s.y / 100 * h + s.size / 2,
      vx: 0, vy: 0,
      r:  s.size * 0.44,
    }))
    setPos(physRef.current.map(({ x, y }) => ({ x, y })))
  }, [])

  // Update bounds on resize
  useEffect(() => {
    function onResize() {
      if (containerRef.current) {
        const { width: w, height: h } = containerRef.current.getBoundingClientRect()
        boundsRef.current = { w, h }
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Physics loop
  useEffect(() => {
    function tick() {
      const p = physRef.current
      if (!p) { rafRef.current = requestAnimationFrame(tick); return }

      const { w, h } = boundsRef.current
      const di = dragRef.current?.index ?? -1

      // Integrate velocity
      for (let i = 0; i < p.length; i++) {
        if (i === di) continue
        p[i].x += p[i].vx
        p[i].y += p[i].vy
        p[i].vx *= FRICTION
        p[i].vy *= FRICTION
        // Soft wall bounce
        if (p[i].x < p[i].r)     { p[i].x = p[i].r;     p[i].vx =  Math.abs(p[i].vx) * 0.4 }
        if (p[i].y < p[i].r)     { p[i].y = p[i].r;     p[i].vy =  Math.abs(p[i].vy) * 0.4 }
        if (p[i].x > w - p[i].r) { p[i].x = w - p[i].r; p[i].vx = -Math.abs(p[i].vx) * 0.4 }
        if (p[i].y > h - p[i].r) { p[i].y = h - p[i].r; p[i].vy = -Math.abs(p[i].vy) * 0.4 }
      }

      // Circle–circle collision
      for (let i = 0; i < p.length; i++) {
        for (let j = i + 1; j < p.length; j++) {
          const dx = p[j].x - p[i].x
          const dy = p[j].y - p[i].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minD = p[i].r + p[j].r
          if (dist < minD && dist > 0.1) {
            const nx   = dx / dist
            const ny   = dy / dist
            const push = (minD - dist) * PUSH
            if (i !== di) { p[i].x -= nx*push; p[i].vx -= nx*push*0.5; p[i].vy -= ny*push*0.5 }
            if (j !== di) { p[j].x += nx*push; p[j].vx += nx*push*0.5; p[j].vy += ny*push*0.5 }
          }
        }
      }

      setPos(p.map(({ x, y }) => ({ x, y })))
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Drag + throw
  useEffect(() => {
    function onMove(e) {
      if (!dragRef.current) return
      const { left, top } = containerRef.current.getBoundingClientRect()
      const p = physRef.current[dragRef.current.index]
      dragRef.current.prevX = p.x
      dragRef.current.prevY = p.y
      p.x = e.clientX - left
      p.y = e.clientY - top
    }
    function onUp() {
      if (!dragRef.current) return
      const p = physRef.current[dragRef.current.index]
      p.vx = (p.x - dragRef.current.prevX) * 0.9
      p.vy = (p.y - dragRef.current.prevY) * 0.9
      dragRef.current = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }
  }, [])

  function handlePointerDown(i, e) {
    e.preventDefault()
    const p = physRef.current[i]
    p.vx = 0; p.vy = 0
    dragRef.current = { index: i, prevX: p.x, prevY: p.y }
  }

  return (
    <div className="start-screen" ref={containerRef}>
      {pos && SHAPES.map((s, i) => (
        <div
          key={i}
          className="start-decor"
          style={{
            left: 0,
            top:  0,
            transform: `translate(${pos[i].x - s.size/2}px, ${pos[i].y - s.size/2}px)`,
            cursor: 'grab',
          }}
          onPointerDown={e => handlePointerDown(i, e)}
        >
          <svg
            width={s.size}
            height={s.size}
            viewBox={`0 0 ${s.size} ${s.size}`}
            className={`start-decor--${s.anim}`}
          >
            {buildShape(s.type, s.size, s.color, s.opacity)}
          </svg>
        </div>
      ))}

      <div className="start-content">
        <h1 className="start-title">Jogo das<br />Formas</h1>
        <p className="start-subtitle">complete os desenhos com as formas geométricas!</p>
        <button className="start-btn" onClick={onStart}>Começar</button>
      </div>
    </div>
  )
}
