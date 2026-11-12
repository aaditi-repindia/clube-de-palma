import { amenityCategories } from "../data/amenities.js"

export function initAmenities() {
  const tabs = [...document.querySelectorAll(".amenities__tab")]
  const gallery = document.getElementById("amenities-gallery")
  const list = document.getElementById("amenities-list")
  const eyebrow = document.getElementById("amenities-eyebrow")
  const title = document.getElementById("amenities-title")
  const intro = document.getElementById("amenities-intro")
  if (!tabs.length || !gallery || !list) return

  let activeCategory = "recreation"
  let activeIndex = 0

  const render = () => {
    const data = amenityCategories[activeCategory]
    eyebrow.textContent = data.label
    title.textContent = data.title
    intro.textContent = data.intro

    gallery.innerHTML = data.items
      .map(
        (item, index) =>
          `<img src="${item.image}" alt="${item.name}" class="${index === activeIndex ? "is-active" : ""}" data-index="${index}" />`,
      )
      .join("")

    list.innerHTML = data.items
      .map(
        (item, index) => `
        <button type="button" class="amenities__item ${index === activeIndex ? "is-active" : ""}" data-index="${index}" role="listitem">
          <strong>${item.name}</strong>
          <span>${item.blurb}</span>
        </button>`,
      )
      .join("")

    list.querySelectorAll(".amenities__item").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeIndex = Number(btn.dataset.index)
        render()
      })
      btn.addEventListener("mouseenter", () => {
        if (window.matchMedia("(hover: hover)").matches) {
          activeIndex = Number(btn.dataset.index)
          gallery.querySelectorAll("img").forEach((img) => {
            img.classList.toggle("is-active", Number(img.dataset.index) === activeIndex)
          })
          list.querySelectorAll(".amenities__item").forEach((el) => {
            el.classList.toggle("is-active", Number(el.dataset.index) === activeIndex)
          })
        }
      })
    })
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeCategory = tab.dataset.category
      activeIndex = 0
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)))
      render()
    })
  })

  render()
}
