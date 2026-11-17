export function initNav() {
  const header = document.getElementById("site-header")
  const toggle = document.getElementById("nav-toggle")
  const nav = document.getElementById("site-nav")
  const links = [...document.querySelectorAll("#site-nav a[href^='#']")]
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean)

  const setSolid = () => {
    if (!header) return
    const about = document.getElementById("about")
    const reachedAbout = about
      ? about.getBoundingClientRect().top <= (header.offsetHeight || 80)
      : window.scrollY > (window.innerHeight || 700)
    header.classList.toggle("is-solid", reachedAbout)
  }

  setSolid()
  window.addEventListener("scroll", setSolid, { passive: true })
  window.addEventListener("resize", setSolid, { passive: true })

  const setNavOpen = (open) => {
    nav?.classList.toggle("is-open", open)
    document.body.classList.toggle("nav-open", open)
    document.body.classList.toggle("is-locked", open)
    toggle?.setAttribute("aria-expanded", String(open))
  }

  toggle?.addEventListener("click", (event) => {
    event.stopPropagation()
    setNavOpen(!nav?.classList.contains("is-open"))
  })

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("is-open")) {
      setNavOpen(false)
    }
  })

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false))
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const id = `#${entry.target.id}`
        links.forEach((link) => {
          link.toggleAttribute("aria-current", link.getAttribute("href") === id)
        })
      })
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 },
  )

  sections.forEach((section) => observer.observe(section))

  document.getElementById("back-to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  const year = document.getElementById("year")
  if (year) year.textContent = String(new Date().getFullYear())
}
