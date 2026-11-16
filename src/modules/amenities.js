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
  let x = 0
  let targetX = 0
  let dragging = false
  let startX = 0
  let startOffset = 0
  let raf = 0
  let pinTrigger = null
  let syncingScroll = false
  let ignoreScrub = false

  const gap = () => {
    const styles = getComputedStyle(track)
    return Number.parseFloat(styles.columnGap || styles.gap || "36") || 36
  }

  const trackPad = () => {
    const styles = getComputedStyle(track)
    return Number.parseFloat(styles.paddingInlineStart || styles.paddingLeft || "0") || 0
  }

  const cardWidth = () => cards[0]?.getBoundingClientRect().width || 360

  const cardStep = () => cardWidth() + gap()

  const offsetForIndex = (index) => {
    const centerPad = Math.max(0, (root.clientWidth - cardWidth()) / 2)
    // Track padding-inline offsets the first card; subtract it so cards truly center.
    return -(index * cardStep()) + centerPad - trackPad()
  }

  const maxIndex = () => Math.max(0, cards.length - 1)

  const travel = () => Math.abs(offsetForIndex(maxIndex()) - offsetForIndex(0))

  /** Extra scroll after the last card is centered so it stays fully on-screen before Membership enters. */
  const endBuffer = () => Math.max(window.innerHeight * 0.45, cardWidth() * 0.75)

  const scrollDistance = () => travel() + endBuffer()

  const offsetFromProgress = (progress) => {
    const start = offsetForIndex(0)
    const end = offsetForIndex(maxIndex())
    return start + (end - start) * gsap.utils.clamp(0, 1, progress)
  }

  const progressFromOffset = (value) => {
    const start = offsetForIndex(0)
    const end = offsetForIndex(maxIndex())
    const span = end - start
    if (Math.abs(span) < 1) return 0
    return gsap.utils.clamp(0, 1, (value - start) / span)
  }

  const setActive = (index, animate = true) => {
    active = Math.max(0, Math.min(maxIndex(), index))
    targetX = offsetForIndex(active)
    if (!animate || reduced) x = targetX
    cards.forEach((card, i) => card.classList.toggle("is-active", i === active))
  }

  const nearestIndex = (value) => {
    const centerPad = Math.max(0, (root.clientWidth - cardWidth()) / 2) - trackPad()
    const raw = (-value + centerPad) / cardStep()
    return Math.max(0, Math.min(maxIndex(), Math.round(raw)))
  }

  const scrollToProgress = (progress, immediate = false) => {
    if (!pinTrigger) return
    const start = pinTrigger.start
    const end = pinTrigger.end
    const y = start + (end - start) * gsap.utils.clamp(0, 1, progress)
    syncingScroll = true
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(y, { immediate, force: true, lock: false })
    } else {
      window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" })
    }
    window.requestAnimationFrame(() => {
      syncingScroll = false
    })
  }

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

      // Center stays flat; neighbours fold inward like pages
      const rotateY = clamped * -22
      const scale = 1 - Math.min(0.08, abs * 0.05)
      const z = (1 - Math.min(1, abs)) * 48
      const opacity = 1 - Math.min(0.22, abs * 0.12)
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

  const render = () => {
    gsap.set(track, { x, force3D: true })
    updateFolds()
  }

  const tick = () => {
    if (!dragging) {
      x += (targetX - x) * (reduced ? 1 : 0.14)
      if (Math.abs(targetX - x) < 0.2) x = targetX
      const live = nearestIndex(x)
      if (live !== active) {
        active = live
        cards.forEach((card, i) => card.classList.toggle("is-active", i === active))
      }
    }
    render()
    raf = requestAnimationFrame(tick)
  }

  const goToIndex = (index, { syncScroll = true } = {}) => {
    setActive(index)
    if (syncScroll && pinTrigger) {
      ignoreScrub = true
      scrollToProgress(index / Math.max(1, maxIndex()), false)
      window.setTimeout(() => {
        ignoreScrub = false
      }, 120)
    }
  }

  prev?.addEventListener("click", () => goToIndex(active - 1))
  next?.addEventListener("click", () => goToIndex(active + 1))

  const onPointerDown = (event) => {
    if (event.target.closest("button, a")) return
    dragging = true
    ignoreScrub = true
    root.classList.add("is-dragging")
    startX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
    startOffset = x
    targetX = x
  }

  const onPointerMove = (event) => {
    if (!dragging) return
    const clientX = event.clientX ?? event.touches?.[0]?.clientX ?? 0
    x = startOffset + (clientX - startX)
    targetX = x
  }

  const onPointerUp = () => {
    if (!dragging) return
    dragging = false
    root.classList.remove("is-dragging")
    const index = nearestIndex(x)
    setActive(index)
    if (pinTrigger) {
      scrollToProgress(index / Math.max(1, maxIndex()), true)
    }
    window.setTimeout(() => {
      ignoreScrub = false
    }, 80)
  }

  root.addEventListener("pointerdown", onPointerDown)
  window.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
  window.addEventListener("pointercancel", onPointerUp)

  // Horizontal trackpad pans still nudge the carousel; vertical wheel drives the pinned scrub.
  root.addEventListener(
    "wheel",
    (event) => {
      const mostlyHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      if (!mostlyHorizontal) return
      event.preventDefault()
      if (!pinTrigger) {
        targetX = targetX - event.deltaX * 1.05
        window.clearTimeout(root._snapTimer)
        root._snapTimer = window.setTimeout(() => goToIndex(nearestIndex(targetX)), 90)
        return
      }
      const start = offsetForIndex(0)
      const end = offsetForIndex(maxIndex())
      const next = gsap.utils.clamp(Math.min(start, end), Math.max(start, end), targetX - event.deltaX * 1.05)
      targetX = next
      ignoreScrub = true
      scrollToProgress(progressFromOffset(next), true)
      window.clearTimeout(root._snapTimer)
      root._snapTimer = window.setTimeout(() => {
        goToIndex(nearestIndex(targetX))
        ignoreScrub = false
      }, 90)
    },
    { passive: false },
  )

  if (!canHover) {
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const index = Number(card.dataset.index)
        if (index !== active) {
          goToIndex(index)
          return
        }
        cards.forEach((el) => el.classList.toggle("is-open", el === card && !card.classList.contains("is-open")))
      })
    })
  }

  const setupPin = () => {
    pinTrigger?.kill()
    pinTrigger = null

    if (reduced) {
      setActive(0, false)
      return
    }

    pinTrigger = ScrollTrigger.create({
      trigger: frame,
      start: "top top",
      end: () => `+=${scrollDistance()}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      pinSpacing: true,
      onUpdate: (self) => {
        if (dragging || ignoreScrub || syncingScroll) return
        // Hold the final card fully centered through the end buffer portion of the scrub.
        const travelRatio = travel() / Math.max(scrollDistance(), 1)
        const cardProgress = gsap.utils.clamp(0, 1, self.progress / Math.max(travelRatio, 0.0001))
        targetX = offsetFromProgress(cardProgress)
        if (Math.abs(targetX - x) > cardStep() * 0.85) x = targetX
      },
    })
  }

  setupPin()

  window.addEventListener(
    "resize",
    () => {
      setActive(active, false)
      render()
      ScrollTrigger.refresh()
    },
    { passive: true },
  )

  setActive(0, false)
  if (!reduced) {
    gsap.from(folds, {
      rotateY: (i) => (i === 0 ? 0 : i % 2 === 0 ? 26 : -26),
      opacity: 0.4,
      duration: 1.05,
      stagger: 0.05,
      ease: "power3.out",
      onComplete: () => {
        setActive(0, false)
        updateFolds()
        ScrollTrigger.refresh()
      },
    })
  }

  raf = requestAnimationFrame(tick)
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true })
}
