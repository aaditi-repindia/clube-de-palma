const SESSION_KEY = "cdp-splash-seen"

export function initSplash() {
  const splash = document.getElementById("splash")
  const skip = document.getElementById("splash-skip")
  if (!splash) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const seen = sessionStorage.getItem(SESSION_KEY) === "1"

  const dismiss = () => {
    splash.classList.add("is-done")
    sessionStorage.setItem(SESSION_KEY, "1")
    document.body.classList.remove("is-locked")
    splash.setAttribute("aria-hidden", "true")
    window.setTimeout(() => {
      splash.hidden = true
    }, 900)
  }

  if (seen || reduced) {
    splash.classList.add("is-done")
    splash.hidden = true
    splash.setAttribute("aria-hidden", "true")
    return
  }

  document.body.classList.add("is-locked")
  skip?.addEventListener("click", dismiss)
  window.setTimeout(dismiss, 2800)
}
