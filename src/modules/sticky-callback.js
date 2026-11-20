import { getLenis } from "./smooth.js"

export function mountStickyCallback() {
  if (document.querySelector("[data-sticky-callback]")) return document.querySelector("[data-sticky-callback]")

  const aside = document.createElement("aside")
  aside.className = "sticky-callback"
  aside.id = "sticky-callback"
  aside.setAttribute("data-sticky-callback", "")
  aside.setAttribute("aria-label", "Request a Callback")
  aside.innerHTML = `
    <div class="sticky-callback__inner">
      <div class="sticky-callback__intro">
        <span class="sticky-callback__tag">Clube de Palma</span>
        <span class="sticky-callback__title">Request a Callback</span>
      </div>
      <form class="sticky-callback__form" data-callback-form novalidate>
        <div class="sticky-callback__field">
          <label for="cb-name" class="sr-only">Full Name</label>
          <input
            type="text"
            id="cb-name"
            name="name"
            class="sticky-callback__input"
            placeholder="Full Name"
            required
            autocomplete="name"
          />
        </div>
        <div class="sticky-callback__field">
          <label for="cb-email" class="sr-only">Email Address</label>
          <input
            type="email"
            id="cb-email"
            name="email"
            class="sticky-callback__input"
            placeholder="Email Address"
            required
            autocomplete="email"
          />
        </div>
        <div class="sticky-callback__field">
          <label for="cb-phone" class="sr-only">Phone Number</label>
          <input
            type="tel"
            id="cb-phone"
            name="phone"
            class="sticky-callback__input"
            placeholder="Phone Number"
            required
            autocomplete="tel"
          />
        </div>
        <button type="submit" class="sticky-callback__btn" data-magnetic>
          <span data-magnetic-inner>Get A Call Back <span class="btn__arrow" aria-hidden="true">→</span></span>
        </button>
        <span class="sticky-callback__feedback" data-callback-feedback role="status" aria-live="polite"></span>
      </form>
    </div>
  `
  document.body.appendChild(aside)
  return aside
}

export function initStickyCallback() {
  let container = document.querySelector("[data-sticky-callback]")
  if (!container) {
    container = mountStickyCallback()
  }
  if (!container) return

  const form = container.querySelector("[data-callback-form]")
  const feedback = container.querySelector("[data-callback-feedback]")
  const hasPortal = !!document.querySelector(".hero--portal")
  let lastScrollY = window.scrollY || 0
  let idleTimer = null

  // Check if conditions allow the sticky form to be visible:
  // On home page: ONLY when user has scrolled and the arch has opened.
  // On pages without portal: when user has started scrolling down the page.
  const isEligible = () => {
    const scrollY = window.scrollY || 0
    // If at the top of the page, arch is closed — never eligible
    if (scrollY < 60) {
      window.__archOpened = false
      return false
    }

    if (hasPortal) {
      if (window.__archOpened) return true
      // Check if site-header is visible (header only reveals once arch opens!)
      const header = document.getElementById("site-header")
      if (header && parseFloat(window.getComputedStyle(header).opacity) > 0.05) {
        window.__archOpened = true
        return true
      }
      // Check if user has scrolled past the arch opening threshold
      const spacer = document.querySelector(".hero--portal")?.parentElement
      const spacerTop = spacer ? spacer.getBoundingClientRect().top : 0
      if (spacerTop < -window.innerHeight * 0.45 || scrollY > 700) {
        window.__archOpened = true
        return true
      }
      return false
    }
    return scrollY > 100
  }

  const show = () => {
    if (!isEligible()) return
    container.classList.remove("is-hidden")
    container.classList.add("is-visible")
  }

  const hide = () => {
    // Don't hide if user is focused inside an input
    if (form && form.contains(document.activeElement)) return
    container.classList.add("is-hidden")
    container.classList.remove("is-visible")
  }

  const onScrollChange = (delta, currentY) => {
    if (!isEligible()) {
      hide()
      return
    }

    if (delta > 0 && currentY > 60) {
      // Scrolling down -> hide
      hide()
    } else if (delta < 0) {
      // Scrolling up -> show
      show()
    }

    // When scrolling stops ("stay on screen it will become visible")
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      if (isEligible()) {
        show()
      }
    }, 380)
  }

  const handleNativeScroll = () => {
    const currentScrollY = window.scrollY || 0
    const delta = currentScrollY - lastScrollY
    if (Math.abs(delta) < 4) return

    onScrollChange(delta, currentScrollY)
    lastScrollY = currentScrollY
  }

  window.addEventListener("scroll", handleNativeScroll, { passive: true })
  window.addEventListener("touchmove", handleNativeScroll, { passive: true })

  // Also hook into Lenis smooth scrolling if present
  const lenis = getLenis()
  if (lenis) {
    lenis.on("scroll", (e) => {
      onScrollChange(e.direction, e.scroll)
    })
  }

  // React directly to arch portal open / close transitions
  window.addEventListener("arch-state-change", (e) => {
    if (!e.detail.opened) {
      hide()
    } else {
      // When arch opens, reveal gracefully if not scrolling down fast
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        if (isEligible()) show()
      }, 250)
    }
  })

  // Form submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const nameInput = form.querySelector('input[name="name"]')
      const emailInput = form.querySelector('input[name="email"]')
      const phoneInput = form.querySelector('input[name="phone"]')

      const nameVal = nameInput ? nameInput.value.trim() : ""
      const emailVal = emailInput ? emailInput.value.trim() : ""
      const phoneVal = phoneInput ? phoneInput.value.trim() : ""

      if (!nameVal || !emailVal || !phoneVal) {
        if (feedback) {
          feedback.textContent = "Please fill in all fields."
          feedback.className = "sticky-callback__feedback is-error"
        }
        return
      }

      // Valid
      if (feedback) {
        feedback.textContent = "Thank you! Our concierge will call you shortly."
        feedback.className = "sticky-callback__feedback is-success"
      }
      form.reset()

      setTimeout(() => {
        if (feedback) {
          feedback.textContent = ""
          feedback.className = "sticky-callback__feedback"
        }
      }, 4000)
    })
  }
}
