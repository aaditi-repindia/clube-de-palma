import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

let lenis

export function initSmoothScroll() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduced) return null

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.1,
  })

  lenis.on("scroll", ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(1000, 16)

  document.documentElement.classList.add("has-smooth-scroll")
  return lenis
}

export function getLenis() {
  return lenis
}

export function scrollToTarget(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -80, ...options })
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
  } else {
    target?.scrollIntoView?.({ behavior: "smooth" })
  }
}
