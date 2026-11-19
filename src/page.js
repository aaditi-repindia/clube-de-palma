import "./style.css"
import { initNav } from "./modules/nav.js"
import { initAmenitiesTabs } from "./modules/amenities-tabs.js"
import { initEventsTimeline } from "./modules/events-timeline.js"
import { initContact } from "./modules/contact.js"
import { initFooterReveal } from "./modules/motion.js"
import { mountSiteFooter } from "./modules/site-footer.js"

mountSiteFooter()
initNav()
initAmenitiesTabs()
initEventsTimeline()
initContact()
initFooterReveal()
