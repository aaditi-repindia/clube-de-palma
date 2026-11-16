import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { amenities } from "../data/amenities.js"
import { getLenis } from "./smooth.js"

gsap.registerPlugin(ScrollTrigger)

export function initAmenities() {
  const section = document.querySelector("[data-amenities-section]")
  const frame = document.querySelector("[data-amenities-frame]")
  const root = document.querySelector("[data-amenities-carousel]")
  const track = document.querySelector("[data-amenities-track]")
  const prev = document.querySelector("[data-amenities-prev]")
  const next = document.querySelector("[data-amenities-next]")
  if (!section || !frame || !root || !track) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const canHover = window.matchMedia("(hover: hover)").matches
  const total = amenities.length

  track.innerHTML = amenities
    .map((item, index) => {
      const n = String(index + 1).padStart(2, "0")
      const totalLabel = String(total).padStart(2, "0")
      return `
      <article class="amenity-card" data-amenity-card data-index="${index}">
        <div class="amenity-card__fold" data-amenity-fold>
          <div class="amenity-card__media">
            <img src="${item.image}" alt="${item.alt}" width="1200" height="1600" loading="lazy" decoding="async" draggable="false" />
            <div class="amenity-card__scrim" aria-hidden="true"></div>
          </div>
          <p class="amenity-card__index" aria-hidden="true">${n} / ${totalLabel}</p>
          <p class="amenity-card__watermark" aria-hidden="true">${n}</p>
          <div class="amenity-card__content">
            <h3 class="amenity-card__title">${item.name}</h3>
            <span class="amenity-card__rule" aria-hidden="true"></span>
            <p class="amenity-card__blurb">${item.blurb}</p>
          </div>
        </div>
      </article>`
    })
    .join("")

  const cards = [...track.querySelectorAll("[data-amenity-card]")]
  const folds = cards.map((card) => card.querySelector("[data-amenity-fold]"))

  let active = 0
  let tween = null
  let dragging = false
  let startX = 0
  let startOffset = 0

  const cardWidth = () => cards[0]?.getBoundingClientRect().width || 360

  const gap = () => {
    const styles = getComputedStyle(track)
    return Number.parseFloat(styles.columnGap || styles.gap || "36") || 36
  }

  const cardStep = () => cardWidth() + gap()

  /** Travel until the last card is flush with the right edge — no trailing blank strip. */
  const maxTravel = () => Math.max(0, track.scrollWidth - root.clientWidth)

  const clampX = (value) => gsap.utils.clamp(-maxTravel(), 0, value)

  const progressFromX = (x) => {
    const travel = maxTravel()
    if (travel < 1) return 0
    return gsap.utils.clamp(0, 1, -x / travel)
  }

  /** Prefer the card closest to the viewport center; pin ends to first/last card. */
  const activeFromViewport = () => {
    const progress = tween?.scrollTrigger?.progress ?? 0
    if (progress <= 0.02) return 0
    if (progress >= 0.98) return cards.length - 1

    const center = root.getBoundingClientRect().left + root.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect()
      const dist = Math.abs(rect.left + rect.width / 2 - center)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    return best
  }

  const setActiveFromViewport = () => {
    const index = activeFromViewport()
    if (index === active) return
    active = index
    cards.forEach((card, i) => card.classList.toggle("is-active", i === active))
  }

  const currentX = () => Number(gsap.getProperty(track, "x")) || 0

  const updateFolds = () => {
    const viewportCenter = root.getBoundingClientRect().left + root.clientWidth / 2

    cards.forEach((card, index) => {
      const fold = folds[index]
      if (!fold) return
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const norm = (cardCenter - viewportCenter) / Math.max(cardWidth(), 1)
      const clamped = Math.max(-1.6, Math.min(1.6, norm))
      const abs = Math.abs(clamped)

      if (reduced) {
        gsap.set(fold, { rotateY: 0, scale: 1, x: 0, z: 0, opacity: 1 })
        return
      }

      const rotateY = clamped * -18
      const scale = 1 - Math.min(0.06, abs * 0.04)
      const z = (1 - Math.min(1, abs)) * 36
      const opacity = 1 - Math.min(0.18, abs * 0.1)
      const origin = clamped < -0.05 ? "right center" : clamped > 0.05 ? "left center" : "center center"

      gsap.set(fold, {
        rotateY,
        scale,
        z,
        opacity,
        transformOrigin: origin,
        force3D: true,
      })
    })
  }

  const scrollToProgress = (progress, { immediate = false } = {}) => {
    const st = tween?.scrollTrigger
    if (!st) return
    const y = st.start + (st.end - st.start) * gsap.utils.clamp(0, 1, progress)
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(y, { immediate, force: true })
    } else {
      window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" })
    }
  }

  const goBy = (dir) => {
    const next = gsap.utils.clamp(0, cards.length - 1, active + dir)
    const travel = maxTravel()
    const target = travel < 1 ? 0 : gsap.utils.clamp(0, 1, (next * cardStep()) / travel)
    scrollToProgress(target, { immediate: false })
  }

  prev?.addEventListener("click", () => goBy(-1))
  next?.addEventListener("click", () => goBy(1))

  const onPointerDown = (event) => {
    if (event.target.closest("button, a")) return
    dragging = true
    root.classList.add("is-dragging")
    startX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
    startOffset = currentX()
  }

  const onPointerMove = (event) => {
    if (!dragging) return
    const clientX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
    const next = clampX(startOffset + (clientX - startX))
    // Drive page scroll so the scrub tween stays the single source of truth (no dual-animation jerk).
    scrollToProgress(progressFromX(next), { immediate: true })
    setActiveFromViewport()
    updateFolds()
  }

  const onPointerUp = () => {
    if (!dragging) return
    dragging = false
    root.classList.remove("is-dragging")
  }

  root.addEventListener("pointerdown", onPointerDown)
  window.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
  window.addEventListener("pointercancel", onPointerUp)

  if (!canHover) {
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const index = Number(card.dataset.index)
        if (index !== active) {
          const travel = maxTravel()
          const target = travel < 1 ? 0 : gsap.utils.clamp(0, 1, (index * cardStep()) / travel)
          scrollToProgress(target)
          return
        }
        cards.forEach((el) => el.classList.toggle("is-open", el === card && !card.classList.contains("is-open")))
      })
    })
  }

  const setupPin = () => {
    tween?.scrollTrigger?.kill()
    tween?.kill()
    tween = null

    gsap.set(track, { x: 0, force3D: true })
    active = 0
    cards.forEach((card, i) => card.classList.toggle("is-active", i === 0))
    updateFolds()

    if (reduced) return

    // Pin at 100vh; vertical scroll scrubs the track edge-to-edge.
    // Lenis already smooths scroll — keep scrub tight to avoid laggy/jerky catch-up.
    tween = gsap.to(track, {
      x: () => -maxTravel(),
      ease: "none",
      scrollTrigger: {
        trigger: frame,
        start: "top top",
        end: () => `+=${Math.max(maxTravel(), window.innerHeight * 0.75)}`,
        pin: true,
        scrub: 0.35,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        pinSpacing: true,
        onUpdate: () => {
          setActiveFromViewport()
          updateFolds()
        },
      },
    })
  }

  setupPin()

  let resizeTimer = 0
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        setupPin()
        ScrollTrigger.refresh()
      }, 120)
    },
    { passive: true },
  )

  if (!reduced) {
    gsap.from(folds, {
      rotateY: (i) => (i === 0 ? 0 : i % 2 === 0 ? 22 : -22),
      opacity: 0.45,
      duration: 0.95,
      stagger: 0.045,
      ease: "power3.out",
      onComplete: () => {
        updateFolds()
        ScrollTrigger.refresh()
      },
    })
  }

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true })
}
