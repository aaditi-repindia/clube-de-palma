import gsap from "gsap"

export function initCursor() {
  const cursor = document.getElementById("site-cursor")
  if (!cursor) return
  if (!window.matchMedia("(pointer: fine)").matches) {
    cursor.hidden = true
    return
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cursor.hidden = true
    return
  }

  document.documentElement.classList.add("has-custom-cursor")
  const label = cursor.querySelector(".site-cursor__label")

  gsap.set(cursor, { xPercent: -50, yPercent: -50 })

  window.addEventListener("pointermove", (event) => {
    gsap.to(cursor, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    })
  })

  const setState = (state, text = "") => {
    cursor.dataset.state = state || ""
    if (label) label.textContent = text
  }

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("pointerenter", () => {
      setState(el.dataset.cursor, el.dataset.cursorLabel || "")
    })
    el.addEventListener("pointerleave", () => setState("", ""))
  })
}
