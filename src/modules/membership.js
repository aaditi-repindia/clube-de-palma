const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const mobilePattern = /^(\+?\d[\d\s-]{8,16}\d)$/

function setError(form, name, message) {
  const field = form.querySelector(`[name="${name}"]`)?.closest(".field")
  const error = form.querySelector(`[data-error-for="${name}"]`)
  if (field) field.classList.toggle("is-invalid", Boolean(message))
  if (error) error.textContent = message || ""
}

function validate(form) {
  const data = Object.fromEntries(new FormData(form).entries())
  let ok = true

  const requireText = (name, label) => {
    if (!String(data[name] || "").trim()) {
      setError(form, name, `${label} is required.`)
      ok = false
    } else {
      setError(form, name, "")
    }
  }

  requireText("fullName", "Full name")
  requireText("interest", "Membership interest")

  if (!emailPattern.test(String(data.email || "").trim())) {
    setError(form, "email", "Enter a valid email address.")
    ok = false
  } else {
    setError(form, "email", "")
  }

  if (!mobilePattern.test(String(data.mobile || "").trim())) {
    setError(form, "mobile", "Enter a valid mobile number.")
    ok = false
  } else {
    setError(form, "mobile", "")
  }

  if (!form.consent.checked) {
    setError(form, "consent", "Privacy consent is required.")
    ok = false
  } else {
    setError(form, "consent", "")
  }

  return ok
}

export function initMembershipForm() {
  const form = document.getElementById("membership-form")
  const wrap = document.getElementById("enquiry-form-wrap")
  const success = document.getElementById("enquiry-success")
  const reset = document.getElementById("enquiry-reset")
  const summary = document.getElementById("enquiry-summary-error")
  if (!form) return

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const ok = validate(form)
    if (!ok) {
      if (summary) {
        summary.textContent = "Please correct the highlighted fields before continuing."
        summary.classList.add("is-visible")
      }
      const firstInvalid = form.querySelector(".field.is-invalid")
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" })
      firstInvalid?.querySelector("input, select, textarea, .checkbox")?.focus?.()
      return
    }

    summary?.classList.remove("is-visible")
    // Prototype only — no backend. Confirmation UI, then point to live application.
    wrap.style.display = "none"
    success?.classList.add("is-visible")
    success?.scrollIntoView({ behavior: "smooth", block: "center" })
  })

  reset?.addEventListener("click", () => {
    form.reset()
    form.querySelectorAll(".field").forEach((field) => field.classList.remove("is-invalid"))
    form.querySelectorAll(".field__error").forEach((el) => {
      el.textContent = ""
    })
    summary?.classList.remove("is-visible")
    success?.classList.remove("is-visible")
    wrap.style.display = ""
  })
}
