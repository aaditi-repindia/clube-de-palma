import gsap from "gsap"

const SESSION_KEY = "cdp-splash-seen"

export function initSplash({ onComplete } = {}) {
  const splash = document.getElementById("splash")
  const skip = document.getElementById("splash-skip")
  const fill = document.querySelector("[data-preloader-fill]")
  const label = document.querySelector("[data-preloader-label]")
  if (!splash) {
    onComplete?.()
    return
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const seen = sessionStorage.getItem(SESSION_KEY) === "1"

  const finish = () => {
    sessionStorage.setItem(SESSION_KEY, "1")
    const tl = gsap.timeline({
      onComplete: () => {
        splash.hidden = true
        splash.setAttribute("aria-hidden", "true")
        document.body.classList.remove("is-locked")
        onComplete?.()
      },
    })
    tl.to(splash, {
      autoAlpha: 0,
      duration: reduced ? 0.01 : 0.8,
      ease: "power2.inOut",
    })
    splash.classList.add("is-done")
  }

  if (seen || reduced) {
    splash.classList.add("is-done")
    splash.hidden = true
    splash.setAttribute("aria-hidden", "true")
    onComplete?.()
    return
  }

  document.body.classList.add("is-locked")
  skip?.addEventListener("click", finish, { once: true })

  const progress = { value: 0 }
  gsap.to(progress, {
    value: 100,
    duration: 2.1,
    ease: "power1.inOut",
    onUpdate: () => {
      const v = Math.round(progress.value)
      if (fill) gsap.set(fill, { scaleX: progress.value / 100 })
      if (label) label.textContent = `${v}%`
    },
    onComplete: finish,
  })

  // Soft logo / title entrance
  gsap.fromTo(
    ".splash__logo, .splash__mark, .splash__sub, .splash__progress",
    { autoAlpha: 0, y: 18 },
    { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" },
  )
}
