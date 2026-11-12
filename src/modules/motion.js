import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { initSmoothScroll, scrollToTarget } from "./smooth.js"
import { initReveals } from "./reveals.js"
import { initMagnetic } from "./magnetic.js"
import { initCursor } from "./cursor.js"
import { initHeroAtmosphere } from "./heroAtmosphere.js"
import { initPinnedStories } from "./pinned.js"
import { initMarquee } from "./marquee.js"

gsap.registerPlugin(ScrollTrigger)

export function initMotion() {
  initSmoothScroll()
  initCursor()
  initMagnetic()
  initHeroAtmosphere()
  initMarquee()
  initReveals()
  initPinnedStories()

  const hero = document.querySelector(".hero")
  requestAnimationFrame(() => hero?.classList.add("is-ready"))

  // Hero content entrance after splash / on load
  const heroIntro = document.querySelectorAll("[data-hero-intro]")
  if (heroIntro.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.fromTo(
      heroIntro,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.15,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15,
      },
    )
  }

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
