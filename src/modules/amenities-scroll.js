import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { amenities } from "../data/amenities.js"
import { initSmoothScroll } from "./smooth.js"

gsap.registerPlugin(ScrollTrigger)

const pad = (index) => String(index + 1).padStart(2, "0")

const collapsedMarkup = (item, index) => `
  <div class="amenities-edge">
    <span class="amenities-edge__index">${pad(index)}</span>
    <p class="amenities-edge__name">${item.name}</p>
  </div>
`

const activeMarkup = (item, index) => `
  <article class="amenities-feature">
    <div class="amenities-feature__top">
      <span class="amenities-feature__index">${pad(index)}</span>
      <h2 class="amenities-feature__name">${item.name}</h2>
    </div>
    <div class="amenities-feature__body">
      <figure class="amenities-feature__media">
        <img src="${item.image}" alt="${item.alt}" width="1200" height="1500" decoding="async" />
      </figure>
      <div class="amenities-feature__copy">
        <p class="amenities-feature__lead">${item.blurb}</p>
        ${item.detail ? `<p class="amenities-feature__detail">${item.detail}</p>` : ""}
      </div>
    </div>
  </article>
`

export function initAmenitiesScroll() {
  const section = document.querySelector("[data-amenities-accordion]")
  const pin = document.querySelector("[data-amenities-pin]")
  const stage = document.querySelector("[data-amenities-stage]")
  const prevSlot = document.querySelector('[data-slot="prev"]')
  const activeSlot = document.querySelector('[data-slot="active"]')
  const nextSlot = document.querySelector('[data-slot="next"]')
  if (!section || !pin || !stage || !prevSlot || !activeSlot || !nextSlot) return
  if (!amenities.length) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let active = 0
  let tween = null

  const renderSlots = (index, { animate = true } = {}) => {
    const next = Math.max(0, Math.min(amenities.length - 1, index))
    if (next === active && activeSlot.innerHTML) return

    const prevItem = next > 0 ? amenities[next - 1] : null
    const activeItem = amenities[next]
    const nextItem = next < amenities.length - 1 ? amenities[next + 1] : null

    prevSlot.innerHTML = prevItem ? collapsedMarkup(prevItem, next - 1) : ""
    prevSlot.classList.toggle("is-empty", !prevItem)
    activeSlot.innerHTML = activeMarkup(activeItem, next)
    nextSlot.innerHTML = nextItem ? collapsedMarkup(nextItem, next + 1) : ""
    nextSlot.classList.toggle("is-empty", !nextItem)
    active = next

    tween?.kill()

    if (!animate || reduced) {
      gsap.set([prevSlot, activeSlot, nextSlot], { autoAlpha: 1, y: 0 })
      return
    }

    tween = gsap.fromTo(
      [prevSlot, activeSlot, nextSlot],
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.045,
        overwrite: true,
      },
    )
  }

  initSmoothScroll()
  renderSlots(0, { animate: false })

  if (reduced) return

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${Math.max(amenities.length, 1) * window.innerHeight}`,
    pin: pin,
    pinSpacing: true,
    scrub: 0.55,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const segments = amenities.length
      const index = Math.min(segments - 1, Math.floor(self.progress * segments + 0.0001))
      renderSlots(index)
    },
  })

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true })
  requestAnimationFrame(() => ScrollTrigger.refresh())
}
