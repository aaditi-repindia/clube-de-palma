import { ScrollTrigger } from "gsap/ScrollTrigger"
import { initMotion } from "./modules/motion.js"
import { initHeroPortal } from "./modules/hero-portal.js?v=portal4"
import { initPinnedStories } from "./modules/pinned.js?v=video-ratio1"
import { initAboutReel } from "./modules/about-reel.js"
import { initAmenities } from "./modules/amenities.js"
import { initJournal } from "./modules/journal.js"
import { initContact } from "./modules/contact.js"
import { initNav } from "./modules/nav.js"
import { mountSiteFooter } from "./modules/site-footer.js"
import { initStickyCallback } from "./modules/sticky-callback.js?v=cb4"

mountSiteFooter()

// 1. Core interaction, Lenis smooth scroll, cursor & magnetic
initMotion()

// 2. DOM-ordered pinned ScrollTrigger sections (Top -> Down)
initHeroPortal()
initPinnedStories()
initAboutReel()
initAmenities()
initJournal()
initContact()
initStickyCallback()
initNav()

// 3. Refresh ScrollTrigger to calculate exact offsets with all pins mounted
ScrollTrigger.refresh()
