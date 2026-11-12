import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { splitLines, splitWords } from "./split.js"

gsap.registerPlugin(ScrollTrigger)

export function initReveals() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduced) {
    document.querySelectorAll(".reveal, [data-reveal]").forEach((el) => {
      el.classList.add("is-visible")
      el.style.opacity = "1"
      el.style.transform = "none"
      el.style.clipPath = "none"
    })
    return
  }

  // Heading line reveals (Era-like mask rise)
  document.querySelectorAll("[data-reveal='h']").forEach((el) => {
    splitLines(el)
    const masks = el.querySelectorAll(".split-line__mask")
    gsap.set(masks, { yPercent: 110 })
    gsap.to(masks, {
      yPercent: 0,
      duration: 1.15,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    })
  })

  // Paragraph / body soft rise
  document.querySelectorAll("[data-reveal='p']").forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      },
    )
  })

  // Container fade/stagger children
  document.querySelectorAll("[data-reveal='ctn']").forEach((el) => {
    const kids = el.children.length ? [...el.children] : [el]
    gsap.fromTo(
      kids,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
          once: true,
        },
      },
    )
  })

  // Image clip / slide reveals
  document.querySelectorAll("[data-reveal='slide']").forEach((el) => {
    const media = el.matches("img") ? el : el.querySelector("img") || el
    gsap.fromTo(
      el,
      { clipPath: "inset(12% 12% 12% 12%)", autoAlpha: 0.2 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        autoAlpha: 1,
        duration: 1.25,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      },
    )
    if (media && media !== el) {
      gsap.fromTo(
        media,
        { scale: 1.12 },
        {
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        },
      )
    }
  })

  // Vertical accent lines grow
  document.querySelectorAll("[data-reveal='line']").forEach((el) => {
    gsap.fromTo(
      el,
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      },
    )
  })

  // Legacy .reveal nodes
  document.querySelectorAll(".reveal").forEach((el) => {
    if (el.hasAttribute("data-reveal")) return
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => el.classList.add("is-visible"),
        },
      },
    )
  })

  // Word-stagger for selected statements
  document.querySelectorAll("[data-reveal='words']").forEach((el) => {
    const wraps = splitWords(el)
    gsap.set(
      wraps.map((w) => w.querySelector(".split-word")),
      { yPercent: 120 },
    )
    gsap.to(
      wraps.map((w) => w.querySelector(".split-word")),
      {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.045,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      },
    )
  })
}
