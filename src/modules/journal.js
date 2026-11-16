import { journalItems } from "../data/journal.js"

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function ctaAttrs(cta) {
  if (cta.external) {
    return `href="${escapeHtml(cta.href)}" target="_blank" rel="noopener noreferrer"`
  }
  return `href="${escapeHtml(cta.href)}"`
}

function metaRow(item) {
  const bits = []
  bits.push(`<span class="journal-label">${escapeHtml(item.label)}</span>`)
  if (item.dateLabel) {
    bits.push(`<span class="journal-date">${escapeHtml(item.dateLabel)}</span>`)
  }
  if (item.placeholder) {
    bits.push(`<span class="placeholder-tag">CMS placeholder</span>`)
  }
  return bits.join("")
}

function featureMarkup(item) {
  return `
    <article class="journal-feature" data-reveal="slide">
      <div class="journal-feature__media">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || "")}" loading="lazy" decoding="async" />
      </div>
      <div class="journal-feature__body">
        <div class="journal-meta">${metaRow(item)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="journal-link" ${ctaAttrs(item.cta)} data-magnetic>
          <span data-magnetic-inner>${escapeHtml(item.cta.label)} <span class="btn__arrow" aria-hidden="true">→</span></span>
        </a>
      </div>
    </article>`
}

function secondaryMarkup(item) {
  return `
    <article class="journal-secondary">
      <div class="journal-secondary__media">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || "")}" loading="lazy" decoding="async" />
      </div>
      <div class="journal-secondary__body">
        <div class="journal-meta">${metaRow(item)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="journal-link" ${ctaAttrs(item.cta)}>
          ${escapeHtml(item.cta.label)} <span class="btn__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>`
}

export function initJournal() {
  const root = document.querySelector("[data-journal-stage]")
  if (!root) return

  const items = journalItems.filter(Boolean)
  if (!items.length) {
    root.innerHTML = ""
    root.hidden = true
    return
  }

  const count = items.length
  root.dataset.count = String(count)
  root.classList.toggle("is-single", count === 1)
  root.classList.toggle("is-pair", count === 2)
  root.classList.toggle("is-multi", count >= 3)

  const [featured, ...rest] = items
  const secondary = count >= 3 ? rest.slice(0, 2) : rest.slice(0, 1)

  const aside =
    secondary.length > 0
      ? `<div class="journal-aside" data-reveal="ctn">${secondary.map(secondaryMarkup).join("")}</div>`
      : ""

  root.innerHTML = `${featureMarkup(featured)}${aside}`
}
