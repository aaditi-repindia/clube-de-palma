import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function initPinnedStories() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduced) return

  // Hero parallax scrub — Era-like pinned scale on media
  const hero = document.querySelector(".hero")
  const heroMedia = document.querySelector(".hero__media")
  if (hero && heroMedia) {
    gsap.to(heroMedia, {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })
  }

  // About: scrubbed layered imagery (parallax storytelling without hard pin collisions)
  const about = document.querySelector(".about")
  const front = document.querySelector(".about__frame--front img")
  const back = document.querySelector(".about__frame--back img")
  if (about && window.matchMedia("(min-width: 901px)").matches) {
    if (front) {
      gsap.fromTo(
        front,
        { yPercent: -8, scale: 1.1 },
        {
          yPercent: 8,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: about,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )
    }
    if (back) {
      gsap.fromTo(
        back,
        { yPercent: 10, scale: 1.12 },
        {
          yPercent: -6,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: about,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )
    }
  }

  // Membership invite parallax media
  const invite = document.querySelector(".membership__invite")
  if (invite) {
    gsap.fromTo(
      invite,
      { backgroundPosition: "50% 30%" },
      {
        backgroundPosition: "50% 70%",
        ease: "none",
        scrollTrigger: {
          trigger: invite,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    )
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
