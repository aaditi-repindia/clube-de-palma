import gsap from "gsap"

const BLOOM_SPOTS = [
  { x: "7%", y: "14%", size: 5.2, delay: 0, rotate: -18 },
  { x: "18%", y: "5%", size: 3.9, delay: 0.9, rotate: 12 },
  { x: "82%", y: "7%", size: 4.6, delay: 1.7, rotate: 16 },
  { x: "93%", y: "24%", size: 4.0, delay: 2.6, rotate: -8 },
  { x: "5%", y: "62%", size: 4.4, delay: 1.3, rotate: 14 },
  { x: "4%", y: "36%", size: 3.6, delay: 3.2, rotate: -22 },
  { x: "78%", y: "90%", size: 5.4, delay: 0.5, rotate: 8 },
  { x: "93%", y: "72%", size: 4.5, delay: 2.1, rotate: -12 },
  { x: "54%", y: "94%", size: 3.8, delay: 2.9, rotate: 18 },
  { x: "36%", y: "4%", size: 3.5, delay: 3.7, rotate: -6 },
  { x: "12%", y: "90%", size: 4.1, delay: 2.4, rotate: 10 },
  { x: "96%", y: "48%", size: 3.7, delay: 3.5, rotate: -14 },
]

/** Outer ring of jasmine petals */
const OUTER_ANGLES = [0, 72, 144, 216, 288]
/** Inner accent petals, offset between the outer ones */
const INNER_ANGLES = [36, 108, 180, 252, 324]

/** Soft pointed petal path (tip at top, base near flower center) */
const PETAL_PATH =
  "M50 14 C58 18 64 28 63 40 C62 48 57 54 50 56 C43 54 38 48 37 40 C36 28 42 18 50 14 Z"

function petalGroup(angle, index, ring) {
  return `
    <g class="about__bloom-petal-wrap about__bloom-petal-wrap--${ring}" data-petal="${index}" data-ring="${ring}" transform="rotate(${angle} 50 50)">
      <path class="about__bloom-petal about__bloom-petal--${ring}" d="${PETAL_PATH}" />
    </g>
  `
}

function jasmineSvg() {
  const outer = OUTER_ANGLES.map((angle, i) => petalGroup(angle, i, "outer")).join("")
  const inner = INNER_ANGLES.map((angle, i) => petalGroup(angle, i + 5, "inner")).join("")

  return `
    <svg class="about__bloom-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g class="about__bloom-petals about__bloom-petals--outer">${outer}</g>
      <g class="about__bloom-petals about__bloom-petals--inner">${inner}</g>
      <circle class="about__bloom-center" cx="50" cy="50" r="7" />
      <circle class="about__bloom-center-mid" cx="50" cy="50" r="4.2" />
      <circle class="about__bloom-center-dot" cx="50" cy="50" r="2" />
    </svg>
  `.trim()
}

function createBloom(spot) {
  const el = document.createElement("span")
  el.className = "about__bloom"
  el.style.setProperty("--bloom-x", spot.x)
  el.style.setProperty("--bloom-y", spot.y)
  el.style.setProperty("--bloom-size", `${spot.size}rem`)
  el.innerHTML = jasmineSvg()
  return { el, delay: spot.delay, rotate: spot.rotate }
}

function petalsOf(el, ring) {
  return [...el.querySelectorAll(`.about__bloom-petal--${ring}`)]
}

function setBudPose(el) {
  const outer = petalsOf(el, "outer")
  const inner = petalsOf(el, "inner")
  const centers = el.querySelectorAll(
    ".about__bloom-center, .about__bloom-center-mid, .about__bloom-center-dot",
  )

  gsap.set(outer, {
    svgOrigin: "50 50",
    scaleX: 0.38,
    scaleY: 0.22,
    y: 18,
    opacity: 0.85,
  })
  gsap.set(inner, {
    svgOrigin: "50 50",
    scaleX: 0.28,
    scaleY: 0.16,
    y: 20,
    opacity: 0.55,
  })
  gsap.set(centers, { svgOrigin: "50 50", scale: 0.45, opacity: 0.45 })
}

