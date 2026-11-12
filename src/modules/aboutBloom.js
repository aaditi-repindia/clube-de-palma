import gsap from "gsap"

const STAGES = [
  "/assets/images/blooms/jasmine-bud.png",
  "/assets/images/blooms/jasmine-opening.png",
  "/assets/images/blooms/jasmine-open.png",
]

/** Soft frame positions — small blooms around the edges, not the center */
const BLOOM_SPOTS = [
  { x: "7%", y: "11%", size: 3.1, delay: 0, rotate: -12 },
  { x: "20%", y: "5%", size: 2.4, delay: 0.8, rotate: 8 },
  { x: "86%", y: "9%", size: 2.8, delay: 1.5, rotate: 14 },
  { x: "94%", y: "26%", size: 2.2, delay: 2.2, rotate: -6 },
  { x: "6%", y: "70%", size: 2.6, delay: 1.2, rotate: 10 },
  { x: "4%", y: "40%", size: 2.1, delay: 2.9, rotate: -18 },
  { x: "78%", y: "90%", size: 3.2, delay: 0.5, rotate: 6 },
  { x: "93%", y: "76%", size: 2.7, delay: 1.9, rotate: -10 },
  { x: "58%", y: "95%", size: 2.3, delay: 2.6, rotate: 16 },
  { x: "40%", y: "4%", size: 2.0, delay: 3.3, rotate: -4 },
]

function createBloom(spot) {
  const el = document.createElement("span")
  el.className = "about__bloom"
  el.style.setProperty("--bloom-x", spot.x)
  el.style.setProperty("--bloom-y", spot.y)
  el.style.setProperty("--bloom-size", `${spot.size}rem`)
  el.style.setProperty("--bloom-rotate", `${spot.rotate}deg`)

  STAGES.forEach((src, index) => {
    const img = document.createElement("img")
    img.src = src
    img.alt = ""
    img.decoding = "async"
    img.draggable = false
    img.className = `about__bloom-stage about__bloom-stage--${index}`
    img.setAttribute("aria-hidden", "true")
    el.appendChild(img)
  })

  return { el, delay: spot.delay }
}

function animateBloom(el, delay) {
  const stages = el.querySelectorAll(".about__bloom-stage")
  if (stages.length < 3) return

  gsap.set(stages, { opacity: 0, scale: 0.72 })
  gsap.set(stages[0], { opacity: 0.55, scale: 0.82 })

  const tl = gsap.timeline({
    repeat: -1,
    defaults: { ease: "sine.inOut" },
    delay,
  })

  // Bud → opening
  tl.to(stages[0], { opacity: 0.2, scale: 0.95, duration: 2.4 }, 0)
    .to(stages[1], { opacity: 0.85, scale: 1, duration: 2.4 }, 0)

    // Opening → open blossom
    .to(stages[1], { opacity: 0.15, scale: 1.04, duration: 2.6 }, 2.2)
    .to(stages[2], { opacity: 1, scale: 1.08, duration: 2.6 }, 2.2)

    // Soft hold + organic sway
    .to(
      el,
      {
        rotate: "+=3",
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      },
      3.2,
    )

    // Open → gently settle back toward bud for seamless loop
    .to(stages[2], { opacity: 0.12, scale: 0.9, duration: 2.8 }, 6.4)
    .to(stages[1], { opacity: 0.35, scale: 0.86, duration: 2.4 }, 6.6)
    .to(stages[0], { opacity: 0.55, scale: 0.82, duration: 2.6 }, 7.0)
    .to(stages[1], { opacity: 0, scale: 0.78, duration: 1.8 }, 8.2)

  // Continuous micro-breath on the whole bloom
  gsap.to(el, {
    scale: 1.04,
    duration: 4.8 + delay * 0.15,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  })
}

export function initAboutBloom() {
  const section = document.getElementById("about")
  if (!section) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const layer = document.createElement("div")
  layer.className = "about__blooms"
  layer.setAttribute("aria-hidden", "true")

  const blooms = BLOOM_SPOTS.map(createBloom)
  blooms.forEach(({ el }) => layer.appendChild(el))
  section.insertBefore(layer, section.querySelector(".about__content"))

  if (reduced) {
    blooms.forEach(({ el }) => {
      const stages = el.querySelectorAll(".about__bloom-stage")
      gsap.set(stages, { opacity: 0, scale: 1 })
      gsap.set(stages[2], { opacity: 0.9, scale: 1 })
    })
    return
  }

  // Backdrop gently breathes so the whole botanical frame feels alive
  const backdropImg = section.querySelector(".about__backdrop img")
  if (backdropImg) {
    gsap.to(backdropImg, {
      scale: 1.015,
      duration: 8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    })
  }

  blooms.forEach(({ el, delay }) => animateBloom(el, delay))
}
