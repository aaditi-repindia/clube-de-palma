import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { initSmoothScroll, scrollToTarget } from "./smooth.js"
import { initReveals } from "./reveals.js"
import { initMagnetic } from "./magnetic.js"
import { initCursor } from "./cursor.js"
import { initPinnedStories } from "./pinned.js"
import { initMarquee } from "./marquee.js"

gsap.registerPlugin(ScrollTrigger)

function initMembershipParallax() {
  const section = document.querySelector(".membership-promo")
  const img = document.querySelector(".membership-promo__img")
  if (!section || !img) return

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(img, { yPercent: 0 })
    return
  }

  gsap.fromTo(
    img,
    { yPercent: -8 },
    {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  )
}

function initFooterReveal() {
  const wrapper = document.querySelector("[data-footer-reveal-wrapper]")
  const reveal = document.querySelector("[data-footer-reveal]")
  const bg = document.querySelector("[data-footer-reveal-bg]")
  const content = document.querySelector("[data-footer-reveal-content]")
  if (!wrapper || !reveal) return

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reveal.style.position = "relative"
    reveal.style.clipPath = "none"
    reveal.style.pointerEvents = "auto"
    return
  }

  ScrollTrigger.create({
    trigger: wrapper,
    start: "top bottom",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress
      const inset = (1 - p) * 100
      reveal.style.clipPath = `inset(${inset}% 0% 0% 0%)`
      reveal.style.pointerEvents = p > 0.05 ? "auto" : "none"
      if (bg) {
        gsap.set(bg, { scale: 1.08 - p * 0.08 })
      }
      if (content) {
        gsap.set(content, { y: (1 - p) * 35, opacity: 0.5 + p * 0.5 })
      }
    },
    onLeaveBack: () => {
      reveal.style.clipPath = "inset(100% 0% 0% 0%)"
      reveal.style.pointerEvents = "none"
    },
  })
}

export function initMotion() {
  initSmoothScroll()
  initCursor()
  initMagnetic()
  initMarquee()
  initReveals()
  initMembershipParallax()
  initFooterReveal()
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
