import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { amenityCategories } from "../data/amenities.js"

gsap.registerPlugin(ScrollTrigger)

const OUT_DURATION = 0.52
const IN_DURATION = 0.64
const OVERLAP = 0.14
/** Subtle ease-out-back — refined depth, minimal bounce */
const TRANSFORM_EASE = "back.out(1.12)"
const OPACITY_EASE = "power1.inOut"

const checkIcon = `
  <span class="amenities-check" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="9.25" />
      <path d="m8.2 12.2 2.4 2.4 5.2-5.4" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>
`

const cardMarkup = (item, index) => {
  const layout = index % 2 === 0 ? "image-left" : "image-right"
  const features = Array.isArray(item.features) ? item.features : []

  return `
    <article class="amenities-panel amenities-panel--${layout}" data-amenities-panel>
      <div class="amenities-panel__shell" data-amenities-shell>
        <figure class="amenities-panel__media">
          <img
            src="${item.image}"
            alt="${item.alt}"
            width="1200"
            height="1500"
            loading="${index < 2 ? "eager" : "lazy"}"
            decoding="async"
          />
        </figure>
        <div class="amenities-panel__copy">
          <h2 class="amenities-panel__title">${item.name}</h2>
          <p class="amenities-panel__blurb">${item.blurb}</p>
          ${
            features.length
              ? `<ul class="amenities-panel__features">
                  ${features
                    .map(
                      (feature) => `
                    <li>
                      ${checkIcon}
                      <span>${feature}</span>
                    </li>`,
                    )
                    .join("")}
                </ul>`
              : ""
          }
        </div>
      </div>
    </article>
  `
}

const categoryIndex = (categoryId) =>
  Math.max(
    0,
    amenityCategories.findIndex((category) => category.id === categoryId),
  )

const navOffset = () => {
  const header = document.getElementById("site-header")
  return (header?.offsetHeight || 92) + 12
}

