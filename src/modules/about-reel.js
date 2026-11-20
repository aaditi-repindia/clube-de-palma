export function initAboutReel() {
  const reel = document.querySelector("[data-concept-reel]")
  if (!reel) return

  const images = [...reel.querySelectorAll(".about__reel-img")]
  if (images.length < 2) return

  let activeIndex = 0
  let intervalId = null

  const step = () => {
    images[activeIndex].classList.remove("is-active")
    activeIndex = (activeIndex + 1) % images.length
    images[activeIndex].classList.add("is-active")
  }

  const start = () => {
    if (intervalId) return
    // 2 images per second = 500ms interval
    intervalId = window.setInterval(step, 500)
  }

  const stop = () => {
    if (!intervalId) return
    window.clearInterval(intervalId)
    intervalId = null
  }

  // Only run the rapid shuffle when section is visible in the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !document.hidden) {
          start()
        } else {
          stop()
        }
      })
    },
    { rootMargin: "100px" },
  )

  observer.observe(reel)

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop()
    } else {
      const rect = reel.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        start()
      }
    }
  })
}
