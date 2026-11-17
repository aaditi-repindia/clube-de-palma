export function initContact() {
  const form = document.querySelector("[data-contact-form]")
  const status = document.querySelector("[data-contact-status]")
  if (!form || !status) return

  const fields = [...form.querySelectorAll("input[required]")]

  const setInvalid = (input, invalid) => {
    input.classList.toggle("is-invalid", invalid)
    input.setAttribute("aria-invalid", invalid ? "true" : "false")
  }

  const validate = () => {
    let ok = true
    fields.forEach((input) => {
      const empty = !input.value.trim()
      const badEmail = input.type === "email" && input.value.trim() && !input.checkValidity()
      const invalid = empty || badEmail
      setInvalid(input, invalid)
      if (invalid) ok = false
    })
    return ok
  }

  fields.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) setInvalid(input, false)
      if (status.textContent) status.textContent = ""
    })
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    if (!validate()) {
      status.textContent = "Please complete the required fields."
      return
    }

    form.classList.add("is-sent")
    status.textContent = "Thank you — your enquiry has been noted."
    form.reset()
    fields.forEach((input) => setInvalid(input, false))
  })
}
