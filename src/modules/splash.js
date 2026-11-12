import gsap from "gsap"

const SESSION_KEY = "cdp-splash-seen"

export function initSplash({ onComplete } = {}) {
  const splash = document.getElementById("splash")
  const skip = document.getElementById("splash-skip")
  const fill = document.querySelector("[data-preloader-fill]")
  const label = document.querySelector("[data-preloader-label]")
  const arch = document.querySelector("[data-portal-arch]")
  const portalImage = document.querySelector("[data-portal-image]")
  const copy = document.querySelector("[data-portal-copy]")
  const hero = document.querySelector(".hero")
  const progressWrap = document.querySelector(".splash__progress")
  const veil = document.querySelector(".splash__veil")

  if (!splash) {
    onComplete?.()
    return
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const seen = sessionStorage.getItem(SESSION_KEY) === "1"

  const revealHero = () => {
    hero?.classList.add("hero--visible", "is-ready", "is-portal-ready")
  }

  const cleanup = () => {
    splash.hidden = true
    splash.setAttribute("aria-hidden", "true")
    splash.classList.add("is-done")
    document.body.classList.remove("is-locked")
    revealHero()
    onComplete?.()
  }

  const playPortalExit = () => {
    sessionStorage.setItem(SESSION_KEY, "1")

    if (reduced || !arch) {
      gsap.to(splash, {
        autoAlpha: 0,
        duration: 0.35,
        onComplete: cleanup,
      })
      return
    }

    const vw = window.innerWidth
    const vh = window.innerHeight
    const archRect = arch.getBoundingClientRect()
    const scaleX = (vw * 1.15) / archRect.width
    const scaleY = (vh * 1.15) / archRect.height
    const scale = Math.max(scaleX, scaleY)

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: cleanup,
    })

    tl.to(
      [copy, progressWrap, skip].filter(Boolean),
      {
        autoAlpha: 0,
        y: -18,
        duration: 0.55,
        stagger: 0.04,
        ease: "power2.in",
      },
      0,
    )

    tl.to(
      arch,
      {
        scale,
        borderRadius: "0px",
        duration: 1.45,
        ease: "power3.inOut",
      },
      0.15,
    )

    tl.to(
      portalImage,
      {
        scale: 1,
        duration: 1.45,
        ease: "power2.out",
      },
      0.15,
    )

    tl.to(
      veil,
      {
        autoAlpha: 0,
        duration: 0.9,
        ease: "power2.inOut",
      },
      0.45,
    )

    tl.add(() => {
      revealHero()
      // Soft-hand hero content while portal finishes expanding
      gsap.fromTo(
        "[data-hero-intro]",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          stagger: 0.08,
          ease: "power3.out",
        },
      )
    }, 0.75)

    tl.to(
      splash,
      {
        autoAlpha: 0,
        duration: 0.55,
        ease: "power2.inOut",
      },
      1.35,
    )
  }

  if (seen || reduced) {
    cleanup()
    // Still run a light hero intro when skipping portal
    if (!reduced) {
      gsap.fromTo(
        "[data-hero-intro]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "power3.out", delay: 0.05 },
      )
    }
    return
  }

  document.body.classList.add("is-locked")
  hero?.classList.remove("hero--visible")

  // Initial portal state
  gsap.set(arch, { scale: 0.86, autoAlpha: 1 })
  gsap.set(portalImage, { scale: 1.14 })
  gsap.set(copy, { autoAlpha: 0 })
  gsap.set("[data-portal-word], [data-portal-script], [data-portal-phrase], [data-portal-atmosphere]", {
    autoAlpha: 0,
    y: 28,
  })
  gsap.set(progressWrap, { autoAlpha: 0 })

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } })

  intro
    .to(arch, { scale: 1, duration: 1.25 }, 0.1)
    .to(portalImage, { scale: 1.06, duration: 1.4 }, 0.1)
    .to(copy, { autoAlpha: 1, duration: 0.2 }, 0.35)
    .to(
      "[data-portal-word]",
      { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.12 },
      0.4,
    )
    .to("[data-portal-script]", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.55)
    .to("[data-portal-phrase]", { autoAlpha: 1, y: 0, duration: 0.75 }, 0.7)
    .to("[data-portal-atmosphere]", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.85)
    .to(progressWrap, { autoAlpha: 1, duration: 0.5 }, 0.7)

  const progress = { value: 0 }
  const progressTween = gsap.to(progress, {
    value: 100,
    duration: 2.35,
    ease: "power1.inOut",
    delay: 0.35,
    onUpdate: () => {
      const v = Math.round(progress.value)
      if (fill) gsap.set(fill, { scaleX: progress.value / 100 })
      if (label) label.textContent = `${v}%`
    },
    onComplete: playPortalExit,
  })

  skip?.addEventListener(
    "click",
    () => {
      progressTween.kill()
      intro.kill()
      playPortalExit()
    },
    { once: true },
  )
}
