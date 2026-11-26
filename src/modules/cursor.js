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
  cursor.hidden = false
  const label = cursor.querySelector(".site-cursor__label")
  let armed = false

  gsap.set(cursor, { xPercent: -50, yPercent: -50 })

  const show = () => {
    if (!armed) {
      armed = true
      cursor.classList.add("is-visible")
    }
  }

  const hide = () => {
    armed = false
    cursor.classList.remove("is-visible")
  }

  window.addEventListener("pointermove", (event) => {
    show()
    gsap.to(cursor, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    })
  })

  document.documentElement.addEventListener("pointerleave", hide)
  window.addEventListener("blur", hide)

  const setState = (state, text = "") => {
    cursor.dataset.state = state || ""
    if (label) label.textContent = text
  }

  const isInteractive = (target) =>
    Boolean(target?.closest?.("a, button, input, select, textarea, label, [role='button']"))

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    const apply = (target) => {
      if (isInteractive(target)) {
        setState("", "")
        cursor.hidden = true
        return
      }
      cursor.hidden = false
      show()
      setState(el.dataset.cursor, el.dataset.cursorLabel || "")
    }

    el.addEventListener("pointerenter", (event) => apply(event.target))
    el.addEventListener("pointermove", (event) => apply(event.target))
    el.addEventListener("pointerleave", () => {
      cursor.hidden = false
      setState("", "")
    })
  })
}
