export function initNav() {
  const header = document.getElementById("site-header")
  const toggle = document.getElementById("nav-toggle")
  const nav = document.getElementById("site-nav")
  const page = document.body.dataset.page || "home"
  const isHome = page === "home"
  const isAbout = page === "about"
  const isContact = page === "contact"
  const hashLinks = [...document.querySelectorAll("#site-nav a[href^='#']")]
  const sections = hashLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean)

  const setSolid = () => {
    if (!header) return
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0

    if (isHome) {
      const about = document.getElementById("about")
      const reachedAbout = about
        ? about.getBoundingClientRect().top <= (header.offsetHeight || 80)
        : scrollY > (window.innerHeight || 700)
      header.classList.toggle("is-solid", reachedAbout)
      return
    }

    if (isContact) {
      const contactFrame = document.querySelector(".contact-page__frame")
      const frameTop = contactFrame ? contactFrame.getBoundingClientRect().top : 999
      const shouldBeSolid = scrollY > 20 || frameTop <= (header.offsetHeight || 80)
      header.classList.toggle("is-solid", Boolean(shouldBeSolid))
      return
    }

    if (isAbout) {
      const aboutHero = document.querySelector(".about-hero")
      const reachedPastHero = aboutHero
        ? aboutHero.getBoundingClientRect().bottom <= (header.offsetHeight || 80)
        : scrollY > 400
      header.classList.toggle("is-solid", reachedPastHero)
      return
    }

    const pageHero = document.querySelector(".page-hero, .hero")
    if (pageHero) {
      const reachedPastHero = pageHero.getBoundingClientRect().bottom <= (header.offsetHeight || 80)
      header.classList.toggle("is-solid", reachedPastHero)
      return
    }

    header.classList.add("is-solid")
  }

  const markCurrentPage = () => {
    const current = location.pathname.replace(/\/+$/, "") || "/"
    nav?.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href")
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return
      }
      const path = new URL(href, location.href).pathname.replace(/\/+$/, "") || "/"
      const matches =
        current === path ||
        current.endsWith(path) ||
        (path.endsWith(".html") && current.endsWith(path.replace(/\.html$/, "")))
      if (matches) link.setAttribute("aria-current", "page")
      else link.removeAttribute("aria-current")
    })
  }

  setSolid()
  markCurrentPage()
  window.addEventListener("scroll", setSolid, { passive: true })
  window.addEventListener("resize", setSolid, { passive: true })
  window.addEventListener("wheel", () => requestAnimationFrame(setSolid), { passive: true })
  window.addEventListener("touchmove", () => requestAnimationFrame(setSolid), { passive: true })
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.addEventListener("scroll", setSolid)
  }

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

  if (isHome && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const id = `#${entry.target.id}`
          hashLinks.forEach((link) => {
            link.toggleAttribute("aria-current", link.getAttribute("href") === id)
          })
        })
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 },
    )
    sections.forEach((section) => observer.observe(section))
  }

  document.getElementById("back-to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  const year = document.getElementById("year")
  if (year) year.textContent = String(new Date().getFullYear())
}
