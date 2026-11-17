import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function initHeroPortal() {
  const hero = document.querySelector(".hero--portal")
  const header = document.getElementById("site-header")
  if (!hero) return

  const arch = hero.querySelector("[data-portal-arch]")
  const archShape = hero.querySelector("[data-portal-shape]")
  const portalImage = hero.querySelector("[data-portal-image]")
  const ring = hero.querySelector(".hero__arch-ring")
  const veil = hero.querySelector(".hero__veil")
  const scrim = hero.querySelector("[data-portal-scrim]")
  const copy = hero.querySelector("[data-portal-copy]")
  const brandLockup = hero.querySelector(".hero__brand-lockup")
  const phrase = hero.querySelector("[data-portal-phrase]")
  const cta = hero.querySelector("[data-portal-cta]")
  const scrollIndicator = hero.querySelector("[data-portal-scroll]")

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Initial State: Header, logo, banner copies, and CTAs are completely hidden before scroll
  if (header) gsap.set(header, { autoAlpha: 0, y: -10, pointerEvents: "none" })
  if (copy) gsap.set(copy, { autoAlpha: 0, pointerEvents: "none" })
  if (brandLockup) gsap.set(brandLockup, { autoAlpha: 0, y: 28 })
  if (phrase) gsap.set(phrase, { autoAlpha: 0, y: 20 })
  if (cta) gsap.set(cta, { autoAlpha: 0, y: 20, pointerEvents: "none" })
  if (scrim) gsap.set(scrim, { autoAlpha: 0 })
  if (veil) gsap.set(veil, { autoAlpha: 1 })
  if (ring) gsap.set(ring, { autoAlpha: 1 })
  if (arch) gsap.set(arch, { scale: 1 })
  if (scrollIndicator) gsap.set(scrollIndicator, { autoAlpha: 1 })

  if (reduced) {
    if (header) gsap.set(header, { autoAlpha: 1, y: 0, pointerEvents: "auto" })
    if (copy) gsap.set(copy, { autoAlpha: 1, pointerEvents: "auto" })
    if (brandLockup) gsap.set(brandLockup, { autoAlpha: 1, y: 0 })
    if (phrase) gsap.set(phrase, { autoAlpha: 1, y: 0 })
    if (cta) gsap.set(cta, { autoAlpha: 1, y: 0, pointerEvents: "auto" })
    if (scrim) gsap.set(scrim, { autoAlpha: 0.35 })
    if (veil) gsap.set(veil, { autoAlpha: 0 })
    if (ring) gsap.set(ring, { autoAlpha: 0 })
    return
  }

  const calcTargetScale = () => {
    const target = archShape || arch
    const rect = target.getBoundingClientRect()
    const w = Math.max(rect.width || 0, 1)
    const h = Math.max(rect.height || 0, 1)
    const scale = Math.max((window.innerWidth * 1.3) / w, (window.innerHeight * 1.3) / h)
    if (!Number.isFinite(scale) || scale <= 0) return 6
    return Math.min(scale, 35)
  }

  // Pin hero for controlled, silky scroll scrubbing
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=170%",
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      pinSpacing: true,
    },
  })

  // Phase 1 (0.00 -> 0.55): Arch zooms until curve disappears and full banner covers viewport
  if (scrollIndicator) {
    tl.to(scrollIndicator, { autoAlpha: 0, y: -10, duration: 0.12, ease: "power2.inOut" }, 0)
  }
  if (ring) {
    tl.to(ring, { autoAlpha: 0, duration: 0.16, ease: "power2.inOut" }, 0)
  }

  // Expand arch to fill screen
  tl.to(
    arch,
    {
      scale: () => calcTargetScale(),
      duration: 0.55,
      ease: "power2.inOut",
    },
    0.02,
  )

  // Unround arch corners to full rectangle
  if (archShape) {
    tl.to(
      archShape,
      {
        borderRadius: "0px 0px 0px 0px",
        boxShadow: "0 0 0 0 rgba(0,0,0,0)",
        duration: 0.52,
        ease: "power2.inOut",
      },
      0.05,
    )
  }

  // Counter-scale image so it remains natural and crisp
  if (portalImage) {
    tl.to(
      portalImage,
      {
        scale: () => 1 / calcTargetScale(),
        duration: 0.55,
        ease: "power2.inOut",
      },
      0.02,
    )
  }

  // Terracotta veil fades out as the arch reaches full screen
  if (veil) {
    tl.to(
      veil,
      {
        autoAlpha: 0,
        duration: 0.52,
        ease: "power2.inOut",
      },
      0.1,
    )
  }

  // Scrim fades in as full banner becomes visible for text readability
  if (scrim) {
    tl.to(
      scrim,
      {
        autoAlpha: 0.36,
        duration: 0.25,
        ease: "power1.inOut",
      },
      0.45,
    )
  }

  // Phase 2 (0.55 -> 0.90): Once curve disappeared and full banner is visible, reveal Header, Logo, Copies & CTAs!
  if (copy) {
    tl.to(copy, { autoAlpha: 1, duration: 0.05 }, 0.55)
  }

  // Header and Logo reveal
  if (header) {
    tl.to(
      header,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.25,
        ease: "power3.out",
        onStart: () => gsap.set(header, { pointerEvents: "auto" }),
        onReverseComplete: () => gsap.set(header, { pointerEvents: "none" }),
      },
      0.55,
    )
  }

  // Banner headings ("CLUBE de PALMA") reveal
  if (brandLockup) {
    tl.to(
      brandLockup,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.26,
        ease: "power3.out",
      },
      0.58,
    )
  }

  // Copies / Phrase ("A place to belong") reveal
  if (phrase) {
    tl.to(
      phrase,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.24,
        ease: "power3.out",
      },
      0.65,
    )
  }

  // CTAs ("Explore the Clube", "Apply for Membership") reveal
  if (cta) {
    tl.to(
      cta,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.24,
        ease: "power3.out",
        onStart: () => gsap.set(cta, { pointerEvents: "auto" }),
        onReverseComplete: () => gsap.set(cta, { pointerEvents: "none" }),
      },
      0.72,
    )
  }

  // Phase 3 (0.90 -> 1.00): Stable hold buffer before user scrolls into next section
  tl.to({}, { duration: 0.1 }, 0.9)
}
