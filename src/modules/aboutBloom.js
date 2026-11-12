import gsap from "gsap"

const STAGES = [
  "/assets/images/blooms/jasmine-bud.png",
  "/assets/images/blooms/jasmine-opening.png",
  "/assets/images/blooms/jasmine-open.png",
]

/** Soft frame positions — small blooms around the edges, not the center */
const BLOOM_SPOTS = [
  { x: "8%", y: "12%", size: 3.4, delay: 0, rotate: -10 },
  { x: "22%", y: "5%", size: 2.6, delay: 1.1, rotate: 8 },
  { x: "84%", y: "8%", size: 3.0, delay: 2.0, rotate: 12 },
  { x: "94%", y: "28%", size: 2.5, delay: 3.1, rotate: -6 },
  { x: "5%", y: "68%", size: 2.9, delay: 1.6, rotate: 10 },
  { x: "4%", y: "38%", size: 2.3, delay: 3.8, rotate: -16 },
  { x: "76%", y: "91%", size: 3.5, delay: 0.7, rotate: 6 },
  { x: "93%", y: "74%", size: 2.9, delay: 2.5, rotate: -9 },
  { x: "56%", y: "95%", size: 2.5, delay: 3.4, rotate: 14 },
  { x: "38%", y: "4%", size: 2.2, delay: 4.4, rotate: -4 },
  { x: "14%", y: "92%", size: 2.4, delay: 2.8, rotate: 7 },
  { x: "96%", y: "52%", size: 2.1, delay: 4.0, rotate: -12 },
]

function createBloom(spot) {
  const el = document.createElement("span")
  el.className = "about__bloom"
  el.style.setProperty("--bloom-x", spot.x)
  el.style.setProperty("--bloom-y", spot.y)
  el.style.setProperty("--bloom-size", `${spot.size}rem`)

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

  return { el, delay: spot.delay, rotate: spot.rotate }
}

function animateBloom(el, delay, rotate) {
  const stages = el.querySelectorAll(".about__bloom-stage")
  if (stages.length < 3) return

  const [bud, opening, open] = stages

  gsap.set(el, {
    xPercent: -50,
    yPercent: -50,
    rotate,
    scale: 1,
    transformOrigin: "50% 65%",
  })

  gsap.set(stages, { opacity: 0, scale: 0.78 })
  gsap.set(bud, { opacity: 0.78, scale: 0.88 })

  const tl = gsap.timeline({
    repeat: -1,
    defaults: { ease: "sine.inOut" },
    delay,
  })

  // Bud → opening
  tl.to(bud, { opacity: 0.16, scale: 0.98, duration: 2.7 }, 0)
    .to(opening, { opacity: 0.94, scale: 1.02, duration: 2.7 }, 0)

    // Opening → full blossom
    .to(opening, { opacity: 0.1, scale: 1.06, duration: 2.9 }, 2.5)
    .to(open, { opacity: 1, scale: 1.1, duration: 2.9 }, 2.5)

    // Quiet hold
    .to(open, { opacity: 0.97, scale: 1.08, duration: 2.3 }, 5.2)

    // Fold back toward bud for a seamless loop
    .to(open, { opacity: 0.06, scale: 0.92, duration: 2.9 }, 7.2)
    .to(opening, { opacity: 0.42, scale: 0.9, duration: 2.5 }, 7.4)
    .to(bud, { opacity: 0.78, scale: 0.88, duration: 2.7 }, 7.8)
    .to(opening, { opacity: 0, scale: 0.8, duration: 1.7 }, 9.6)
    .to({}, { duration: 1.2 })

  gsap.to(el, {
    rotate: rotate + 3.5,
    duration: 5.4 + delay * 0.12,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  })

  gsap.to(el, {
    scale: 1.04,
    duration: 4.8 + delay * 0.16,
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
    blooms.forEach(({ el, rotate }) => {
      const stages = el.querySelectorAll(".about__bloom-stage")
      gsap.set(el, { xPercent: -50, yPercent: -50, rotate, scale: 1 })
      gsap.set(stages, { opacity: 0, scale: 1 })
      gsap.set(stages[2], { opacity: 0.95, scale: 1 })
    })
    return
  }

  const backdropImg = section.querySelector(".about__backdrop img")
  if (backdropImg) {
    gsap.fromTo(
      backdropImg,
      { opacity: 0.86, scale: 1 },
      {
        opacity: 1,
        scale: 1.01,
        duration: 9.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      },
    )
  }

  blooms.forEach(({ el, delay, rotate }) => animateBloom(el, delay, rotate))
}
