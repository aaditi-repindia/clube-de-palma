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

  const calcTargetScale = () => {
    const target = arch || archShape
    const w = Math.max(target ? target.offsetWidth : 0, 1)
    const h = Math.max(target ? target.offsetHeight : 0, 1)
    const scale = Math.max((window.innerWidth * 1.35) / w, (window.innerHeight * 1.35) / h)
    if (!Number.isFinite(scale) || scale <= 0) return 8
    return Math.min(scale, 35)
  }

  let tl = null

  // Synchronous counter-scale:
  // Instead of an independent tween that multiplies scales into a 250%+ zoom spike,
  // we compute the exact reciprocal counter-scale synchronously on every frame of the timeline.
  // Effective screen scale = currentArchScale * portalImageScale = desiredGlobalScale (1.00 -> 1.02).
  const updatePortalImageScale = () => {
    if (!portalImage || !arch) return
    const currentArchScale = gsap.getProperty(arch, "scale") || 1
    const progress = tl ? tl.progress() : 0
    // Arch expansion phase runs from progress 0 to 0.54
    const p = Math.min(Math.max(progress / 0.54, 0), 1)
    // Desired global scale: subtle, imperceptible 2% natural camera perspective (1.00 -> 1.02),
    // giving the immersive sensation of stepping through the arch into the resort without blowing up the scene.
    const desiredGlobalScale = 1.0 + p * 0.02
    const counterScale = desiredGlobalScale / Math.max(currentArchScale, 0.001)

    gsap.set(portalImage, {
      scale: counterScale,
      xPercent: -50,
      yPercent: -50,
      force3D: true,
    })
  }

  // Gentle initial entrance of the arch window on first load
  if (arch) {
    gsap.fromTo(
      arch,
      { scale: 0.94, opacity: 0.8 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: updatePortalImageScale,
      },
    )
  }
  if (scrollIndicator) {
    gsap.fromTo(
      scrollIndicator,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.35, ease: "power2.out" },
    )
  }

  // ScrollTrigger scrub:
  // Phase 1 (0.0 → 0.52): Curve expands, flattens out, full banner image fills screen.
  // Phase 2 (0.50 → 0.75): Once curve has disappeared, Header (logo) and Banner headings/copies/CTAs smoothly reveal.
  // Phase 3 (0.75 → 1.0): Full banner is showcased, then transitions cleanly into About.
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=170%",
      pin: true,
      scrub: 0.25,
      invalidateOnRefresh: true,
      pinSpacing: true,
    },
    onUpdate: updatePortalImageScale,
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

  // 4. Fade out terracotta backdrop to reveal the full panoramic banner
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

  // 5. ONCE SCROLLED AND CURVE DISAPPEARED: Reveal header (logo + nav + CTA)
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

  // Initialize scale position and keep updated on resize/refresh
  updatePortalImageScale()
  ScrollTrigger.addEventListener("refresh", updatePortalImageScale)
}
