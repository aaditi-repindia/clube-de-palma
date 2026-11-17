import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function initHeroPortal() {
  const hero = document.querySelector(".hero--portal")
  if (!hero) return

  const arch = hero.querySelector("[data-portal-arch]")
  const archShape = hero.querySelector("[data-portal-shape]")
  const ring = hero.querySelector(".hero__arch-ring")
  const veil = hero.querySelector(".hero__veil")
  const watermark = hero.querySelector(".hero__watermark")
  const phrase = hero.querySelector("[data-portal-phrase]")
  const scrollIndicator = hero.querySelector("[data-portal-scroll]")
  const brandLockup = hero.querySelector(".hero__brand-lockup")
  const cta = hero.querySelector("[data-portal-cta]")

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Initial state: gate is almost smallest (disappeared)
  const START_SCALE = 0.05
  gsap.set(arch, {
    scale: START_SCALE,
    autoAlpha: 0.15,
    transformOrigin: "center center",
    force3D: true,
  })

  // Subtle initial entrance for typography on load
  if (!reduced) {
    gsap.fromTo(
      [brandLockup, phrase, cta, scrollIndicator].filter(Boolean),
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.05,
      },
    )
  }

  if (reduced || !arch) return

  const calcTargetScale = () => {
    const target = archShape || arch
    const rect = target.getBoundingClientRect()
    const w = Math.max(rect.width / (gsap.getProperty(arch, "scale") || START_SCALE), 1)
    const h = Math.max(rect.height / (gsap.getProperty(arch, "scale") || START_SCALE), 1)
    const scale = Math.max((window.innerWidth * 1.35) / w, (window.innerHeight * 1.35) / h)
    if (!Number.isFinite(scale) || scale <= 0) return 6
    return Math.min(scale, 35)
  }

  // ScrollTrigger scrub: zooms the small gate up into full-bleed view on scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=130%",
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      pinSpacing: true,
    },
  })

  // 1. As soon as scroll starts, gate fades in to full opacity and starts zooming
  tl.to(
    arch,
    {
      autoAlpha: 1,
      duration: 0.12,
      ease: "power1.out",
    },
    0,
  )

  // 2. Peripheral text and scroll prompt fade out
  tl.to(
    [phrase, scrollIndicator, watermark].filter(Boolean),
    {
      autoAlpha: 0,
      y: -14,
      duration: 0.25,
      ease: "power2.inOut",
    },
    0,
  )

  // 3. Zoom the gate from almost smallest to full viewport coverage
  tl.to(
    arch,
    {
      scale: () => calcTargetScale(),
      duration: 1,
      ease: "power2.inOut",
    },
    0,
  )

  // 4. Smooth arch corners interpolate to 0px rectangle as it nears full screen
  if (archShape) {
    tl.to(
      archShape,
      {
        borderRadius: "0px 0px 0px 0px",
        boxShadow: "0 0 0 0 rgba(0,0,0,0)",
        duration: 0.8,
        ease: "power2.inOut",
      },
      0.15,
    )
  }

  // 5. Outer ring fades out as the gate expands
  if (ring) {
    tl.to(
      ring,
      {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.inOut",
      },
      0.2,
    )
  }

  // 6. Solid terracotta veil dissolves to reveal the full-bleed pool courtyard
  if (veil) {
    tl.to(
      veil,
      {
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.inOut",
      },
      0.2,
    )
  }

  // 7. Typography and CTAs fade cleanly as the courtyard photograph takes over
  if (cta) {
    tl.to(
      cta,
      {
        autoAlpha: 0,
        y: 20,
        duration: 0.35,
        ease: "power1.inOut",
      },
      0.15,
    )
  }

  if (brandLockup) {
    tl.to(
      brandLockup,
      {
        autoAlpha: 0,
        y: -24,
        duration: 0.45,
        ease: "power1.inOut",
      },
      0.18,
    )
  }
}
