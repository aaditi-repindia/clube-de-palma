import "./style.css"
import { initSplash } from "./modules/splash.js"
import { initNav } from "./modules/nav.js"
import { initAmenities } from "./modules/amenities.js"
import { initMotion } from "./modules/motion.js"

initNav()
initAmenities()
initSplash({ onComplete: initMotion })
