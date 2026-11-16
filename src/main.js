import "./style.css"
import { initSplash } from "./modules/splash.js"
import { initNav } from "./modules/nav.js"
import { initAmenities } from "./modules/amenities.js"
import { initMembershipForm } from "./modules/membership.js"
import { initMotion } from "./modules/motion.js"

initNav()
initAmenities()
initMembershipForm()
initSplash({ onComplete: initMotion })