export function initAmenitiesTabs() {
  const root = document.querySelector("[data-amenities-tabs]")
  const tablist = document.querySelector("[data-amenities-tablist]")
  const panels = document.querySelector("[data-amenities-panels]")
  if (!root || !tablist || !panels || !amenityCategories.length) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  let activeId = amenityCategories[0].id
  let animating = false
  let pendingId = null
  let activeTimeline = null
  let activeLayer = null
  let stackTriggers = []

  tablist.innerHTML = amenityCategories
    .map(
      (category, index) => `
      <button
        class="amenities-tabs__tab${index === 0 ? " is-active" : ""}"
        type="button"
        role="tab"
        id="amenities-tab-${category.id}"
        aria-controls="amenities-panel-${category.id}"
        aria-selected="${index === 0 ? "true" : "false"}"
        tabindex="${index === 0 ? "0" : "-1"}"
        data-amenities-tab="${category.id}"
      >
        ${category.label}
      </button>`,
    )
    .join("")

  const createLayer = (categoryId) => {
    const category = amenityCategories.find((item) => item.id === categoryId) || amenityCategories[0]
    const layer = document.createElement("div")
    layer.className = "amenities-panels__layer"
    layer.id = `amenities-panel-${category.id}`
    layer.setAttribute("role", "tabpanel")
    layer.setAttribute("aria-labelledby", `amenities-tab-${category.id}`)
    layer.dataset.amenitiesLayer = category.id
    layer.innerHTML = category.items.map((item, index) => cardMarkup(item, index)).join("")
    return layer
  }

  const setActiveTab = (categoryId) => {
    tablist.querySelectorAll("[data-amenities-tab]").forEach((tab) => {
      const selected = tab.dataset.amenitiesTab === categoryId
      tab.classList.toggle("is-active", selected)
      tab.setAttribute("aria-selected", selected ? "true" : "false")
      tab.tabIndex = selected ? 0 : -1
    })
  }

  const clearMotionProps = (targets) => {
    gsap.set(targets, { clearProps: "transform,opacity,visibility,filter" })
  }

  const killStack = () => {
    stackTriggers.forEach((trigger) => trigger?.kill?.())
    stackTriggers = []
    if (activeLayer) {
      const shells = activeLayer.querySelectorAll("[data-amenities-shell]")
      clearMotionProps(shells)
    }
  }

  /**
   * Tidescape-inspired sticky handoff (CSS sticky + scrubbed compress):
   * each card sticks under the header; as the next arrives the active shell
   * scales down and fades out so the next expands into the active position.
   */
  const setupScrollStack = (layer) => {
    killStack()
    layer.style.setProperty("--amenities-stick-top", `${navOffset()}px`)

    const cards = [...layer.querySelectorAll("[data-amenities-panel]")]
    cards.forEach((card, index) => {
      card.classList.add("is-stackable")
      card.style.setProperty("--amenities-stack-z", String(index + 1))
    })

    if (reduced || cards.length < 2) return

    cards.forEach((card, index) => {
      const shell = card.querySelector("[data-amenities-shell]") || card
      const next = cards[index + 1]
      gsap.set(shell, { transformOrigin: "50% 0%", force3D: true })
      if (!next) return

      // Connected disappear: compress + fade before the next card fully sticks
      const handoff = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: next,
          start: () => `top bottom-=10%`,
          end: () => `top top+=${navOffset()}`,
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      })

      handoff.fromTo(
        shell,
        { scale: 1, autoAlpha: 1, y: 0 },
        {
          scale: 0.96,
          autoAlpha: 0.28,
          y: -10,
          duration: 0.42,
          immediateRender: false,
        },
        0,
      )
      handoff.to(
        shell,
        {
          scale: 0.93,
          autoAlpha: 0,
          y: -18,
          duration: 0.58,
        },
        0.42,
      )

      stackTriggers.push(handoff.scrollTrigger)
    })

    ScrollTrigger.refresh()
  }

  const finishTransition = (nextLayer, categoryId) => {
    activeTimeline?.kill()
    activeTimeline = null

    panels.querySelectorAll("[data-amenities-layer]").forEach((layer) => {
      if (layer !== nextLayer) layer.remove()
    })

    nextLayer.classList.remove("is-entering", "is-leaving")
    nextLayer.classList.add("is-active")
    const shells = [
      nextLayer,
      ...nextLayer.querySelectorAll("[data-amenities-shell], [data-amenities-panel]"),
    ]
    clearMotionProps(shells)
    panels.style.minHeight = ""
    activeLayer = nextLayer
    activeId = categoryId
    animating = false

    const nextPending = pendingId && pendingId !== activeId ? pendingId : null
    pendingId = null

    if (nextPending) {
      swapCategory(nextPending)
      return
    }

    requestAnimationFrame(() => {
      if (activeLayer !== nextLayer) return
      setupScrollStack(nextLayer)
      ScrollTrigger.refresh()
    })
  }

  const swapCategory = (categoryId) => {
    if (!categoryId || categoryId === activeId) return

    if (animating) {
      pendingId = categoryId
      setActiveTab(categoryId)
      return
    }

    const leavingLayer = activeLayer || panels.querySelector("[data-amenities-layer]")
    const direction = categoryIndex(categoryId) >= categoryIndex(activeId) ? 1 : -1
    const leaveY = direction > 0 ? -26 : 26
    const enterY = direction > 0 ? 34 : -34

    animating = true
    pendingId = null
    setActiveTab(categoryId)
    killStack()

    const nextLayer = createLayer(categoryId)
    const stageHeight = Math.max(panels.offsetHeight, leavingLayer?.offsetHeight || 0)
    if (stageHeight) panels.style.minHeight = `${stageHeight}px`

    if (leavingLayer) {
      leavingLayer.classList.remove("is-active", "is-entering")
      leavingLayer.classList.add("is-leaving")
    }

    nextLayer.classList.add("is-entering")
    panels.appendChild(nextLayer)

    const leavingShells = leavingLayer
      ? [...leavingLayer.querySelectorAll("[data-amenities-shell]")]
      : []
    const enteringShells = [...nextLayer.querySelectorAll("[data-amenities-shell]")]

    if (reduced) {
      if (leavingLayer) leavingLayer.remove()
      gsap.set([nextLayer, ...enteringShells], { autoAlpha: 1, y: 0, scale: 1 })
      finishTransition(nextLayer, categoryId)
      return
    }

    gsap.set(nextLayer, { autoAlpha: 1 })
    gsap.set(enteringShells, {
      autoAlpha: 0,
      y: enterY,
      scale: 0.92,
      transformOrigin: "50% 50%",
      force3D: true,
    })
    if (leavingShells.length) {
      gsap.set(leavingShells, { transformOrigin: "50% 0%", force3D: true })
    }

    activeTimeline?.kill()
    activeTimeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => finishTransition(nextLayer, categoryId),
    })

    // Outgoing: disappear with connected scale + fade (ease-out-back feel via soft back)
    if (leavingShells.length) {
      activeTimeline.to(
        leavingShells,
        {
          scale: 0.92,
          y: leaveY,
          duration: OUT_DURATION,
          stagger: { each: 0.045, from: direction > 0 ? "start" : "end" },
          ease: TRANSFORM_EASE,
        },
        0,
      )
      activeTimeline.to(
        leavingShells,
        {
          autoAlpha: 0,
          duration: OUT_DURATION,
          stagger: { each: 0.045, from: direction > 0 ? "start" : "end" },
          ease: OPACITY_EASE,
        },
        0,
      )
    }

    const enterAt = leavingShells.length ? Math.max(0, OUT_DURATION - OVERLAP) : 0

    // Incoming: move into place and expand
    activeTimeline.to(
      enteringShells,
      {
        scale: 1,
        y: 0,
        duration: IN_DURATION,
        stagger: { each: 0.055, from: direction > 0 ? "start" : "end" },
        ease: TRANSFORM_EASE,
      },
      enterAt,
    )
    activeTimeline.to(
      enteringShells,
      {
        autoAlpha: 1,
        duration: IN_DURATION,
        stagger: { each: 0.055, from: direction > 0 ? "start" : "end" },
        ease: OPACITY_EASE,
      },
      enterAt,
    )
  }

  tablist.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-amenities-tab]")
    if (!tab) return
    swapCategory(tab.dataset.amenitiesTab)
  })

  tablist.addEventListener("keydown", (event) => {
    const tabs = [...tablist.querySelectorAll("[data-amenities-tab]")]
    const current = tabs.findIndex((tab) => tab.classList.contains("is-active"))
    if (current < 0) return

    let next = current
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % tabs.length
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = tabs.length - 1
    else return

    event.preventDefault()
    tabs[next].focus()
    swapCategory(tabs[next].dataset.amenitiesTab)
  })

  activeLayer = createLayer(activeId)
  activeLayer.classList.add("is-active")
  panels.appendChild(activeLayer)

  if (reduced) {
    setupScrollStack(activeLayer)
    return
  }

  const firstShells = [...activeLayer.querySelectorAll("[data-amenities-shell]")]
  gsap.fromTo(
    firstShells,
    { autoAlpha: 0, y: 28, scale: 0.94, transformOrigin: "50% 50%" },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.05,
      ease: TRANSFORM_EASE,
      onComplete: () => {
        clearMotionProps(firstShells)
        setupScrollStack(activeLayer)
      },
    },
  )

  window.addEventListener(
    "resize",
    () => {
      ScrollTrigger.refresh()
    },
    { passive: true },
  )
}
