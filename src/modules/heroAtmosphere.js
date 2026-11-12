import gsap from "gsap"

/** Era-like atmosphere crossfade (day/night), expressed in Dynamix club photography */
export function initHeroAtmosphere() {
  const root = document.querySelector("[data-hero-atmosphere]")
  if (!root) return

  const panes = [...root.querySelectorAll("[data-atmosphere-pane]")]
  const tabs = [...document.querySelectorAll("[data-atmosphere-tab]")]
  if (!panes.length || !tabs.length) return

  let active = tabs[0]?.dataset.atmosphereTab || panes[0].dataset.atmospherePane

  const show = (key) => {
    active = key
    tabs.forEach((tab) => {
      const on = tab.dataset.atmosphereTab === key
      tab.setAttribute("aria-selected", String(on))
      tab.classList.toggle("is-active", on)
    })
    panes.forEach((pane) => {
      const on = pane.dataset.atmospherePane === key
      gsap.to(pane, {
        autoAlpha: on ? 1 : 0,
        scale: on ? 1 : 1.04,
        duration: 1.1,
        ease: "power2.inOut",
        overwrite: "auto",
      })
    })
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => show(tab.dataset.atmosphereTab))
  })

  // Initial state
  panes.forEach((pane, index) => {
    gsap.set(pane, {
      autoAlpha: pane.dataset.atmospherePane === active ? 1 : 0,
      scale: pane.dataset.atmospherePane === active ? 1 : 1.04,
    })
    if (index === 0) pane.style.zIndex = "1"
  })
  show(active)

  // Subtle idle drift while hero is in view (skipped if reduced motion)
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    panes.forEach((pane) => {
      gsap.to(pane.querySelector("img"), {
        scale: 1.06,
        duration: 12,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    })
  }
}
