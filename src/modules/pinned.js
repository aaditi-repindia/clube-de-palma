import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function initPinnedStories() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const about = document.querySelector(".section.about")

  if (about) {
    const stage = about.querySelector("[data-about-stage]")
    const content = about.querySelector("[data-about-content]")
    const cta = about.querySelector(".about__cta")
    const walkthrough = about.querySelector("[data-walkthrough]")
    const video = about.querySelector("[data-walkthrough-video]")
    const isMobile = window.matchMedia("(max-width: 720px)").matches

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
    }

    const getRestingMetrics = () => {
      const sRect = (stage || about).getBoundingClientRect()
      const cRect = (cta || content).getBoundingClientRect()
      // Place video 120px below CTA (or 60px on mobile)
      const gap = isMobile ? 40 : 120
      const top = Math.round(cRect.bottom - sRect.top + gap)
      // Height fills from top to bottom of stage with comfortable bottom margin
      const availableH = Math.max(200, Math.round(sRect.bottom - (sRect.top + top) - (isMobile ? 16 : 24)))
      return { top, height: availableH }
    }

    const applyResting = () => {
      if (!walkthrough) return
      const metrics = getRestingMetrics()
      gsap.set(walkthrough, {
        top: metrics.top,
        height: metrics.height,
        width: "min(1180px, 86vw)",
        borderRadius: 0,
        boxShadow: "0 24px 60px -12px rgba(18, 30, 23, 0.22)",
      })
    }

    if (walkthrough) {
      applyResting()

      if (!reduced) {
        // Expand video slowly as user scrolls down to fit the entire screen
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: about,
            start: "top top",
            end: () => (isMobile ? "+=180%" : "+=260%"),
            pin: true,
            pinSpacing: true,
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        })

        // 1. Text fades out smoothly and drifts up
        if (content) {
          tl.fromTo(
            content,
            { autoAlpha: 1, y: 0 },
            {
              autoAlpha: 0,
              y: -40,
              duration: 0.28,
              ease: "power1.inOut",
            },
            0.06,
          )
        }

        // 2. Video expands from its card frame (top, height, width) to 100vw x 100vh full screen
        tl.to(
          walkthrough,
          {
            top: 0,
            height: "100%",
            width: "100%",
            borderRadius: 0,
            boxShadow: "0 0 0 transparent",
            duration: 0.58,
            ease: "power1.inOut",
          },
          0.08,
        )

        // 3. Subtle camera aperture scale on video
        if (video) {
          tl.fromTo(
            video,
            { scale: 1.06 },
            { scale: 1.0, duration: 0.58, ease: "power1.out" },
            0.08,
          )
        }

        // 4. Hold full screen for immersive viewing before transitioning to next section
        tl.to({}, { duration: 0.34 }, 0.66)

        ScrollTrigger.addEventListener("refresh", () => {
          const st = tl.scrollTrigger
          if (!st || st.progress <= 0.02) {
            applyResting()
          }
        })
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
