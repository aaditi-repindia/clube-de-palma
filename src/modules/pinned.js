import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function initPinnedStories() {
  const about = document.querySelector(".section.about")

  if (about) {
    const video = about.querySelector("[data-walkthrough-video]")

    if (video) {
      video.muted = true
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const onFirstInteract = () => {
            video.play()
            window.removeEventListener("scroll", onFirstInteract)
            window.removeEventListener("click", onFirstInteract)
            window.removeEventListener("touchstart", onFirstInteract)
          }
          window.addEventListener("scroll", onFirstInteract, { passive: true })
          window.addEventListener("click", onFirstInteract, { once: true })
          window.addEventListener("touchstart", onFirstInteract, { passive: true, once: true })
        })
      }

      // Intrinsic ratio can settle after metadata; refresh triggers so layout stays accurate
      const refreshLayout = () => ScrollTrigger.refresh()
      if (video.readyState >= 1) {
        refreshLayout()
      } else {
        video.addEventListener("loadedmetadata", refreshLayout, { once: true })
      }
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
