function getSiteRoot() {
  const script = document.querySelector('script[src$="/js/include.js"], script[src$="js/include.js"]');
  if (!script) return new URL('./', window.location.href);
  return new URL(script.getAttribute('src'), window.location.href).href.replace(/js\/include\.js(?:\?.*)?$/, '');
}

function normaliseInternalLinks() {
  const siteRoot = getSiteRoot();

  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('//')) return;
    const cleanHref = href.replace(/^\/+/, '').replace(/\/?$/, '/');
    link.setAttribute('href', new URL(cleanHref, siteRoot).href);
  });

  document.querySelectorAll('img[src^="/assets/"], img[src^="./assets/"]').forEach((img) => {
    const src = img.getAttribute('src');
    const cleanSrc = src.replace(/^\.?\//, '');
    img.setAttribute('src', new URL(cleanSrc, siteRoot).href);
  });
}

function initHeaderMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu && hamburger.dataset.bound !== 'true') {
    hamburger.dataset.bound = 'true';
    hamburger.addEventListener('click', () => {
      const open = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!open));
      hamburger.classList.toggle('is-open', !open);
      mobileMenu.classList.toggle('is-open', !open);
      mobileMenu.setAttribute('aria-hidden', String(open));
    });
  }

  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.nav-link, .mobile-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    try {
      const linkPath = new URL(href, window.location.href).pathname.replace(/\/index\.html$/, '/');
      if (linkPath === currentPath) link.classList.add('is-active');
    } catch (e) {
      // Laat ongeldige of externe links ongemoeid.
    }
  });
}

function afterIncludesLoaded() {
  normaliseInternalLinks();
  initHeaderMenu();
  document.documentElement.dataset.includesLoaded = "true";
  document.dispatchEvent(new CustomEvent("includes:loaded"));
}

function includeHTML() {
  const includes = Array.from(document.querySelectorAll("[data-include]"));
  if (!includes.length) {
    afterIncludesLoaded();
    return;
  }

  Promise.all(includes.map((el) => {
    const file = el.getAttribute("data-include");
    return fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Include niet gevonden: ${file}`);
        }
        return response.text();
      })
      .then((data) => {
        el.innerHTML = data;
      })
      .catch((err) => {
        console.error("Fout bij laden van include:", err);
      });
  })).then(() => {
    afterIncludesLoaded();
  });
}

// Roep de functie aan wanneer het DOM klaar is
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', includeHTML);
} else {
  includeHTML();
}
