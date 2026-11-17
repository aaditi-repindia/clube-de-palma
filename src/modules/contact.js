export function initContact() {
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
