import gsap from "gsap"

export function initMagnetic() {
  if (!window.matchMedia("(pointer: fine)").matches) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  document.querySelectorAll("[data-magnetic]").forEach((btn) => {
    const strength = Number(btn.dataset.magnetic || 0.35)
    const inner = btn.querySelector("[data-magnetic-inner]") || btn

    const onMove = (event) => {
      const rect = btn.getBoundingClientRect()
      const x = event.clientX - rect.left - rect.width / 2
      const y = event.clientY - rect.top - rect.height / 2
      gsap.to(inner, {
        x: x * strength,
        y: y * strength,
        duration: 0.45,
        ease: "power3.out",
      })
    }

    const onLeave = () => {
      gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" })
    }

    btn.addEventListener("pointermove", onMove)
    btn.addEventListener("pointerleave", onLeave)
  })
}
