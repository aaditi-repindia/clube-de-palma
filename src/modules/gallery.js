export function initGallery() {
  const wrap = document.getElementById("gallery-drag")
  const track = document.getElementById("gallery-track")
  const lightbox = document.getElementById("lightbox")
  const lightboxImage = document.getElementById("lightbox-image")
  const lightboxClose = document.getElementById("lightbox-close")
  if (!wrap || !track) return

  // Desktop uses GSAP horizontal scrub; keep drag/swipe for touch / small screens
  const useDrag = () =>
    window.matchMedia("(max-width: 767px)").matches ||
    window.matchMedia("(pointer: coarse)").matches

  let isDown = false
  let startX = 0
  let scrollLeft = 0
  let moved = false

  const scroller = () => wrap

  const onDown = (clientX) => {
    if (!useDrag()) return
    isDown = true
    moved = false
    wrap.classList.add("is-dragging")
    startX = clientX - wrap.offsetLeft
    scrollLeft = scroller().scrollLeft
  }

  const onMove = (clientX) => {
    if (!isDown || !useDrag()) return
    const x = clientX - wrap.offsetLeft
    const walk = (x - startX) * 1.15
    if (Math.abs(walk) > 4) moved = true
    scroller().scrollLeft = scrollLeft - walk
  }

  const onUp = () => {
    isDown = false
    wrap.classList.remove("is-dragging")
  }

  wrap.addEventListener("mousedown", (e) => onDown(e.pageX))
  window.addEventListener("mousemove", (e) => onMove(e.pageX))
  window.addEventListener("mouseup", onUp)
  wrap.addEventListener("touchstart", (e) => onDown(e.touches[0].pageX), { passive: true })
  wrap.addEventListener("touchmove", (e) => onMove(e.touches[0].pageX), { passive: true })
  wrap.addEventListener("touchend", onUp)

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImage) return
    lightboxImage.src = src
    lightboxImage.alt = alt || ""
    lightbox.hidden = false
    requestAnimationFrame(() => lightbox.classList.add("is-open"))
    document.body.classList.add("is-locked")
  }

  const closeLightbox = () => {
    if (!lightbox) return
    lightbox.classList.remove("is-open")
    document.body.classList.remove("is-locked")
    window.setTimeout(() => {
      lightbox.hidden = true
      if (lightboxImage) lightboxImage.src = ""
    }, 280)
  }

  track.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      if (moved) return
      openLightbox(img.dataset.full || img.src, img.alt)
    })
  })

  lightboxClose?.addEventListener("click", closeLightbox)
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox()
  })
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox()
  })
}
