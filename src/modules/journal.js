import gsap from "gsap"
import { journalItems } from "../data/journal.js"

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function ctaAttrs(cta) {
  if (cta.external) {
    return `href="${escapeHtml(cta.href)}" target="_blank" rel="noopener noreferrer"`
  }
  return `href="${escapeHtml(cta.href)}"`
}

function cardMarkup(item, index) {
  const date = item.dateLabel
    ? `<span class="journal-card__date">${escapeHtml(item.dateLabel)}</span>`
    : ""
  const placeholder = item.placeholder
    ? `<span class="placeholder-tag">CMS placeholder</span>`
    : ""

  return `
    <article class="journal-card" data-journal-card data-index="${index}">
      <div class="journal-card__media">
        <img
          src="${escapeHtml(item.image)}"
          alt="${escapeHtml(item.imageAlt || "")}"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
      <div class="journal-card__body">
        <div class="journal-card__meta">
          <span class="journal-card__label">${escapeHtml(item.label)}</span>
          ${date}
          ${placeholder}
        </div>
        <h3 class="journal-card__title">${escapeHtml(item.title)}</h3>
        <p class="journal-card__copy">${escapeHtml(item.description)}</p>
        <a class="journal-card__cta" ${ctaAttrs(item.cta)}>
          ${escapeHtml(item.cta.label)}
          <span class="btn__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>`
}

export function initJournal() {
  const root = document.querySelector("[data-journal-carousel]")
  const track = document.querySelector("[data-journal-track]")
  const prev = document.querySelector("[data-journal-prev]")
  const next = document.querySelector("[data-journal-next]")
  const controls = document.querySelector("[data-journal-controls]")
  if (!root || !track) return

  const items = journalItems.filter(Boolean)
  if (!items.length) {
    track.innerHTML = ""
    root.hidden = true
    controls?.setAttribute("hidden", "")
    return
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  track.innerHTML = items.map(cardMarkup).join("")
  root.dataset.count = String(items.length)
  root.classList.toggle("is-single", items.length === 1)

  const cards = [...track.querySelectorAll("[data-journal-card]")]
  let index = 0
  let tween = null
  let dragging = false
  let moved = false
  let startX = 0
  let startOffset = 0

  const viewport = root.querySelector(".journal-carousel__viewport")

  const gap = () => {
    const styles = getComputedStyle(track)
    return Number.parseFloat(styles.columnGap || styles.gap || "24") || 24
  }

  const cardWidth = () => cards[0]?.getBoundingClientRect().width || 0
  const step = () => cardWidth() + gap()
  const maxIndex = () => Math.max(0, cards.length - 1)
  /** End flush keeps a peek of the previous card instead of empty right space. */
  const maxTravel = () =>
    Math.max(0, (viewport?.clientWidth ? track.scrollWidth - viewport.clientWidth : maxIndex() * step()))
  const currentX = () => Number.parseFloat(gsap.getProperty(track, "x")) || 0
  const clampX = (value) => gsap.utils.clamp(-maxTravel(), 0, value)

  const xForIndex = (i) => {
    const clamped = gsap.utils.clamp(0, maxIndex(), i)
    if (clamped >= maxIndex()) return -maxTravel()
    return -clamped * step()
  }

  const syncNav = () => {
    const atStart = index <= 0
    const atEnd = index >= maxIndex()
    if (prev) {
      prev.disabled = atStart
      prev.setAttribute("aria-disabled", String(atStart))
    }
    if (next) {
      next.disabled = atEnd
      next.setAttribute("aria-disabled", String(atEnd))
    }
    if (controls) {
      controls.hidden = cards.length < 2
    }
    cards.forEach((card, i) => card.classList.toggle("is-active", i === index))
  }

  const goTo = (nextIndex, { immediate = false } = {}) => {
    index = gsap.utils.clamp(0, maxIndex(), nextIndex)
    const x = xForIndex(index)
    tween?.kill()
    if (immediate || reduced) {
      gsap.set(track, { x })
      syncNav()
      return
    }
    tween = gsap.to(track, {
      x,
      duration: 0.72,
      ease: "power3.out",
      onUpdate: syncNav,
      onComplete: syncNav,
    })
    syncNav()
  }

  const nearestIndex = (x = currentX()) => {
    if (step() < 1) return 0
    const travel = maxTravel()
    if (travel > 0 && -x >= travel - 8) return maxIndex()
    return gsap.utils.clamp(0, maxIndex(), Math.round(-x / step()))
  }

  prev?.addEventListener("click", () => goTo(index - 1))
  next?.addEventListener("click", () => goTo(index + 1))

  const onPointerDown = (event) => {
    if (cards.length < 2) return
    if (event.target.closest("a, button")) return
    dragging = true
    moved = false
    root.classList.add("is-dragging")
    startX = event.clientX
    startOffset = currentX()
    tween?.kill()
    try {
      root.setPointerCapture(event.pointerId)
    } catch {
      /* ignore capture failures */
    }
  }

  const onPointerMove = (event) => {
    if (!dragging) return
    const delta = event.clientX - startX
    if (Math.abs(delta) > 6) moved = true
    gsap.set(track, { x: clampX(startOffset + delta) })
  }

  const onPointerUp = (event) => {
    if (!dragging) return
    dragging = false
    root.classList.remove("is-dragging")
    try {
      root.releasePointerCapture(event.pointerId)
    } catch {
      /* ignore */
    }

    const delta = event.clientX - startX
    if (moved && Math.abs(delta) > 48) {
      goTo(index + (delta < 0 ? 1 : -1))
    } else {
      goTo(nearestIndex())
    }
  }

  root.addEventListener("pointerdown", onPointerDown)
  root.addEventListener("pointermove", onPointerMove)
  root.addEventListener("pointerup", onPointerUp)
  root.addEventListener("pointercancel", onPointerUp)

  root.addEventListener(
    "click",
    (event) => {
      if (moved && event.target.closest("a")) {
        event.preventDefault()
      }
      moved = false
    },
    true,
  )

  let resizeTimer = 0
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => goTo(index, { immediate: true }), 120)
    },
    { passive: true },
  )

  goTo(0, { immediate: true })
}
