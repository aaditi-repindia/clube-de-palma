/** Lightweight SplitText substitute — lines + words for GSAP reveals */

export function splitLines(element) {
  if (!element || element.dataset.split === "1") return []
  const text = element.textContent.trim()
  element.setAttribute("aria-label", text)
  element.dataset.split = "1"
  element.innerHTML = ""

  const words = text.split(/\s+/)
  const line = document.createElement("span")
  line.className = "split-line"
  const mask = document.createElement("span")
  mask.className = "split-line__mask"

  words.forEach((word, index) => {
    const wordEl = document.createElement("span")
    wordEl.className = "split-word"
    wordEl.textContent = word
    mask.appendChild(wordEl)
    if (index < words.length - 1) mask.appendChild(document.createTextNode(" "))
  })

  line.appendChild(mask)
  element.appendChild(line)
  return [line]
}

export function splitWords(element) {
  if (!element || element.dataset.split === "1") return []
  const text = element.textContent.trim()
  element.setAttribute("aria-label", text)
  element.dataset.split = "1"
  element.innerHTML = ""

  return text.split(/\s+/).map((word, index, arr) => {
    const wrap = document.createElement("span")
    wrap.className = "split-word-wrap"
    const inner = document.createElement("span")
    inner.className = "split-word"
    inner.textContent = word
    wrap.appendChild(inner)
    element.appendChild(wrap)
    if (index < arr.length - 1) element.appendChild(document.createTextNode(" "))
    return wrap
  })
}
