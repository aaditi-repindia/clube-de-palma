export function initGallery() {
  const wrap = document.getElementById("gallery-drag")
  const track = document.getElementById("gallery-track")
  const cursor = document.getElementById("cursor-drag")
  const lightbox = document.getElementById("lightbox")
  const lightboxImage = document.getElementById("lightbox-image")
  const lightboxClose = document.getElementById("lightbox-close")
  if (!wrap || !track) return

  let isDown = false
  let startX = 0
  let scrollLeft = 0
  let moved = false

  const onDown = (clientX) => {
    isDown = true
    moved = false
    wrap.classList.add("is-dragging")
    startX = clientX - wrap.offsetLeft
    scrollLeft = wrap.scrollLeft
  }

  const onMove = (clientX) => {
    if (!isDown) return
    const x = clientX - wrap.offsetLeft
    const walk = (x - startX) * 1.15
    if (Math.abs(walk) > 4) moved = true
    wrap.scrollLeft = scrollLeft - walk
  }

  const onUp = () => {
    isDown = false
    wrap.classList.remove("is-dragging")
  }

  wrap.addEventListener("mousedown", (e) => onDown(e.pageX))
  window.addEventListener("mousemove", (e) => onMove(e.pageX))
  window.addEventListener("mouseup", onUp)

  wrap.addEventListener(
    "touchstart",
    (e) => onDown(e.touches[0].pageX),
    { passive: true },
  )
  wrap.addEventListener(
    "touchmove",
    (e) => onMove(e.touches[0].pageX),
    { passive: true },
  )
  wrap.addEventListener("touchend", onUp)

  const finePointer = window.matchMedia("(pointer: fine)").matches
  if (finePointer && cursor) {
    wrap.addEventListener("pointerenter", () => cursor.classList.add("is-active"))
    wrap.addEventListener("pointerleave", () => cursor.classList.remove("is-active"))
    wrap.addEventListener("pointermove", (e) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    })
  }

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
