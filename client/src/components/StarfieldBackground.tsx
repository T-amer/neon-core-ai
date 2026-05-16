import { useRef, useEffect } from "react"

function isDark(): boolean {
  return document.documentElement.classList.contains("dark")
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let animId: number
    let dark = isDark()

    const stars: {
      x: number; y: number; r: number; a: number
      speed: number; phase: number; hue: number; twinkleSpeed: number
    }[] = []

    let w = 0, h = 0

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w * devicePixelRatio
      canvas!.height = h * devicePixelRatio
      canvas!.style.width = w + "px"
      canvas!.style.height = h + "px"
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    function initStars() {
      stars.length = 0
      const count = dark ? 450 : 200
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: dark
            ? 0.3 + Math.random() * 1.7
            : 0.3 + Math.random() * 1.2,
          a: dark
            ? 0.15 + Math.random() * 0.55
            : 0.03 + Math.random() * 0.1,
          speed: 0.002 + Math.random() * 0.01,
          phase: Math.random() * Math.PI * 2,
          hue: dark
            ? Math.random() < 0.3
              ? 240 + Math.random() * 60
              : 0
            : 0,
          twinkleSpeed: 0.5 + Math.random() * 1.5,
        })
      }
    }

    function getBgColor(): string {
      return getComputedStyle(document.documentElement)
        .getPropertyValue("--background").trim() || (dark ? "#1a1a1a" : "#f8f9fb")
    }

    resize()
    initStars()

    let time = 0

    function draw() {
      time++
      dark = isDark()
      ctx.clearRect(0, 0, w, h)

      ctx.fillStyle = getBgColor()
      ctx.fillRect(0, 0, w, h)

      for (const s of stars) {
        const twinkle = 0.6 + 0.4 * Math.sin(time * 0.02 * s.twinkleSpeed + s.phase)
        const alpha = s.a * twinkle
        if (s.hue > 0) {
          ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${alpha})`
        } else {
          const c = Math.floor(dark ? 200 + 55 * alpha : 160 + 20 * alpha)
          ctx.fillStyle = dark
            ? `rgba(255, 255, 255, ${alpha})`
            : `rgba(${c}, ${c}, ${c + 20}, ${alpha})`
        }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(document.body)

    const mo = new MutationObserver(() => {
      dark = isDark()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      mo.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  )
}
