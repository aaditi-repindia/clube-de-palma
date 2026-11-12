export function initMotion() {
  const hero = document.querySelector(".hero")
  requestAnimationFrame(() => hero?.classList.add("is-ready"))

  const reveals = document.querySelectorAll(".reveal")
  if (!reveals.length) return

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reveals.forEach((el) => el.classList.add("is-visible"))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  )

  reveals.forEach((el) => observer.observe(el))

  const parallax = document.querySelector("[data-parallax] img")
  if (parallax && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "scroll",
      () => {
        const y = Math.min(window.scrollY * 0.18, 120)
        parallax.style.transform = `scale(1) translateY(${y}px)`
      },
      { passive: true },
    )
  }
}
