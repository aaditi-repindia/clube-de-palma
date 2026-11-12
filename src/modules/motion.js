import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { initSmoothScroll, scrollToTarget } from "./smooth.js"
import { initReveals } from "./reveals.js"
import { initMagnetic } from "./magnetic.js"
import { initCursor } from "./cursor.js"
import { initPinnedStories } from "./pinned.js"
import { initMarquee } from "./marquee.js"

gsap.registerPlugin(ScrollTrigger)

export function initMotion() {
  initSmoothScroll()
  initCursor()
  initMagnetic()
  initMarquee()
  initReveals()
  initPinnedStories()
  const hero = document.querySelector(".hero")
  requestAnimationFrame(() => hero?.classList.add("is-ready"))

  // Hero entrance is owned by the portal splash transition (splash.js)

  // Anchor links use Lenis
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href")
      if (!id || id === "#") return
      const target = document.querySelector(id)
      if (!target) return
      event.preventDefault()
      scrollToTarget(target)
    })
  })

  // Refresh triggers after images load
  window.addEventListener("load", () => ScrollTrigger.refresh())
}
