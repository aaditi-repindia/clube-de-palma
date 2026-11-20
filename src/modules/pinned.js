import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function initPinnedStories() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduced) return

  // About / Concept section: smooth pinned hold so it STAYS comfortably in view without friction or jumps
  const about = document.querySelector(".section.about")
  if (about) {
    const content = about.querySelector(".about__content")
    const isMobile = window.matchMedia("(max-width: 720px)").matches

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: about,
        start: "top top",
        end: () => (isMobile ? "+=75%" : "+=110%"),
        pin: true,
        pinSpacing: true,
        scrub: 0.25,
        invalidateOnRefresh: true,
      },
    })

    // Keep statement comfortably centered for the primary reading zone (0.0 → 0.7)
    // Then gracefully ease upward as the section unlocks into the Marquee & Amenities
    if (content) {
      tl.fromTo(
        content,
        { y: 0 },
        { y: -24, ease: "power1.inOut", duration: 0.3 },
        0.7,
      )
    }
  }

  // Progress scrollbar thumb (Era-like scroll progress)
  const progress = document.querySelector("[data-scroll-progress]")
  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    })
  }
}
