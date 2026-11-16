import gsap from "gsap"
import { amenities } from "../data/amenities.js"

export function initAmenities() {
  const root = document.querySelector("[data-amenities-carousel]")
  const track = document.querySelector("[data-amenities-track]")
  const prev = document.querySelector("[data-amenities-prev]")
  const next = document.querySelector("[data-amenities-next]")
  if (!root || !track) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const canHover = window.matchMedia("(hover: hover)").matches

  track.innerHTML = amenities
    .map(
      (item, index) => `
      <article class="amenity-card" data-amenity-card style="--i: ${index}">
        <div class="amenity-card__fold" data-amenity-fold>
          <div class="amenity-card__media">
            <img src="${item.image}" alt="${item.alt}" width="1200" height="1600" loading="lazy" decoding="async" draggable="false" />
            <div class="amenity-card__scrim" aria-hidden="true"></div>
          </div>
          <div class="amenity-card__content">
            <h3 class="amenity-card__title">${item.name}</h3>
            <p class="amenity-card__blurb">${item.blurb}</p>
          </div>
        </div>
      </article>`,
    )
    .join("")

  const cards = [...track.querySelectorAll("[data-amenity-card]")]
  const folds = cards.map((card) => card.querySelector("[data-amenity-fold]"))

  let x = 0
  let targetX = 0
  let dragging = false
  let startX = 0
  let startOffset = 0
  let raf = 0

  const gap = () => {
    const styles = getComputedStyle(track)
    return Number.parseFloat(styles.columnGap || styles.gap || "28") || 28
  }

  const cardStep = () => {
    const first = cards[0]
    if (!first) return 320
    return first.getBoundingClientRect().width + gap()
  }

  const maxScroll = () => {
    const overflow = track.scrollWidth - root.clientWidth
    return Math.max(0, overflow + root.clientWidth * 0.08)
  }

  const clamp = (value) => Math.min(0, Math.max(-maxScroll(), value))

  const updateFolds = () => {
    if (reduced) {
      folds.forEach((fold) => {
        if (!fold) return
        gsap.set(fold, { rotateY: 0, rotateX: 0, scale: 1, transformOrigin: "center center" })
      })
      return
    }

    const viewportCenter = root.getBoundingClientRect().left + root.clientWidth / 2
    cards.forEach((card, index) => {
      const fold = folds[index]
      if (!fold) return
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const norm = (cardCenter - viewportCenter) / (root.clientWidth * 0.55)
      const clamped = Math.max(-1.35, Math.min(1.35, norm))
      const foldY = clamped * -28
      const foldX = Math.abs(clamped) * 4
      const scale = 1 - Math.min(0.08, Math.abs(clamped) * 0.06)
      const origin = clamped < 0 ? "right center" : "left center"

      gsap.set(fold, {
        rotateY: foldY,
        rotateX: foldX,
        scale,
        transformOrigin: origin,
        force3D: true,
      })
    })
  }

  const render = () => {
    gsap.set(track, { x })
    updateFolds()
  }

  const tick = () => {
    if (!dragging) {
      x += (targetX - x) * (reduced ? 1 : 0.12)
      if (Math.abs(targetX - x) < 0.15) x = targetX
    }
    render()
    raf = requestAnimationFrame(tick)
  }

  const goBy = (dir) => {
    targetX = clamp(targetX - dir * cardStep())
  }

  prev?.addEventListener("click", () => goBy(-1))
  next?.addEventListener("click", () => goBy(1))

  const onPointerDown = (event) => {
    dragging = true
    root.classList.add("is-dragging")
    startX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
    startOffset = x
    targetX = x
  }

  const onPointerMove = (event) => {
    if (!dragging) return
    const clientX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
    const delta = clientX - startX
    x = clamp(startOffset + delta)
    targetX = x
  }

  const onPointerUp = () => {
    if (!dragging) return
    dragging = false
    root.classList.remove("is-dragging")
    // Soft snap toward nearest card
    const step = cardStep()
    const nearest = Math.round(-targetX / step) * step
    targetX = clamp(-nearest)
  }

  root.addEventListener("pointerdown", onPointerDown)
  window.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
  window.addEventListener("pointercancel", onPointerUp)

  root.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && Math.abs(event.deltaY) < 8) return
      event.preventDefault()
      const delta = event.deltaY + event.deltaX
      targetX = clamp(targetX - delta * 1.05)
    },
    { passive: false },
  )

  // Touch-friendly: open blurbs on tap when hover is unavailable
  if (!canHover) {
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((el) => el.classList.toggle("is-open", el === card && !card.classList.contains("is-open")))
      })
    })
  }

  window.addEventListener(
    "resize",
    () => {
      targetX = clamp(targetX)
      x = clamp(x)
      render()
    },
    { passive: true },
  )

  // Gentle entrance flap
  if (!reduced) {
    gsap.from(folds, {
      rotateY: (i) => (i % 2 === 0 ? 18 : -18),
      opacity: 0.35,
      duration: 1.15,
      stagger: 0.06,
      ease: "power3.out",
      clearProps: "opacity",
      onComplete: updateFolds,
    })
  }

  raf = requestAnimationFrame(tick)
}
