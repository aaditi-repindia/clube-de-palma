import gsap from "gsap"

const SESSION_KEY = "cdp-splash-seen"

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
    if (exiting) return
    exiting = true
    sessionStorage.setItem(SESSION_KEY, "1")

    if (reduced || !arch) {
      gsap.to(splash, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: cleanup,
      })
      return
    }

    const target = archShape || arch
    const rect = target.getBoundingClientRect()
    const scale = Math.max(
      (window.innerWidth * 1.15) / rect.width,
      (window.innerHeight * 1.15) / rect.height,
    )

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

    tl.to(
      archShape,
      {
        borderRadius: "0% 0% 0% 0% / 0% 0% 0% 0%",
        duration: 1.55,
        ease: "power2.inOut",
      },
      0.18,
    )

    // ...but counter-scale the full-viewport image so it never upscales/pixelates
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

    tl.to(
      veil,
      {
        autoAlpha: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      0.35,
    )

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
  gsap.set(arch, { scale: 0.82 })
  gsap.set(portalImage, { xPercent: -50, yPercent: -50, scale: 1.04 })
  gsap.set(copy, { autoAlpha: 0 })
  gsap.set("[data-portal-word], [data-portal-script], [data-portal-phrase]", {
    autoAlpha: 0,
    y: 32,
  })
  gsap.set(progressWrap, { autoAlpha: 0 })
  gsap.set(watermark, { autoAlpha: 0, scale: 1.08 })

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } })

  intro
    .to(watermark, { autoAlpha: 1, scale: 1, duration: 1.1 }, 0)
    .to(arch, { scale: 1, duration: 1.4 }, 0.08)
    .to(portalImage, { scale: 1.02, duration: 1.6 }, 0.08)
    .to(copy, { autoAlpha: 1, duration: 0.2 }, 0.4)
    .to("[data-portal-word]", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.14 }, 0.45)
    .to("[data-portal-script]", { autoAlpha: 1, y: 0, duration: 0.85 }, 0.62)
    .to("[data-portal-phrase]", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.78)
    .to(progressWrap, { autoAlpha: 1, duration: 0.5 }, 0.85)

  const progress = { value: 0 }
  const progressTween = gsap.to(progress, {
    value: 100,
    duration: 2.4,
    ease: "power1.inOut",
    delay: 0.4,
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
