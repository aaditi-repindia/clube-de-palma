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
  const scrollIndicator = hero.querySelector("[data-portal-scroll]")
  const heroCopy = hero.querySelector("[data-portal-copy]")
  const badge = hero.querySelector("[data-portal-badge]")
  const header = document.getElementById("site-header")

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // If user prefers reduced motion, show full banner content immediately
  if (reduced) {
    if (header) {
      header.classList.remove("is-portal-gated")
      gsap.set(header, { autoAlpha: 1, y: 0, clearProps: "all" })
    }
    if (heroCopy) {
      gsap.set(heroCopy, { autoAlpha: 1, y: 0, clearProps: "all" })
    }
    if (badge) {
      gsap.set(badge, { autoAlpha: 0 })
    }
    return
  }

  // Initial state: Header, logo, headings and CTAs are completely hidden.
  // ONLY the curve gate and image are visible before scrolling.
  if (header) {
    gsap.set(header, { autoAlpha: 0, y: -24 })
    header.style.pointerEvents = "none"
  }
  if (heroCopy) {
    gsap.set(heroCopy, { autoAlpha: 0, y: 32 })
    heroCopy.style.pointerEvents = "none"
  }

  // Gentle initial entrance of the arch window on first load
  if (arch) {
    gsap.fromTo(
      arch,
      { scale: 0.94, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 1.1, ease: "power2.out" },
    )
  }
  if (scrollIndicator) {
    gsap.fromTo(
      scrollIndicator,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.35, ease: "power2.out" },
    )
  }

  const calcTargetScale = () => {
    const target = archShape || arch
    const rect = target.getBoundingClientRect()
    const w = Math.max(rect.width || 0, 1)
    const h = Math.max(rect.height || 0, 1)
    const scale = Math.max((window.innerWidth * 1.25) / w, (window.innerHeight * 1.25) / h)
    if (!Number.isFinite(scale) || scale <= 0) return 6
    return Math.min(scale, 35)
  }

  // ScrollTrigger scrub:
  // Phase 1 (0.0 → 0.52): Curve expands, flattens out, full banner image fills screen.
  // Phase 2 (0.50 → 0.75): Once curve has disappeared, Header (logo) and Banner headings/copies/CTAs smoothly reveal.
  // Phase 3 (0.75 → 1.0): Full banner is showcased, then transitions cleanly into About.
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=170%",
      pin: true,
      scrub: 0.25,
      invalidateOnRefresh: true,
      pinSpacing: true,
    },
  })

  // 1. Fade out scroll prompt, center logo, and decorative ring early as user starts scrolling
  if (scrollIndicator) {
    tl.to(scrollIndicator, { autoAlpha: 0, y: -12, duration: 0.18, ease: "power1.out" }, 0)
  }
  if (badge) {
    tl.to(badge, { autoAlpha: 0, scale: 0.88, duration: 0.24, ease: "power1.out" }, 0.02)
  }
  if (ring) {
    tl.to(ring, { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, 0.04)
  }
  if (watermark) {
    tl.to(watermark, { autoAlpha: 0, duration: 0.35, ease: "power1.out" }, 0.04)
  }

  // 2. Expand arch gate to fill viewport
  tl.to(
    arch,
    {
      scale: () => calcTargetScale(),
      duration: 0.54,
      ease: "power2.inOut",
    },
    0,
  )

  // 3. Unround arch corners to full rectangular screen
  if (archShape) {
    tl.to(
      archShape,
      {
        borderRadius: "0px 0px 0px 0px",
        boxShadow: "0 0 0 0 rgba(0,0,0,0)",
        duration: 0.48,
        ease: "power2.inOut",
      },
      0.04,
    )
  }

  // 4. Counter-scale image so it stays 100vw/100vh without distortion
  if (portalImage) {
    tl.to(
      portalImage,
      {
        scale: () => 1 / calcTargetScale(),
        duration: 0.54,
        ease: "power2.inOut",
      },
      0,
    )
  }

  // 5. Fade out terracotta backdrop to reveal the full panoramic banner
  if (veil) {
    tl.to(
      veil,
      {
        autoAlpha: 0,
        duration: 0.48,
        ease: "power2.inOut",
      },
      0.04,
    )
  }

  // 6. ONCE SCROLLED AND CURVE DISAPPEARED: Reveal header (logo + nav + CTA)
  if (header) {
    tl.to(
      header,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        ease: "power2.out",
        onStart: () => {
          header.style.pointerEvents = "auto"
        },
        onReverseComplete: () => {
          header.style.pointerEvents = "none"
        },
      },
      0.52,
    )
  }

  // Reveal banner headings, copies, and CTAs
  if (heroCopy) {
    tl.to(
      heroCopy,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.32,
        ease: "power2.out",
        onStart: () => {
          heroCopy.style.pointerEvents = "auto"
        },
        onReverseComplete: () => {
          heroCopy.style.pointerEvents = "none"
        },
      },
      0.55,
    )
  }

  // Hold the full banner with all headings and CTAs for remaining scroll before gliding into About
  tl.to({}, { duration: 0.28 }, 0.72)
}
