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
    reveal.style.display = "flex"
    reveal.style.position = "relative"
    reveal.style.clipPath = "none"
    reveal.style.pointerEvents = "auto"
    return
  }

  const update = () => {
    const rect = wrapper.getBoundingClientRect()
    const vh = window.innerHeight

    if (rect.top >= vh) {
      // Wrapper is completely below viewport — MUST be hidden so it never overlays other sections
      reveal.style.display = "none"
      reveal.style.pointerEvents = "none"
      reveal.style.clipPath = "inset(100% 0 0 0)"
    } else if (rect.top > 0) {
      // Wrapper is entering the viewport: show and reveal via clip-path
      const r = 1 - rect.top / vh
      reveal.style.display = "flex"
      reveal.style.position = "fixed"
      reveal.style.top = "0"
      reveal.style.left = "0"
      reveal.style.right = "0"
      reveal.style.bottom = "0"
      reveal.style.clipPath = `inset(${(1 - r) * 100}% 0 0 0)`
      reveal.style.pointerEvents = r > 0.05 ? "auto" : "none"

      if (bg) {
        bg.style.transform = `scale(${1.08 - r * 0.08})`
      }
      if (content) {
        content.style.transform = `translateY(${(1 - r) * 35}px)`
        content.style.opacity = `${0.5 + r * 0.5}`
      }
    } else {
      // Wrapper is fully occupying viewport at document bottom
      reveal.style.display = "flex"
      reveal.style.position = "absolute"
      reveal.style.top = "0"
      reveal.style.left = "0"
      reveal.style.right = "0"
      reveal.style.bottom = "0"
      reveal.style.clipPath = "none"
      reveal.style.pointerEvents = "auto"
      if (bg) bg.style.transform = "scale(1)"
      if (content) {
        content.style.transform = "translateY(0)"
        content.style.opacity = "1"
      }
    }
  }

  // Initial check
  update()

  // Listen to standard scroll, resize, and Lenis/ScrollTrigger updates
  window.addEventListener("scroll", update, { passive: true })
  window.addEventListener("resize", update, { passive: true })
  ScrollTrigger.addEventListener("refresh", update)
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