function setOpenPose(el) {
  const outer = petalsOf(el, "outer")
  const inner = petalsOf(el, "inner")
  const centers = el.querySelectorAll(
    ".about__bloom-center, .about__bloom-center-mid, .about__bloom-center-dot",
  )

  gsap.set(outer, { svgOrigin: "50 50", scaleX: 1, scaleY: 1, y: 0, opacity: 1 })
  gsap.set(inner, { svgOrigin: "50 50", scaleX: 0.78, scaleY: 0.72, y: 4, opacity: 0.95 })
  gsap.set(centers, { svgOrigin: "50 50", scale: 1, opacity: 1 })
}

function animateBloom(el, delay, rotate) {
  const outer = petalsOf(el, "outer")
  const inner = petalsOf(el, "inner")
  const centers = el.querySelectorAll(
    ".about__bloom-center, .about__bloom-center-mid, .about__bloom-center-dot",
  )
  if (!outer.length) return

  gsap.set(el, {
    xPercent: -50,
    yPercent: -50,
    rotate,
    scale: 1,
    opacity: 1,
    transformOrigin: "50% 50%",
  })

  setBudPose(el)

  const tl = gsap.timeline({
    repeat: -1,
    defaults: { ease: "sine.inOut" },
    delay,
  })

  // Bud → open: outer petals unfurl first, then inner petals
  tl.to(
    outer,
    {
      scaleX: 1,
      scaleY: 1,
      y: 0,
      opacity: 1,
      duration: 3.2,
      stagger: { each: 0.11, from: "start" },
      svgOrigin: "50 50",
    },
    0,
  )
    .to(
      inner,
      {
        scaleX: 0.78,
        scaleY: 0.72,
        y: 4,
        opacity: 0.95,
        duration: 2.8,
        stagger: { each: 0.09, from: "start" },
        svgOrigin: "50 50",
      },
      0.45,
    )
    .to(centers, { scale: 1, opacity: 1, duration: 2.5, svgOrigin: "50 50" }, 0.5)

    // Soft living hold
    .to(
      outer,
      {
        scaleX: 1.04,
        scaleY: 1.03,
        duration: 1.8,
        yoyo: true,
        repeat: 1,
        svgOrigin: "50 50",
      },
      3.3,
    )
    .to(
      inner,
      {
        scaleX: 0.82,
        scaleY: 0.76,
        duration: 1.8,
        yoyo: true,
        repeat: 1,
        svgOrigin: "50 50",
      },
      3.3,
    )

    // Open → bud
    .to(
      inner,
      {
        scaleX: 0.28,
        scaleY: 0.16,
        y: 20,
        opacity: 0.55,
        duration: 2.8,
        stagger: { each: 0.06, from: "end" },
        svgOrigin: "50 50",
      },
      6.6,
    )
    .to(
      outer,
      {
        scaleX: 0.38,
        scaleY: 0.22,
        y: 18,
        opacity: 0.85,
        duration: 3.4,
        stagger: { each: 0.08, from: "end" },
        svgOrigin: "50 50",
      },
      6.9,
    )
    .to(centers, { scale: 0.45, opacity: 0.45, duration: 2.8, svgOrigin: "50 50" }, 7.1)
    .to({}, { duration: 1.0 })

  gsap.to(el, {
    rotate: rotate + 4,
    duration: 5.6 + delay * 0.1,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  })

  gsap.to(el, {
    scale: 1.05,
    duration: 4.8 + delay * 0.14,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  })
}

export function initAboutBloom() {
  const section = document.getElementById("about")
  if (!section) return

  section.querySelector(".about__blooms")?.remove()
  section.querySelector(".about__backdrop")?.remove()

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const layer = document.createElement("div")
  layer.className = "about__blooms"
  layer.setAttribute("aria-hidden", "true")

  const blooms = BLOOM_SPOTS.map(createBloom)
  blooms.forEach(({ el }) => layer.appendChild(el))

  const content = section.querySelector(".about__content")
  if (content) section.insertBefore(layer, content)
  else section.appendChild(layer)

  if (reduced) {
    blooms.forEach(({ el, rotate }) => {
      gsap.set(el, { xPercent: -50, yPercent: -50, rotate, scale: 1, opacity: 1 })
      setOpenPose(el)
    })
    return
  }

  blooms.forEach(({ el, delay, rotate }) => animateBloom(el, delay, rotate))
}
