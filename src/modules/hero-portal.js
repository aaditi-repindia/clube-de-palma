import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function initHeroPortal() {
  const hero = document.querySelector(".hero--portal")
  if (!hero) return

  const arch = hero.querySelector("[data-portal-arch]")
  const archShape = hero.querySelector("[data-portal-shape]")
  const portalImage = hero.querySelector("[data-portal-image]")
  const ring = hero.querySelector(".hero__arch-ring")
  const veil = hero.querySelector(".hero__veil")
  const watermark = hero.querySelector(".hero__watermark")
  const phrase = hero.querySelector("[data-portal-phrase]")
  const scrollIndicator = hero.querySelector("[data-portal-scroll]")
  const brandLockup = hero.querySelector(".hero__brand-lockup")
  const cta = hero.querySelector("[data-portal-cta]")

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Gentle initial entrance on first paint (no blocking, no loader)
  if (!reduced) {
    gsap.fromTo(
      [brandLockup, phrase, cta, scrollIndicator].filter(Boolean),
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.1,
      },
    )

    if (arch) {
      gsap.fromTo(
        arch,
        { scale: 0.94 },
        { scale: 1, duration: 1.1, ease: "power2.out" },
      )
    }
  }

  if (reduced || !arch) return

  const calcTargetScale = () => {
    const target = archShape || arch
    const rect = target.getBoundingClientRect()
    const w = Math.max(rect.width || 0, 1)
    const h = Math.max(rect.height || 0, 1)
    const scale = Math.max((window.innerWidth * 1.25) / w, (window.innerHeight * 1.25) / h)
    if (!Number.isFinite(scale) || scale <= 0) return 6
    return Math.min(scale, 35)
  }

  // ScrollTrigger scrub: smoothly expands arch into full-bleed view on scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=120%",
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      pinSpacing: true,
    },
  })

  // 1. Fade peripheral accents early
  tl.to(
    [phrase, scrollIndicator, watermark, ring].filter(Boolean),
    {
      autoAlpha: 0,
      y: -18,
      duration: 0.35,
      ease: "power2.inOut",
    },
    0,
  )

  // 2. Expand arch to fill screen
  tl.to(
    arch,
    {
      scale: () => calcTargetScale(),
      duration: 1,
      ease: "power2.inOut",
    },
    0.04,
  )

  // 3. Unround arch corners to full rectangle
  if (archShape) {
    tl.to(
      archShape,
      {
        borderRadius: "0px 0px 0px 0px",
        boxShadow: "0 0 0 0 rgba(0,0,0,0)",
        duration: 0.85,
        ease: "power2.inOut",
      },
      0.08,
    )
  }

  // 4. Counter-scale image so it stays 100vw/100vh without distortion
  if (portalImage) {
    tl.to(
      portalImage,
      {
        scale: () => 1 / calcTargetScale(),
        duration: 1,
        ease: "power2.inOut",
      },
      0.04,
    )
  }

  // 5. Fade out terracotta backdrop to reveal full scene
  if (veil) {
    tl.to(
      veil,
      {
        autoAlpha: 0,
        duration: 0.85,
        ease: "power2.inOut",
      },
      0.15,
    )
  }

  // 6. Transition CTA and lockup as page scrolls into next section
  if (cta) {
    tl.to(
      cta,
      {
        autoAlpha: 0,
        y: 24,
        duration: 0.45,
        ease: "power1.inOut",
      },
      0.45,
    )
  }

  if (brandLockup) {
    tl.to(
      brandLockup,
      {
        y: -30,
        duration: 0.6,
        ease: "power1.inOut",
      },
      0.4,
    )
  }
}
