import "./style.css"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { initMotion } from "./modules/motion.js"
import { initHeroPortal } from "./modules/hero-portal.js"
import { initPinnedStories } from "./modules/pinned.js"
import { initAboutReel } from "./modules/about-reel.js"
import { initAmenities } from "./modules/amenities.js"
import { initJournal } from "./modules/journal.js"
import { initContact } from "./modules/contact.js"
import { initNav } from "./modules/nav.js"

// 1. Core interaction, Lenis smooth scroll, cursor & magnetic
initMotion()

// 2. DOM-ordered pinned ScrollTrigger sections (Top -> Down)
initHeroPortal()
initPinnedStories()
initAboutReel()
initAmenities()
initJournal()
initContact()
initNav()

// 3. Refresh ScrollTrigger to calculate exact offsets with all pins mounted
ScrollTrigger.refresh()
