function getSiteRoot() {
  const script = document.querySelector('script[src$="/js/include.js"], script[src$="js/include.js"]');
  if (!script) return new URL('./', window.location.href);
  return new URL(script.getAttribute('src'), window.location.href).href.replace(/js\/include\.js(?:\?.*)?$/, '');
}

const pageRoutes = {
  'algemene-voorwaarden': 'pages/legal/algemene-voorwaarden/',
  'contact': 'pages/contact/',
  'dakgoot-vervangen': 'pages/diensten/dakgoot-vervangen/',
  'dak-isoleren': 'pages/diensten/dak-isoleren/',
  'dakkapel-lood-vervangen': 'pages/diensten/dakkapel-lood-vervangen/',
  'dakkapel-renoveren': 'pages/diensten/dakkapel-renoveren/',
  'dakinspectie': 'pages/diensten/dakinspectie/',
  'daklekkage': 'pages/lekkages/daklekkage/',
  'daklood-loodslabben-lekkage': 'pages/lekkages/daklood-loodslabben-lekkage/',
  'daklood-vervangen': 'pages/diensten/daklood-vervangen/',
  'dakraamlood-vervangen': 'pages/diensten/dakraamlood-vervangen/',
  'dak-reinigen': 'pages/diensten/dak-reinigen/',
  'dakrenovatie': 'pages/diensten/dakrenovatie/',
  'diensten': 'pages/diensten/',
  'diensten-dakgoot': 'pages/diensten/diensten-dakgoot/',
  'diensten-dakkapel': 'pages/diensten/diensten-dakkapel/',
  'diensten-dakraam': 'pages/diensten/diensten-dakraam/',
  'diensten-loodafwerkingen': 'pages/diensten/diensten-loodafwerkingen/',
  'diensten-plat-dak': 'pages/diensten/diensten-plat-dak/',
  'diensten-schoorsteen': 'pages/diensten/diensten-schoorsteen/',
  'diensten-schuin-dak': 'pages/diensten/diensten-schuin-dak/',
  'gratis-dakinspectie': 'pages/diensten/gratis-dakinspectie/',
  'kennisbank': 'pages/kennisbank/',
  'kozijnlood-vervangen': 'pages/diensten/kozijnlood-vervangen/',
  'lekkage-opsporen': 'pages/lekkages/lekkage-opsporen/',
  'lekkages': 'pages/lekkages/',
  'loodslabben-lekkage': 'pages/lekkages/loodslabben-lekkage/',
  'metselwerk-repareren': 'pages/diensten/metselwerk-repareren/',
  'noklekkage': 'pages/lekkages/noklekkage/',
  'nokrenovatie': 'pages/diensten/nokrenovatie/',
  'noodreparatie': 'pages/diensten/noodreparatie/',
  'over-ons': 'pages/over-ons/',
  'plat-dak-overlagen': 'pages/diensten/plat-dak-overlagen/',
  'plat-dak-reparatie': 'pages/diensten/plat-dak-reparatie/',
  'plat-dak-vervangen': 'pages/diensten/plat-dak-vervangen/',
  'pleisteren': 'pages/diensten/pleisteren/',
  'privacyverklaring': 'pages/legal/privacyverklaring/',
  'rapportage-dakinspectie': 'pages/diensten/rapportage-dakinspectie/',
  'schoorsteenlekkage': 'pages/lekkages/schoorsteenlekkage/',
  'schoorsteenlood-spouw-vervangen': 'pages/diensten/schoorsteenlood-spouw-vervangen/',
  'schoorsteenlood-vervangen': 'pages/diensten/schoorsteenlood-vervangen/',
  'schoorsteen-opnieuw-opmetselen': 'pages/diensten/schoorsteen-opnieuw-opmetselen/',
  'schoorsteenrenovatie': 'pages/diensten/schoorsteenrenovatie/',
  'schoorsteen-verwijderen': 'pages/diensten/schoorsteen-verwijderen/',
  'spoedreparatie': 'pages/diensten/spoedreparatie/',
  'trapsgewijs-lood-vervangen': 'pages/diensten/trapsgewijs-lood-vervangen/',
  'uitgevoerde-projecten': 'pages/over-ons/uitgevoerde-projecten/'
};

function shouldUseRepoPageRoutes() {
  return !/(\.|^)daklekkagesopgelost\.nl$/i.test(window.location.hostname);
}

function resolveInternalPath(href) {
  const parsed = new URL(href, window.location.origin);
  const slug = parsed.pathname.replace(/^\/+|\/+$/g, '');

  if (!slug) {
    return `${parsed.search}${parsed.hash}`;
  }

  const route = shouldUseRepoPageRoutes() ? pageRoutes[slug] : null;
  const cleanPath = route || `${slug}/`;
  return `${cleanPath}${parsed.search}${parsed.hash}`;
}

function normaliseInternalLinks() {
  const siteRoot = getSiteRoot();

  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('//')) return;
    link.setAttribute('href', new URL(resolveInternalPath(href), siteRoot).href);
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
