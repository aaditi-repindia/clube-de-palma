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

  track.innerHTML = amenities
    .map(
      (item, index) => `
      <article class="amenity-card" data-amenity-card data-index="${index}">
        <div class="amenity-card__fold" data-amenity-fold>
          <div class="amenity-card__media">
            <img src="${item.image}" alt="${item.alt}" width="1200" height="1600" loading="lazy" decoding="async" draggable="false" />
            <div class="amenity-card__scrim" aria-hidden="true"></div>
          </div>
          <div class="amenity-card__content">
            <h3 class="amenity-card__title">${item.name}</h3>
            <span class="amenity-card__rule" aria-hidden="true"></span>
            <p class="amenity-card__blurb">${item.blurb}</p>
          </div>
        </div>
      </article>`,
    )
    .join("")

  const cards = [...track.querySelectorAll("[data-amenity-card]")]
  const folds = cards.map((card) => card.querySelector("[data-amenity-fold]"))

  let active = 0
  let tween = null
  let dragging = false
  let startX = 0
  let startOffset = 0

  const cardWidth = () => cards[0]?.getBoundingClientRect().width || 420

  const gap = () => {
    const styles = getComputedStyle(track)
    return Number.parseFloat(styles.columnGap || styles.gap || "18") || 18
  }

  const cardStep = () => cardWidth() + gap()

  /**
   * Horizontal inset matching container margin so card 0 aligns with the section heading
   * at progress 0, and the last card sits at the right margin at progress 1.
   */
  const getSidePad = () => {
    const intro = document.querySelector(".amenities__intro")
    if (intro) {
      const left = Math.round(intro.getBoundingClientRect().left)
      if (left > 0) return left
    }
    const styles = getComputedStyle(document.documentElement)
    const fallbackPad = Number.parseFloat(styles.getPropertyValue("--section-pad-x")) || 24
    return fallbackPad
  }

  const syncSidePad = () => {
    const pad = getSidePad()
    track.style.setProperty("--amenities-side-pad", `${pad}px`)
  }

  /** Travel from first-card-aligned → last-card-aligned. */
  const maxTravel = () => Math.max(0, track.scrollWidth - root.clientWidth)

  const clampX = (value) => gsap.utils.clamp(-maxTravel(), 0, value)

  const progressFromX = (x) => {
    const travel = maxTravel()
    if (travel < 1) return 0
    return gsap.utils.clamp(0, 1, -x / travel)
  }

  const progressForIndex = (index) => {
    if (index <= 0) return 0
    if (index >= cards.length - 1) return 1
    const travel = maxTravel()
    if (travel < 1) return 0
    return gsap.utils.clamp(0, 1, (index * cardStep()) / travel)
  }

  /** Prefer the card closest to the active scroll position; pin ends to first/last card. */
  const activeFromViewport = () => {
    const progress = tween?.scrollTrigger?.progress ?? 0
    if (progress <= 0.02) return 0
    if (progress >= 0.98) return cards.length - 1

    const x = Math.abs(currentX())
    const index = Math.round(x / Math.max(cardStep(), 1))
    return gsap.utils.clamp(0, cards.length - 1, index)
  }

  const setActiveFromViewport = () => {
    const index = activeFromViewport()
    if (index === active) return
    active = index
    cards.forEach((card, i) => card.classList.toggle("is-active", i === active))
  }

  const currentX = () => Number(gsap.getProperty(track, "x")) || 0

  const updateFolds = () => {
    cards.forEach((card, index) => {
      const fold = folds[index]
      if (!fold) return
      gsap.set(fold, {
        rotateY: 0,
        scale: 1,
        z: 0,
        opacity: 1,
        clearProps: "transformOrigin",
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
    scrollToProgress(progressForIndex(next), { immediate: false })
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
          scrollToProgress(progressForIndex(index))
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

    syncSidePad()
    gsap.set(track, { x: 0, force3D: true })
    active = 0
    cards.forEach((card, i) => card.classList.toggle("is-active", i === 0))
    updateFolds()

    if (reduced) {
      syncSidePad()
      return
    }

    // Pin while the frame fills the viewport; travel spans first→last centred cards.
    // Lenis smooths the wheel — keep scrub short for a controlled, fluid feel.
    const travel = () => Math.max(maxTravel(), 1)
    tween = gsap.to(track, {
      x: () => -maxTravel(),
      ease: "none",
      scrollTrigger: {
        trigger: frame,
        start: "top top",
        end: () => `+=${travel()}`,
        pin: true,
        scrub: 0.3,
        invalidateOnRefresh: true,
        pinSpacing: true,
        onRefresh: () => syncSidePad(),
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
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.05,
      ease: "power3.out",
      onComplete: () => {
        updateFolds()
        ScrollTrigger.refresh()
      },
    })
  }

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true })
}
