import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { amenities } from "../data/amenities.js"
import { getLenis } from "./smooth.js"

gsap.registerPlugin(ScrollTrigger)

export function initAmenities() {
  const section = document.querySelector(".amenities")
  const stage = document.querySelector("[data-amenities-stage]")
  const root = document.querySelector("[data-amenities-carousel]")
  const track = document.querySelector("[data-amenities-track]")
  const prev = document.querySelector("[data-amenities-prev]")
  const next = document.querySelector("[data-amenities-next]")
  if (!section || !stage || !root || !track) return

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
  const intro = stage.querySelector(".amenities__intro")
  if (!cards.length) return

  let active = 0
  let tween = null
  let trigger = null
  let dragging = false
  let startX = 0
  let startScroll = 0

  const maxIndex = () => Math.max(0, cards.length - 1)

  const gap = () => {
    const styles = getComputedStyle(track)
    return Number.parseFloat(styles.columnGap || styles.gap || "36") || 36
  }

  /** Size cards to the free space under the intro so titles are never viewport-clipped */
  const fitCardsToStage = () => {
    const stageStyles = getComputedStyle(stage)
    const padTop = Number.parseFloat(stageStyles.paddingTop) || 0
    const padBottom = Number.parseFloat(stageStyles.paddingBottom) || 0
    const introHeight = intro?.getBoundingClientRect().height || 0
    const introGap = intro ? Number.parseFloat(getComputedStyle(intro).marginBottom) || 0 : 0
    const available = stage.clientHeight - padTop - padBottom - introHeight - introGap
    // Keep a small safety band so card shadows / title padding stay inside the stage
    const cardMax = Math.floor(Math.max(220, available - 16))
    stage.style.setProperty("--amenities-card-max-h", `${cardMax}px`)
    // Force layout with the new max height before measuring offsets
    void cards[0].offsetHeight
  }

  const measure = () => {
    const width = cards[0].getBoundingClientRect().width
    const height = cards[0].getBoundingClientRect().height
    const step = width + gap()
    const viewport = root.clientWidth
    const centerPad = Math.max(0, (viewport - width) / 2)
    const offsets = cards.map((_, index) => -(index * step) + centerPad)
    const travelX = Math.abs(offsets[maxIndex()] - offsets[0])
    return { width, height, step, viewport, centerPad, offsets, travelX }
  }

  const markActive = (index) => {
    active = Math.max(0, Math.min(maxIndex(), index))
    cards.forEach((card, i) => card.classList.toggle("is-active", i === active))
  }

  const updateFolds = () => {
    const viewportCenter = root.getBoundingClientRect().left + root.clientWidth / 2
    const width = Math.max(cards[0].getBoundingClientRect().width, 1)

    cards.forEach((card, index) => {
      const fold = folds[index]
      if (!fold) return
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const norm = (cardCenter - viewportCenter) / width
      const clamped = Math.max(-1.6, Math.min(1.6, norm))
      const abs = Math.abs(clamped)

      if (reduced) {
        gsap.set(fold, { rotateY: 0, scale: 1, z: 0, opacity: 1 })
        return
      }

      gsap.set(fold, {
        rotateY: clamped * -22,
        scale: 1 - Math.min(0.08, abs * 0.05),
        z: (1 - Math.min(1, abs)) * 48,
        opacity: 1 - Math.min(0.22, abs * 0.12),
        transformOrigin: clamped < -0.05 ? "right center" : clamped > 0.05 ? "left center" : "center center",
        force3D: true,
      })
    })
  }

  const setTrackX = (x) => {
    gsap.set(track, { x, force3D: true })
    const { offsets, step } = measure()
    const nearest = offsets.reduce(
      (best, offset, index) => {
        const dist = Math.abs(offset - x)
        return dist < best.dist ? { index, dist } : best
      },
      { index: 0, dist: Number.POSITIVE_INFINITY },
    )
    markActive(nearest.index)
    updateFolds()
  }

  /** Scroll runway from measured card geometry; hold final card fully before release */
  const TRAVEL_PORTION = 0.86

  const scrollDistance = () => {
    fitCardsToStage()
    const { step, height, travelX } = measure()
    const perCard = Math.max(step * 1.25, height * 1.35, window.innerHeight * 0.9)
    const travel = Math.max(travelX, maxIndex() * perCard)
    const settle = Math.max(step * 0.75, height * 0.6, window.innerHeight * 0.4)
    return Math.ceil(travel + settle)
  }

  const progressToX = (progress) => {
    const { offsets } = measure()
    const p = Math.max(0, Math.min(1, progress))
    const travelProgress = Math.min(1, p / TRAVEL_PORTION)
    const exact = travelProgress * maxIndex()
    const i0 = Math.floor(exact)
    const i1 = Math.min(maxIndex(), i0 + 1)
    const t = exact - i0
    return offsets[i0] + (offsets[i1] - offsets[i0]) * t
  }

  const scrollToIndex = (index) => {
    const clamped = Math.max(0, Math.min(maxIndex(), index))
    if (!trigger) {
      const { offsets } = measure()
      setTrackX(offsets[clamped])
      return
    }
    const pinProgress = maxIndex() === 0 ? 0 : (clamped / maxIndex()) * TRAVEL_PORTION
    const y = trigger.start + (trigger.end - trigger.start) * pinProgress
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 0.9 })
    else window.scrollTo({ top: y, behavior: "smooth" })
  }

  const setupScrollDrive = () => {
    tween?.scrollTrigger?.kill()
    tween?.kill()
    trigger?.kill()
    tween = null
    trigger = null

    fitCardsToStage()
    const { offsets } = measure()
    gsap.set(track, { x: offsets[0], force3D: true })
    markActive(0)
    updateFolds()

    if (reduced || maxIndex() === 0) return

    const proxy = { progress: 0 }
    tween = gsap.to(proxy, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: () => `+=${scrollDistance()}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        preventOverlaps: true,
        onRefreshInit: () => {
          fitCardsToStage()
        },
        onUpdate: (self) => {
          setTrackX(progressToX(self.progress))
        },
        onRefresh: (self) => {
          setTrackX(progressToX(self.progress))
        },
      },
    })

    trigger = tween.scrollTrigger
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  prev?.addEventListener("click", () => scrollToIndex(active - 1))
  next?.addEventListener("click", () => scrollToIndex(active + 1))

  const onPointerDown = (event) => {
    if (event.target.closest("button, a") || !trigger) return
    dragging = true
    root.classList.add("is-dragging")
    startX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
    startScroll = trigger.scroll()
  }

  const onPointerMove = (event) => {
    if (!dragging || !trigger) return
    const clientX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
    const { step } = measure()
    const deltaCards = (startX - clientX) / Math.max(step, 1)
    const progressDelta = maxIndex() === 0 ? 0 : (deltaCards / maxIndex()) * TRAVEL_PORTION
    const base = (startScroll - trigger.start) / Math.max(trigger.end - trigger.start, 1)
    const next = Math.max(0, Math.min(1, base + progressDelta))
    const y = trigger.start + (trigger.end - trigger.start) * next
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { immediate: true })
    else window.scrollTo({ top: y })
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
          scrollToIndex(index)
          return
        }
        cards.forEach((el) => el.classList.toggle("is-open", el === card && !card.classList.contains("is-open")))
      })
    })
  }

  let resizeTimer = 0
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        fitCardsToStage()
        if (trigger) ScrollTrigger.refresh()
        else {
          const { offsets } = measure()
          setTrackX(offsets[active])
        }
      }, 120)
    },
    { passive: true },
  )

  // Initial fit before first paint of the pin
  fitCardsToStage()

  // Keep folds fresh while idle / after transforms settle
  gsap.ticker.add(updateFolds)

  if (!reduced) {
    gsap.from(folds, {
      rotateY: (i) => (i === 0 ? 0 : i % 2 === 0 ? 26 : -26),
      opacity: 0.4,
      duration: 1.05,
      stagger: 0.05,
      ease: "power3.out",
      onComplete: updateFolds,
    })
  }

  let pinStarted = false
  const startPin = () => {
    if (pinStarted) return
    pinStarted = true
    setupScrollDrive()
  }

  if (document.documentElement.classList.contains("has-smooth-scroll")) {
    startPin()
  } else {
    window.addEventListener("clube:motion-ready", startPin, { once: true })
    window.setTimeout(startPin, 1600)
  }
}
