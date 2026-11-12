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
    header.classList.toggle("is-solid", window.scrollY > 40)
  }

  setSolid()
  window.addEventListener("scroll", setSolid, { passive: true })

  toggle?.addEventListener("click", () => {
    const open = !nav?.classList.contains("is-open")
    nav?.classList.toggle("is-open", open)
    document.body.classList.toggle("nav-open", open)
    toggle.setAttribute("aria-expanded", String(open))
  })

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open")
      document.body.classList.remove("nav-open")
      toggle?.setAttribute("aria-expanded", "false")
    })
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
