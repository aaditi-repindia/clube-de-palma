import { events } from "../data/events.js"

export function initEventsTimeline() {
  const list = document.querySelector("[data-events-timeline]")
  if (!list || !events.length) return

  list.innerHTML = events
    .map(
      (event, index) => `
        <article class="events-card" data-events-card>
          <figure class="events-card__media">
            <img
              src="${event.image}"
              alt="${event.alt}"
              width="1200"
              height="900"
              loading="${index < 2 ? "eager" : "lazy"}"
              decoding="async"
            />
          </figure>
          <div class="events-card__copy">
            <p class="events-card__when">
              <span class="events-card__date">${event.date}</span>
              <span class="events-card__sep" aria-hidden="true">·</span>
              <span class="events-card__time">${event.time}</span>
            </p>
            <div class="events-card__meta">
              <div class="events-card__heading">
                <h2 class="events-card__title">${event.title}</h2>
                <p class="events-card__place">${event.place}</p>
              </div>
              <div class="events-card__body">
                <p class="events-card__desc">${event.description}</p>
              </div>
            </div>
          </div>
        </article>
      `,
    )
    .join("")
}
