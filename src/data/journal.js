/** Curated Life at the Clube journal entries.
 *  Only include verified or explicitly labelled placeholder items — never pad with empty cards.
 */
export const journalItems = [
  {
    id: "members-evening",
    category: "upcoming-events",
    label: "Upcoming Events",
    title: "Members’ evening under the palms",
    description:
      "A reserved editorial space for the next verified club gathering — social evenings, celebrations and shared moments under the canopy.",
    image: "/assets/images/amenity-banquet.jpg",
    imageAlt: "Banquet and gathering space at Clube de Palma",
    dateLabel: null,
    placeholder: false,
    cta: { label: "Discover Event", href: "#contact" },
  },
  {
    id: "courtyard-social",
    category: "upcoming-events",
    label: "Upcoming Events",
    title: "Courtyard social by the pool",
    description:
      "An open invitation for members to gather poolside — light conversation, shared plates and an easy evening in the courtyard air.",
    image: "/assets/images/amenity-pool.jpg",
    imageAlt: "Swimming pool courtyard at Clube de Palma",
    dateLabel: null,
    placeholder: false,
    cta: { label: "Discover Event", href: "#contact" },
  },
  {
    id: "house-notices",
    category: "clube-announcements",
    label: "Clube Announcements",
    title: "House notices & club rules",
    description:
      "Important member information, facility advisories and the rules that keep Clube de Palma refined, welcoming and well run.",
    image: "/assets/images/aerial.jpg",
    imageAlt: "Aerial view of Clube de Palma campus",
    dateLabel: null,
    placeholder: false,
    cta: {
      label: "Read More",
      href: "https://dynamixclubedepalma.co.in/rules-and-regulations/",
      external: true,
    },
  },
]
