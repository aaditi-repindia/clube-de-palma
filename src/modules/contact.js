export function initContact() {
  initNewsletter()
  initEnquiryForm()
}

function initNewsletter() {
  const subscribeForm = document.querySelector("[data-newsletter-form]")
  const feedback = document.querySelector("[data-subscribe-feedback]")
  if (!subscribeForm) return

  subscribeForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const input = subscribeForm.querySelector("input[type='email']")
    if (!input) return
    const value = input.value.trim()
    if (!value || !input.checkValidity()) {
      if (feedback) {
        feedback.textContent = "Please enter a valid email address."
        feedback.style.color = "#a25d50"
      }
      return
    }

    if (feedback) {
      feedback.textContent = "Thank you for subscribing to Clube de Palma."
      feedback.style.color = "var(--color-accent, #56c1a9)"
    }
    subscribeForm.reset()
    setTimeout(() => {
      if (feedback) feedback.textContent = ""
    }, 4500)
  })
}

function initEnquiryForm() {
  const form = document.querySelector("[data-contact-form]")
  if (!form) return

  const feedback = form.querySelector("[data-contact-feedback]")
  const message = form.querySelector("[data-message-field]")
  const count = form.querySelector("[data-message-count]")

  const syncCount = () => {
    if (!message || !count) return
    count.textContent = `${message.value.length}/180`
  }

  message?.addEventListener("input", syncCount)
  syncCount()

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const firstName = form.querySelector("#contact-first-name")
    const email = form.querySelector("#contact-email")
    const valid =
      firstName instanceof HTMLInputElement &&
      email instanceof HTMLInputElement &&
      firstName.value.trim() &&
      email.value.trim() &&
      email.checkValidity()

    if (!valid) {
      if (feedback) {
        feedback.textContent = "Please complete the required fields."
        feedback.dataset.state = "error"
      }
      return
    }

    if (feedback) {
      feedback.textContent = "Thank you. Our team will be in touch shortly."
      feedback.dataset.state = "success"
    }

    form.reset()
    syncCount()

    setTimeout(() => {
      if (feedback) {
        feedback.textContent = ""
        delete feedback.dataset.state
      }
    }, 4500)
  })
}
