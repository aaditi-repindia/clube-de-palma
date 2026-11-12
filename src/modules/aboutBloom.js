import gsap from "gsap"

const BLOOM_SPOTS = [
  { x: "7%", y: "14%", size: 4.8, delay: 0, rotate: -18 },
  { x: "18%", y: "5%", size: 3.6, delay: 0.9, rotate: 12 },
  { x: "82%", y: "7%", size: 4.2, delay: 1.7, rotate: 16 },
  { x: "93%", y: "24%", size: 3.7, delay: 2.6, rotate: -8 },
  { x: "5%", y: "62%", size: 4.0, delay: 1.3, rotate: 14 },
  { x: "4%", y: "36%", size: 3.3, delay: 3.2, rotate: -22 },
  { x: "78%", y: "90%", size: 5.0, delay: 0.5, rotate: 8 },
  { x: "93%", y: "72%", size: 4.1, delay: 2.1, rotate: -12 },
  { x: "54%", y: "94%", size: 3.5, delay: 2.9, rotate: 18 },
  { x: "36%", y: "4%", size: 3.2, delay: 3.7, rotate: -6 },
  { x: "12%", y: "90%", size: 3.8, delay: 2.4, rotate: 10 },
  { x: "96%", y: "48%", size: 3.4, delay: 3.5, rotate: -14 },
]

const PETAL_ANGLES = [0, 72, 144, 216, 288]

function jasmineSvg() {
  const petals = PETAL_ANGLES.map(
    (angle, index) => `
      <g class="about__bloom-petal-wrap" data-petal="${index}" transform="rotate(${angle} 50 50)">
        <ellipse class="about__bloom-petal" cx="50" cy="30" rx="12" ry="24" />
      </g>`,
  ).join("")

  return `
    <svg class="about__bloom-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g class="about__bloom-petals">${petals}</g>
      <circle class="about__bloom-center" cx="50" cy="50" r="6" />
      <circle class="about__bloom-center-dot" cx="50" cy="50" r="2.4" />
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

function setBudPose(wraps, centerNodes) {
  wraps.forEach((wrap) => {
    const petal = wrap.querySelector(".about__bloom-petal")
    gsap.set(petal, {
      svgOrigin: "50 50",
      scaleX: 0.42,
      scaleY: 0.28,
      y: 14,
      opacity: 0.9,
    })
  })
  gsap.set(centerNodes, { svgOrigin: "50 50", scale: 0.5, opacity: 0.5 })
}

function setOpenPose(wraps, centerNodes) {
  wraps.forEach((wrap) => {
    const petal = wrap.querySelector(".about__bloom-petal")
    gsap.set(petal, {
      svgOrigin: "50 50",
      scaleX: 1,
      scaleY: 1,
      y: 0,
      opacity: 1,
    })
  })
  gsap.set(centerNodes, { svgOrigin: "50 50", scale: 1, opacity: 1 })
}

function animateBloom(el, delay, rotate) {
  const wraps = [...el.querySelectorAll(".about__bloom-petal-wrap")]
  const petals = wraps.map((wrap) => wrap.querySelector(".about__bloom-petal"))
  const centerNodes = el.querySelectorAll(".about__bloom-center, .about__bloom-center-dot")
  if (!petals.length) return

  gsap.set(el, {
    xPercent: -50,
    yPercent: -50,
    rotate,
    scale: 1,
    opacity: 1,
    transformOrigin: "50% 50%",
  })

  setBudPose(wraps, centerNodes)

  const tl = gsap.timeline({
    repeat: -1,
    defaults: { ease: "sine.inOut" },
    delay,
  })

  // Bud → open blossom
  tl.to(
    petals,
    {
      scaleX: 1,
      scaleY: 1,
      y: 0,
      opacity: 1,
      duration: 3.3,
      stagger: { each: 0.1, from: "start" },
      svgOrigin: "50 50",
    },
    0,
  )
    .to(centerNodes, { scale: 1, opacity: 1, duration: 2.6, svgOrigin: "50 50" }, 0.4)

    // Soft living hold
    .to(
      petals,
      {
        scaleX: 1.05,
        scaleY: 1.04,
        duration: 1.9,
        yoyo: true,
        repeat: 1,
        svgOrigin: "50 50",
      },
      3.3,
    )

    // Open → bud again
    .to(
      petals,
      {
        scaleX: 0.42,
        scaleY: 0.28,
        y: 14,
        opacity: 0.9,
        duration: 3.5,
        stagger: { each: 0.08, from: "end" },
        svgOrigin: "50 50",
      },
      6.8,
    )
    .to(centerNodes, { scale: 0.5, opacity: 0.5, duration: 2.9, svgOrigin: "50 50" }, 7.0)
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
      const wraps = [...el.querySelectorAll(".about__bloom-petal-wrap")]
      const centerNodes = el.querySelectorAll(".about__bloom-center, .about__bloom-center-dot")
      gsap.set(el, { xPercent: -50, yPercent: -50, rotate, scale: 1, opacity: 1 })
      setOpenPose(wraps, centerNodes)
    })
    return
  }

  const backdropImg = section.querySelector(".about__backdrop img")
  if (backdropImg) {
    gsap.fromTo(
      backdropImg,
      { opacity: 0.88, scale: 1 },
      {
        opacity: 1,
        scale: 1.012,
        duration: 9.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      },
    )
  }

  blooms.forEach(({ el, delay, rotate }) => animateBloom(el, delay, rotate))
}
