import gsap from "gsap"

const SESSION_KEY = "cdp-splash-seen"
const HARD_TIMEOUT_MS = 4500

export function initSplash({ onComplete } = {}) {
  const splash = document.getElementById("splash")
  const skip = document.getElementById("splash-skip")
  const fill = document.querySelector("[data-preloader-fill]")
  const label = document.querySelector("[data-preloader-label]")
  const arch = document.querySelector("[data-portal-arch]")
  const archShape = document.querySelector(".splash__arch-shape")
  const portalImage = document.querySelector("[data-portal-image]")
  const copy = document.querySelector("[data-portal-copy]")
  const hero = document.querySelector(".hero")
  const progressWrap = document.querySelector(".splash__progress")
  const veil = document.querySelector(".splash__veil")
  const watermark = document.querySelector(".splash__watermark")

  if (!splash) {
    onComplete?.()
    return
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const forceIntro = new URLSearchParams(window.location.search).has("intro")
  const seen = !forceIntro && sessionStorage.getItem(SESSION_KEY) === "1"
  let exiting = false
  let finished = false
  let progressTween = null
  let intro = null
  let hardTimer = 0

  const revealHero = () => {
    hero?.classList.add("hero--visible", "is-ready", "is-portal-ready")
  }

  const cleanup = () => {
    if (finished) return
    finished = true
    window.clearTimeout(hardTimer)
    progressTween?.kill()
    intro?.kill()
    try {
      gsap.killTweensOf(splash)
      gsap.killTweensOf(arch)
      gsap.killTweensOf(portalImage)
    } catch {
      /* ignore */
    }

    splash.hidden = true
    splash.setAttribute("aria-hidden", "true")
    splash.classList.add("is-done")
    splash.style.display = "none"
    document.body.classList.remove("is-locked")
    revealHero()
    onComplete?.()
  }

  const safePortalScale = () => {
    const target = archShape || arch
    if (!target) return 8
    const rect = target.getBoundingClientRect()
    const w = Math.max(rect.width || 0, 1)
    const h = Math.max(rect.height || 0, 1)
    const scale = Math.max((window.innerWidth * 1.15) / w, (window.innerHeight * 1.15) / h)
    if (!Number.isFinite(scale) || scale <= 0) return 8
    return Math.min(scale, 40)
  }

  const playPortalExit = () => {
    if (exiting || finished) return
    exiting = true
    window.clearTimeout(hardTimer)
    try {
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {
      /* ignore */
    }

    // Hard fallback: force cleanup if timeline does not conclude
    window.setTimeout(cleanup, 2800)

    if (reduced || !arch) {
      gsap.to(splash, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: cleanup,
      })
      window.setTimeout(cleanup, 400)
      return
    }

    const scale = safePortalScale()
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: cleanup,
    })

    tl.to(
      [progressWrap, skip, watermark].filter(Boolean),
      {
        autoAlpha: 0,
        y: -12,
        duration: 0.45,
        stagger: 0.03,
        ease: "power2.in",
      },
      0,
    )

    tl.to(
      "[data-portal-phrase]",
      { autoAlpha: 0, y: -10, duration: 0.4, ease: "power2.in" },
      0.05,
    )

    // Expand the portal frame...
    tl.to(
      arch,
      {
        scale,
        duration: 1.7,
        ease: "power3.inOut",
      },
      0.12,
    )

    if (archShape) {
      tl.to(
        archShape,
        {
          borderRadius: "0% 0% 0% 0% / 0% 0% 0% 0%",
          duration: 1.55,
          ease: "power2.inOut",
        },
        0.18,
      )
    }

    // ...but counter-scale the full-viewport image so it never upscales/pixelates
    if (portalImage) {
      tl.to(
        portalImage,
        {
          xPercent: -50,
          yPercent: -50,
          scale: 1 / scale,
          duration: 1.7,
          ease: "power3.inOut",
        },
        0.12,
      )
    }

    if (veil) {
      tl.to(
        veil,
        {
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        0.35,
      )
    }

    tl.to(
      "[data-portal-word], [data-portal-script]",
      {
        autoAlpha: 0,
        y: -16,
        filter: "blur(6px)",
        duration: 0.55,
        stagger: 0.04,
        ease: "power2.in",
      },
      0.55,
    )

    tl.add(() => {
      revealHero()

      gsap.fromTo(
        "[data-hero-lockup]",
        { autoAlpha: 0, y: 18, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.95,
          stagger: 0.08,
          ease: "power3.out",
        },
      )

      gsap.fromTo(
        "[data-hero-intro]:not([data-hero-lockup])",
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.2,
        },
      )
    }, 0.85)

    tl.to(
      splash,
      {
        autoAlpha: 0,
        duration: 0.55,
        ease: "power2.inOut",
      },
      1.5,
    )
  }

  if (seen || reduced) {
    cleanup()
    if (!reduced) {
      gsap.fromTo(
        "[data-hero-intro]",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.06, ease: "power3.out", delay: 0.05 },
      )
    }
    return
  }

  document.body.classList.add("is-locked")
  hero?.classList.remove("hero--visible", "is-portal-ready")

  // Soft Ken Burns without leaving viewport-native resolution
  if (arch) gsap.set(arch, { scale: 0.82 })
  if (portalImage) gsap.set(portalImage, { xPercent: -50, yPercent: -50, scale: 1.04 })
  if (copy) gsap.set(copy, { autoAlpha: 0 })
  gsap.set("[data-portal-word], [data-portal-script], [data-portal-phrase]", {
    autoAlpha: 0,
    y: 32,
  })
  if (progressWrap) gsap.set(progressWrap, { autoAlpha: 0 })
  if (watermark) gsap.set(watermark, { autoAlpha: 0, scale: 1.08 })
  if (fill) gsap.set(fill, { scaleX: 0 })
  if (label) label.textContent = "0%"

  const startIntro = () => {
    if (finished || exiting) return

    intro = gsap.timeline({ defaults: { ease: "power3.out" } })

    if (watermark) intro.to(watermark, { autoAlpha: 1, scale: 1, duration: 1.1 }, 0)
    if (arch) intro.to(arch, { scale: 1, duration: 1.4 }, 0.08)
    if (portalImage) intro.to(portalImage, { scale: 1.02, duration: 1.6 }, 0.08)
    if (copy) intro.to(copy, { autoAlpha: 1, duration: 0.2 }, 0.4)
    intro.to("[data-portal-word]", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.14 }, 0.45)
    intro.to("[data-portal-script]", { autoAlpha: 1, y: 0, duration: 0.85 }, 0.62)
    intro.to("[data-portal-phrase]", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.78)
    if (progressWrap) intro.to(progressWrap, { autoAlpha: 1, duration: 0.5 }, 0.85)

    const progress = { value: 0 }
    progressTween = gsap.to(progress, {
      value: 100,
      duration: 2.2,
      ease: "power1.inOut",
      delay: 0.25,
      onUpdate: () => {
        const v = Math.round(progress.value)
        if (fill) gsap.set(fill, { scaleX: progress.value / 100 })
        if (label) label.textContent = `${v}%`
      },
      onComplete: playPortalExit,
    })
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(startIntro)
  })

  // Failsafe timer: guarantees the splash will never stay stuck
  hardTimer = window.setTimeout(() => {
    if (!finished) playPortalExit()
  }, HARD_TIMEOUT_MS)

  skip?.addEventListener(
    "click",
    (e) => {
      e?.preventDefault?.()
      cleanup()
    },
    { once: true },
  )
}
