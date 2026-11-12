import gsap from "gsap"

const SESSION_KEY = "cdp-splash-seen"

export function initSplash({ onComplete } = {}) {
  const splash = document.getElementById("splash")
  const skip = document.getElementById("splash-skip")
  const fill = document.querySelector("[data-preloader-fill]")
  const label = document.querySelector("[data-preloader-label]")
  const arch = document.querySelector("[data-portal-arch]")
  const archShape = document.querySelector(".splash__arch-shape")
  const portalImages = [...document.querySelectorAll("[data-portal-image]")]
  const copy = document.querySelector("[data-portal-copy]")
  const hero = document.querySelector(".hero")
  const progressWrap = document.querySelector(".splash__progress")
  const veil = document.querySelector(".splash__veil")
  const watermark = document.querySelector(".splash__watermark")
  const atmosphereTabs = [...document.querySelectorAll("[data-portal-atmosphere-tab]")]

  if (!splash) {
    onComplete?.()
    return
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const forceIntro = new URLSearchParams(window.location.search).has("intro")
  const seen = !forceIntro && sessionStorage.getItem(SESSION_KEY) === "1"
  let activeAtmosphere = "courtyard"
  let exiting = false

  const setPortalAtmosphere = (key) => {
    activeAtmosphere = key
    atmosphereTabs.forEach((tab) => {
      const on = tab.dataset.portalAtmosphereTab === key
      tab.classList.toggle("is-active", on)
      tab.setAttribute("aria-selected", String(on))
    })
    portalImages.forEach((img) => {
      const on = img.dataset.portalImage === key
      gsap.to(img, {
        autoAlpha: on ? 1 : 0,
        duration: 0.85,
        ease: "power2.inOut",
        overwrite: "auto",
      })
    })
  }

  atmosphereTabs.forEach((tab) => {
    tab.addEventListener("click", () => setPortalAtmosphere(tab.dataset.portalAtmosphereTab))
  })

  const syncHeroAtmosphere = () => {
    const heroTab = document.querySelector(`[data-atmosphere-tab="${activeAtmosphere}"]`)
    heroTab?.click()
  }

  const revealHero = () => {
    hero?.classList.add("hero--visible", "is-ready", "is-portal-ready")
  }

  const cleanup = () => {
    splash.hidden = true
    splash.setAttribute("aria-hidden", "true")
    splash.classList.add("is-done")
    document.body.classList.remove("is-locked")
    revealHero()
    syncHeroAtmosphere()
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
      (window.innerWidth * 1.2) / rect.width,
      (window.innerHeight * 1.2) / rect.height,
    )

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: cleanup,
    })

    // Hold the brand lockup slightly longer for continuity, then dissolve into hero lockup
    tl.to(
      [progressWrap, skip, watermark, "[data-portal-atmosphere]"].filter(Boolean),
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

    tl.to(
      arch,
      {
        scale,
        duration: 1.65,
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

    tl.to(
      portalImages,
      {
        scale: 1,
        duration: 1.65,
        ease: "power2.out",
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
      syncHeroAtmosphere()

      // Continuity: brand lockup appears first (same composition as splash)
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
          delay: 0.25,
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
      1.45,
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

  // Initial portal state
  gsap.set(arch, { scale: 0.78 })
  gsap.set(portalImages, { scale: 1.18 })
  gsap.set(portalImages.find((img) => img.dataset.portalImage === "courtyard"), { autoAlpha: 1 })
  gsap.set(portalImages.find((img) => img.dataset.portalImage === "nightfall"), { autoAlpha: 0 })
  gsap.set(copy, { autoAlpha: 0 })
  gsap.set(
    "[data-portal-word], [data-portal-script], [data-portal-phrase], [data-portal-atmosphere]",
    { autoAlpha: 0, y: 32 },
  )
  gsap.set(progressWrap, { autoAlpha: 0 })
  gsap.set(watermark, { autoAlpha: 0, scale: 1.08 })

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } })

  intro
    .to(watermark, { autoAlpha: 1, scale: 1, duration: 1.1 }, 0)
    .to(arch, { scale: 1, duration: 1.4 }, 0.08)
    .to(portalImages, { scale: 1.08, duration: 1.55 }, 0.08)
    .to(copy, { autoAlpha: 1, duration: 0.2 }, 0.4)
    .to("[data-portal-word]", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.14 }, 0.45)
    .to("[data-portal-script]", { autoAlpha: 1, y: 0, duration: 0.85 }, 0.62)
    .to("[data-portal-phrase]", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.78)
    .to("[data-portal-atmosphere]", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.95)
    .to(progressWrap, { autoAlpha: 1, duration: 0.5 }, 0.85)

  const progress = { value: 0 }
  const progressTween = gsap.to(progress, {
    value: 100,
    duration: 2.6,
    ease: "power1.inOut",
    delay: 0.45,
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
