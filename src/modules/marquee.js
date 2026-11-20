import gsap from "gsap"

export function initMarquee() {
  const rows = document.querySelectorAll("[data-marquee]")
  if (!rows.length) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  rows.forEach((row) => {
    const track = row.querySelector("[data-marquee-track]")
    if (!track) return
    // Duplicate content for seamless loop
    track.innerHTML = track.innerHTML + track.innerHTML
    const distance = track.scrollWidth / 2
    gsap.to(track, {
      x: -distance,
      duration: Number(row.dataset.marqueeSpeed || 28),
      ease: "none",
      repeat: -1,
    })
  })
}
