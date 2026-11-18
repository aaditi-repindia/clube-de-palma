const FOOTER_HTML = `
<footer class="footer" id="contact">
  <div class="footer__main">
    <div class="container footer__inner">
      <div class="footer__content">
        <div class="footer__content-left">
          <a class="footer__logo-wrap" href="/" aria-label="Clube de Palma home">
            <img
              class="footer__logo"
              src="/assets/logos/cdp-logo-white.png"
              alt="Clube de Palma"
              width="411"
              height="212"
              loading="lazy"
              decoding="async"
            />
          </a>
          <p class="footer__tagline">A Coastal Sanctuary. Stay Connected</p>
          <form class="footer__subscribe" data-newsletter-form novalidate>
            <input
              type="email"
              class="footer__subscribe-input"
              placeholder="Enter your email"
              aria-label="Enter your email"
              required
            />
            <button class="footer__subscribe-btn" type="submit">Subscribe</button>
          </form>
          <p class="footer__subscribe-feedback" data-subscribe-feedback role="status" aria-live="polite"></p>

          <nav class="footer__nav-left" aria-label="Footer navigation">
            <ul class="footer__nav-list">
              <li><a href="/about.html" class="footer__nav-link">About Us</a></li>
              <li><a href="/amenities.html" class="footer__nav-link">Amenities</a></li>
              <li><a href="/events.html" class="footer__nav-link">Events</a></li>
              <li><a href="/contact.html" class="footer__nav-link">Contact Us</a></li>
              <li><a href="https://dynamixclubedepalma.co.in/clubdepalma/membership/form" target="_blank" rel="noopener noreferrer" class="footer__nav-link">Apply for membership</a></li>
            </ul>
          </nav>
        </div>

        <div class="footer__content-right">
          <div class="footer__contact-links">
            <a href="tel:+919699751872" class="footer__contact-link">
              <span>+91 96997 51872</span>
              <span class="footer__contact-line" aria-hidden="true"></span>
            </a>
            <a href="tel:+918301826935" class="footer__contact-link">
              <span>+91 83018 26935</span>
              <span class="footer__contact-line" aria-hidden="true"></span>
            </a>
            <a href="mailto:info@dynamixclubedepalma.co.in" class="footer__contact-link">
              <span>info@dynamixclubedepalma.co.in</span>
              <span class="footer__contact-line" aria-hidden="true"></span>
            </a>
          </div>

          <ul class="footer__nav-list footer__nav-list--socials">
            <li><a href="https://www.instagram.com/dynamixgroup/" target="_blank" rel="noopener noreferrer" class="footer__nav-link">Instagram</a></li>
            <li><a href="https://www.facebook.com/thedynamixgroup" target="_blank" rel="noopener noreferrer" class="footer__nav-link">Facebook</a></li>
            <li><a href="https://www.linkedin.com/company/14441348/" target="_blank" rel="noopener noreferrer" class="footer__nav-link">LinkedIn</a></li>
            <li><a href="https://wa.me/919699751872" target="_blank" rel="noopener noreferrer" class="footer__nav-link">Whats App</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__meta">
        <p class="footer__meta-copy">© <span id="year">2025</span> Clubedepalma. All rights reserved</p>
        <div class="footer__legal-links">
          <a href="https://dynamixclubedepalma.co.in/rules-and-regulations/" target="_blank" rel="noopener noreferrer" class="footer__legal-link">clube rules</a>
          <span class="footer__legal-sep" aria-hidden="true">|</span>
          <a href="https://dynamixclubedepalma.co.in/code-of-conduct/" target="_blank" rel="noopener noreferrer" class="footer__legal-link">code of conduct</a>
          <span class="footer__legal-sep" aria-hidden="true">|</span>
          <a href="https://dynamixclubedepalma.co.in/privacy-policy/" target="_blank" rel="noopener noreferrer" class="footer__legal-link">privacy policy</a>
          <span class="footer__legal-sep" aria-hidden="true">|</span>
          <a href="https://dynamixclubedepalma.co.in/cancellation-and-refund/" target="_blank" rel="noopener noreferrer" class="footer__legal-link">cancellation policy</a>
        </div>
      </div>
    </div>
  </div>

  <div class="footer__wordmark" aria-hidden="true">
    <span class="footer__wordmark-text">CLUBE DE PALMA</span>
  </div>

  <div class="footer__reveal-wrapper" data-footer-reveal-wrapper>
    <div class="footer__reveal" data-footer-reveal>
      <div class="footer__reveal-bg" data-footer-reveal-bg></div>
      <div class="footer__reveal-overlay" aria-hidden="true"></div>
      <div class="footer__reveal-content" data-footer-reveal-content>
        <h2 class="footer__reveal-heading">Join the Membership</h2>
        <a
          href="https://dynamixclubedepalma.co.in/clubdepalma/membership/form"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__reveal-cta"
          data-magnetic
        >
          <span class="footer__reveal-cta-text" data-magnetic-inner>
            Become a member <span class="btn__arrow" aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </div>
  </div>
</footer>
`

export function mountSiteFooter() {
  const mount = document.querySelector("[data-site-footer]")
  if (!mount) return null

  mount.outerHTML = FOOTER_HTML.trim()
  return document.getElementById("contact")
}
