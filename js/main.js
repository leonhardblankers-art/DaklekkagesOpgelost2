(function(){
  function getPageIntent(){
    var path = window.location.pathname.toLowerCase();
    var title = (document.querySelector('h1') || {}).textContent || '';
    var intent = {
      key: 'default',
      tone: 'green',
      kicker: 'Dakvraag laten beoordelen',
      stickyLabel: 'Direct hulp nodig?',
      stickyBadge: 'Gratis',
      stickyButton: 'Dakinspectie aanvragen',
      modalTitle: 'Vertel kort wat er aan de hand is',
      modalText: 'Beschrijf wat u ziet of vermoedt. We beoordelen of inspectie, opsporing, spoedherstel of een gerichte reparatie de logische vervolgstap is.',
      aanvraag: 'Gratis dakinspectie',
      urgentie: 'Ik twijfel en wil advies',
      stripTitle: 'Niet zeker welke vervolgstap past?',
      stripText: 'Kies niet op gevoel. Laat kort meekijken, dan weet u of inspectie, opsporing of gericht herstel logisch is.',
      primary: 'Situatie laten beoordelen',
      secondary: 'Bel direct'
    };

    if(path.indexOf('spoed') !== -1 || path.indexOf('nood') !== -1){
      return Object.assign(intent, {
        key: 'spoed',
        tone: 'orange',
        kicker: 'Spoed of actieve lekkage',
        stickyLabel: 'Water komt binnen?',
        stickyBadge: 'Spoed',
        stickyButton: 'Schade beperken',
        modalTitle: 'Laat snel inschatten wat nodig is',
        modalText: 'Bij actieve lekkage draait het eerst om schade beperken. Beschrijf kort wat er gebeurt, dan bepalen we of noodreparatie of directe opvolging verstandig is.',
        aanvraag: 'Spoed of noodreparatie',
        urgentie: 'Er komt nu water binnen',
        stripTitle: 'Komt er nu water binnen?',
        stripText: 'Dan is eerst schade beperken belangrijker dan uitgebreid vergelijken. Geef kort door wat er gebeurt of bel direct.',
        primary: 'Spoedhulp aanvragen'
      });
    }

    if(path.indexOf('lekkage') !== -1 || path.indexOf('lekkages') !== -1){
      return Object.assign(intent, {
        key: 'lekkage',
        kicker: 'Oorzaak laten bepalen',
        stickyLabel: 'Lekkage of vocht?',
        stickyButton: 'Oorzaak laten bepalen',
        modalTitle: 'Laat de lekkage gericht beoordelen',
        modalText: 'Water wordt vaak ergens anders zichtbaar dan waar het binnenkomt. Beschrijf het symptoom, dan helpen we kiezen tussen opsporen, inspectie of herstel.',
        aanvraag: 'Daklekkage of vochtplek',
        urgentie: 'Ik zie vocht of schade',
        stripTitle: 'Ziet u vocht, schimmel of druppelsporen?',
        stripText: 'Start met de oorzaak. Dat voorkomt gokreparaties en maakt duidelijk welke lekkagepagina of dienst past.',
        primary: 'Oorzaak laten bepalen'
      });
    }

    if(path.indexOf('dakinspectie') !== -1 || path.indexOf('gratis-dakinspectie') !== -1){
      return Object.assign(intent, {
        key: 'inspectie',
        kicker: 'Rustig laten beoordelen',
        stickyLabel: 'Twijfel over uw dak?',
        stickyButton: 'Inspectie aanvragen',
        modalTitle: 'Vraag een dakinspectie aan',
        modalText: 'Beschrijf waarom u twijfelt. We kijken of inspectie genoeg is of dat lekkage opsporen of gericht herstel logischer is.',
        aanvraag: 'Gratis dakinspectie',
        urgentie: 'Preventieve inspectie',
        stripTitle: 'Twijfel hoeft geen gok te blijven',
        stripText: 'Een inspectie geeft duidelijkheid over de staat van het dak en voorkomt onnodig herstel.',
        primary: 'Dak laten beoordelen'
      });
    }

    if(path.indexOf('kennisbank') !== -1 || path.indexOf('/blog/') !== -1){
      return Object.assign(intent, {
        key: 'kennisbank',
        kicker: 'Twijfel laten meekijken',
        stickyLabel: 'Twijfelt u nog?',
        stickyButton: 'Laat meekijken',
        modalTitle: 'Laat uw situatie kort beoordelen',
        modalText: 'Heeft u na het lezen nog twijfel? Beschrijf uw situatie, dan helpen we bepalen of inspectie, afwachten of herstel logisch is.',
        aanvraag: 'Gratis dakinspectie',
        urgentie: 'Ik twijfel en wil advies',
        stripTitle: 'Van informatie naar zekerheid',
        stripText: 'Herkent u uw situatie in dit artikel? Laat kort meekijken voordat u conclusies trekt.',
        primary: 'Twijfel laten beoordelen'
      });
    }

    if(path.indexOf('diensten') !== -1 || title.toLowerCase().indexOf('dienst') !== -1){
      return Object.assign(intent, {
        key: 'diensten',
        kicker: 'Juiste dakdienst kiezen',
        stickyLabel: 'Welke dienst past?',
        stickyButton: 'Route laten kiezen',
        modalTitle: 'Welke dakdienst past bij uw situatie?',
        modalText: 'Beschrijf het dakdeel en wat u ziet. We helpen kiezen tussen inspectie, lekkage opsporen, schoorsteenwerk, loodwerk, renovatie of spoedherstel.',
        aanvraag: 'Dakrenovatie of ander dakwerk',
        urgentie: 'Ik twijfel en wil advies',
        stripTitle: 'Niet zeker welke dienst u nodig heeft?',
        stripText: 'Vertel welk dakdeel speelt. Wij sturen u naar de juiste route of adviseren eerst een inspectie.',
        primary: 'Dienst laten kiezen'
      });
    }

    return intent;
  }

  function setSelectValue(select, preferred){
    if(!select || !preferred) return;
    for(var i = 0; i < select.options.length; i++){
      if(select.options[i].text === preferred || select.options[i].value === preferred){
        select.selectedIndex = i;
        return;
      }
    }
  }

  function initStickyCTA(){
    var cta = document.querySelector('.sticky-cta');
    var hideSentinel = document.getElementById('hideStickySentinel');
    var isNearBottomCTA = false;
    var intent = getPageIntent();

    if(cta){
      var box = cta.querySelector('.sticky-cta__box');
      var label = cta.querySelector('.sticky-cta__label');
      var badge = cta.querySelector('.sticky-cta__free-badge');
      var primary = cta.querySelector('.sticky-cta__inspect');

      cta.dataset.intent = intent.key;
      if(box) box.dataset.tone = intent.tone;
      if(label) label.innerHTML = '<span class="dot"></span> ' + intent.stickyLabel;
      if(badge) badge.textContent = intent.stickyBadge;
      if(primary){
        primary.innerHTML = '<span class="sticky-cta__free-badge">' + intent.stickyBadge + '</span>' + intent.stickyButton;
        primary.setAttribute('data-contact-intent', intent.key);
      }
    }

    function toggleCTA(){
      if(!cta) return;
      if(window.innerWidth > 1200 && window.scrollY > 300 && !isNearBottomCTA){
        cta.classList.add('is-visible');
      } else {
        cta.classList.remove('is-visible');
      }
    }

    if(!cta) return;
    window.addEventListener('scroll', toggleCTA, { passive: true });
    window.addEventListener('resize', toggleCTA);

    if(hideSentinel && 'IntersectionObserver' in window){
      var stickyObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          isNearBottomCTA = entry.isIntersecting;
          toggleCTA();
        });
      }, { rootMargin: '0px 0px -35% 0px' });
      stickyObserver.observe(hideSentinel);
    }

    toggleCTA();
  }

  function initLogoCloud(){
    if(window.__wolkjeInit || window.__wolkjeClosed) return;
    window.__wolkjeInit = true;

    var tries = 0;
    var maxTries = 30;

    function init(){
      var logo = document.querySelector('.logo img');

      if(!logo){
        tries++;
        if(tries < maxTries) window.setTimeout(init, 250);
        return;
      }

      if(document.querySelector('.logo-wolkje')) return;

      var cloud = document.createElement('div');
      cloud.className = 'logo-wolkje';
      cloud.innerHTML = '<strong>Daklekkages Oplossen is niet het enige wat wij doen.</strong> Lekkages, loodwerk,<br>dakrenovaties, dakisolatie en alle dakgerelateerde werkzaamheden onder een dak.';
      document.body.appendChild(cloud);

      if(window.innerWidth > 768){
        var rect = logo.getBoundingClientRect();
        var left = window.scrollX + rect.left + (rect.width / 2) - (cloud.offsetWidth / 2);
        var minLeft = window.scrollX + 16;
        var maxLeft = window.scrollX + window.innerWidth - cloud.offsetWidth - 16;

        cloud.style.top = window.scrollY + rect.bottom + 22 + 'px';
        cloud.style.left = Math.max(minLeft, Math.min(left, maxLeft)) + 'px';
      }

      cloud.classList.add('visible');

      window.setTimeout(function(){
        cloud.classList.remove('visible');
        window.__wolkjeClosed = true;
      }, 6000);
    }

    init();
  }

  function initContactForms(){
    document.querySelectorAll('[data-dlo-contact-form]').forEach(function(form){
      if(form.dataset.bound === 'true') return;
      form.dataset.bound = 'true';

      form.addEventListener('submit', async function(event){
        event.preventDefault();

        var data = new FormData(form);
        var payload = {
          aanvraag: data.get('aanvraag') || '',
          urgentie: data.get('urgentie') || '',
          naam: data.get('naam') || '',
          telefoon: data.get('telefoon') || '',
          email: data.get('email') || '',
          plaats: data.get('plaats') || '',
          omschrijving: data.get('omschrijving') || ''
        };
        var lines = [
          'Nieuwe aanvraag via daklekkagesopgelost.nl',
          '',
          'Onderwerp: ' + (payload.aanvraag || '-'),
          'Urgentie: ' + (payload.urgentie || '-'),
          'Naam: ' + (payload.naam || '-'),
          'Telefoon: ' + (payload.telefoon || '-'),
          'E-mail: ' + (payload.email || '-'),
          'Plaats: ' + (payload.plaats || '-'),
          '',
          'Omschrijving:',
          payload.omschrijving || '-'
        ];

        var subject = 'Aanvraag via website - ' + (payload.aanvraag || 'dakinspectie');
        var href = 'mailto:info@daklekkagesopgelost.nl?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
        var status = form.querySelector('[data-form-status]');
        var submit = form.querySelector('[type="submit"]');

        if(status){
          status.textContent = 'Uw aanvraag wordt verstuurd...';
          status.classList.add('is-visible');
        }
        if(submit) submit.disabled = true;

        try {
          var response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if(response.ok){
            form.reset();
            if(status) status.textContent = 'Bedankt, uw aanvraag is verzonden. We nemen zo snel mogelijk contact op.';
            if(submit) submit.disabled = false;
            return;
          }
        } catch(error) {
          // De statische lokale versie heeft geen API-route; dan gebruiken we de e-mail fallback.
        }

        if(status) status.textContent = 'Uw e-mailprogramma wordt geopend om de aanvraag te versturen.';
        if(submit) submit.disabled = false;
        window.location.href = href;
      });
    });
  }

  function initContactModal(){
    if(document.querySelector('[data-contact-modal]')) return;
    var activeIntent = getPageIntent();

    var modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.setAttribute('data-contact-modal', '');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="contact-modal__backdrop" data-contact-modal-close></div>' +
      '<section class="contact-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">' +
        '<button class="contact-modal__close" type="button" aria-label="Formulier sluiten" data-contact-modal-close>&times;</button>' +
        '<div class="premium-kicker" data-contact-modal-kicker><span></span>Dakvraag laten beoordelen</div>' +
        '<h2 id="contact-modal-title">Vertel kort wat er aan de hand is</h2>' +
        '<p data-contact-modal-text>Beschrijf wat u ziet of vermoedt. We beoordelen of inspectie, opsporing, spoedherstel of een gerichte reparatie de logische vervolgstap is.</p>' +
        '<form class="premium-form" data-dlo-contact-form>' +
          '<div class="premium-form__grid">' +
            '<label>Waar gaat het om?' +
              '<select name="aanvraag" required>' +
                '<option value="">Kies een onderwerp</option>' +
                '<option>Daklekkage of vochtplek</option>' +
                '<option>Gratis dakinspectie</option>' +
                '<option>Spoed of noodreparatie</option>' +
                '<option>Loodwerk of schoorsteen</option>' +
                '<option>Dakrenovatie of ander dakwerk</option>' +
              '</select>' +
            '</label>' +
            '<label>Urgentie' +
              '<select name="urgentie" required>' +
                '<option value="">Kies urgentie</option>' +
                '<option>Er komt nu water binnen</option>' +
                '<option>Ik zie vocht of schade</option>' +
                '<option>Ik twijfel en wil advies</option>' +
                '<option>Preventieve inspectie</option>' +
              '</select>' +
            '</label>' +
            '<label>Naam<input name="naam" autocomplete="name" required></label>' +
            '<label>Telefoonnummer<input name="telefoon" autocomplete="tel" inputmode="tel" required></label>' +
            '<label>E-mailadres<input name="email" type="email" autocomplete="email" required></label>' +
            '<label>Plaats<input name="plaats" autocomplete="address-level2"></label>' +
            '<label class="premium-form__full">Omschrijving<textarea name="omschrijving" required placeholder="Bijvoorbeeld: waar ziet u vocht, wanneer treedt het op, welk dakdeel lijkt betrokken?"></textarea></label>' +
          '</div>' +
          '<p class="premium-form__hint">120+ reviews &bull; snelle opvolging &bull; geen verplichting na de eerste beoordeling.</p>' +
          '<p class="premium-form__status" data-form-status>Uw aanvraag wordt verstuurd...</p>' +
          '<div class="premium-actions">' +
            '<button class="premium-btn premium-btn--primary" type="submit">Aanvraag versturen</button>' +
            '<a class="premium-btn premium-btn--ghost" href="tel:0851308251">Liever bellen</a>' +
          '</div>' +
        '</form>' +
      '</section>';
    document.body.appendChild(modal);

    function applyIntent(intent){
      activeIntent = intent || getPageIntent();
      modal.dataset.intent = activeIntent.key;
      var kicker = modal.querySelector('[data-contact-modal-kicker]');
      var heading = modal.querySelector('#contact-modal-title');
      var text = modal.querySelector('[data-contact-modal-text]');
      if(kicker) kicker.innerHTML = '<span></span>' + activeIntent.kicker;
      if(heading) heading.textContent = activeIntent.modalTitle;
      if(text) text.textContent = activeIntent.modalText;
      setSelectValue(modal.querySelector('select[name="aanvraag"]'), activeIntent.aanvraag);
      setSelectValue(modal.querySelector('select[name="urgentie"]'), activeIntent.urgentie);
    }

    function closeModal(){
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('contact-modal-open');
    }

    function openModal(intent){
      applyIntent(intent);
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('contact-modal-open');
      var firstField = modal.querySelector('select, input, textarea, button');
      if(firstField) firstField.focus({ preventScroll: true });
    }

    document.addEventListener('click', function(event){
      var opener = event.target.closest('a[href]');
      if(!opener || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var href = opener.getAttribute('href') || '';
      var opensContactForm = href === '#formulier' || href.indexOf('/contact#formulier') !== -1 || href.indexOf('/pages/contact/#formulier') !== -1;
      if(!opensContactForm) return;

      event.preventDefault();
      openModal(getPageIntent());
    });

    modal.querySelectorAll('[data-contact-modal-close]').forEach(function(closeButton){
      closeButton.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function(event){
      if(event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  function initSmartConversionBlocks(){
    if(document.querySelector('[data-smart-conversion]')) return;
    var main = document.querySelector('main');
    if(!main) return;

    var path = window.location.pathname.toLowerCase();
    if(path.indexOf('/contact') !== -1) return;

    var intent = getPageIntent();
    var anchor = main.querySelector('.premium-hero, .kb-hero, .soft, .hero');
    if(!anchor) return;

    var strip = document.createElement('section');
    strip.className = 'smart-conversion';
    strip.setAttribute('data-smart-conversion', '');
    strip.innerHTML =
      '<div class="smart-conversion__inner">' +
        '<div class="smart-conversion__copy">' +
          '<span class="smart-conversion__kicker"><i></i>' + intent.kicker + '</span>' +
          '<h2>' + intent.stripTitle + '</h2>' +
          '<p>' + intent.stripText + '</p>' +
        '</div>' +
        '<div class="smart-conversion__routes" aria-label="Snelle routes">' +
          '<a href="/pages/diensten/noodreparatie/"><b>Nu water binnen</b><span>Schade beperken</span></a>' +
          '<a href="/pages/lekkages/lekkage-opsporen/"><b>Bron onzeker</b><span>Lekkage opsporen</span></a>' +
          '<a href="/pages/diensten/gratis-dakinspectie/"><b>Twijfel of preventie</b><span>Dakinspectie</span></a>' +
        '</div>' +
        '<div class="smart-conversion__actions">' +
          '<a class="smart-conversion__primary" href="/contact#formulier" data-contact-intent="' + intent.key + '">' + intent.primary + '</a>' +
          '<a class="smart-conversion__secondary" href="tel:0851308251">' + intent.secondary + '</a>' +
        '</div>' +
      '</div>';

    anchor.insertAdjacentElement('afterend', strip);
  }

  function initProjectProof(){
    var path = window.location.pathname.toLowerCase();
    if(path.indexOf('/diensten/') === -1 && path.indexOf('/lekkages/') === -1) return;
    if(document.querySelector('[data-project-proof]')) return;

    var target = document.querySelector('main .premium-section:last-of-type, main .section:last-of-type');
    if(!target) return;

    fetch('/data/projects/location-projects.json')
      .then(function(response){ return response.ok ? response.json() : []; })
      .then(function(projects){
        if(!Array.isArray(projects) || !projects.length) return;
        var keyword = 'schoorsteen';
        if(path.indexOf('plat') !== -1) keyword = 'plat';
        if(path.indexOf('dakkapel') !== -1 || path.indexOf('dakraam') !== -1) keyword = 'dak';
        if(path.indexOf('lood') !== -1) keyword = 'lood';

        var selected = projects.filter(function(project){
          var text = ((project.title || '') + ' ' + (project.summary || '') + ' ' + (project.category || '')).toLowerCase();
          return text.indexOf(keyword) !== -1;
        }).slice(0, 3);
        if(selected.length < 3) selected = projects.slice(0, 3);

        var section = document.createElement('section');
        section.className = 'project-proof';
        section.setAttribute('data-project-proof', '');
        section.innerHTML =
          '<div class="project-proof__inner">' +
            '<div class="project-proof__head">' +
              '<span class="smart-conversion__kicker"><i></i>Praktijkvoorbeelden</span>' +
              '<h2>Vergelijkbare dakproblemen die we eerder oplosten</h2>' +
              '<p>Projecten geven sneller vertrouwen dan alleen uitleg. Bekijk voorbeelden uit de praktijk of laat uw eigen situatie beoordelen.</p>' +
            '</div>' +
            '<div class="project-proof__grid">' + selected.map(function(project){
              return '<a href="' + (project.url || '/pages/over-ons/uitgevoerde-projecten/') + '">' +
                '<img src="' + (project.image || '/assets/img/logo-dark.png') + '" alt="' + (project.imageAlt || project.title || 'Uitgevoerd dakproject') + '" loading="lazy" decoding="async">' +
                '<span>' + (project.place || project.location || 'Uitgevoerd project') + '</span>' +
                '<strong>' + (project.title || 'Dakproject door Daklekkages Opgelost') + '</strong>' +
              '</a>';
            }).join('') + '</div>' +
          '</div>';
        target.insertAdjacentElement('beforebegin', section);
      })
      .catch(function(){});
  }

  if(document.documentElement.dataset.includesLoaded === 'true'){
    initStickyCTA();
    initLogoCloud();
    initContactModal();
    initContactForms();
    initSmartConversionBlocks();
    initProjectProof();
  } else if(document.querySelector('[data-include]')){
    document.addEventListener('includes:loaded', function(){
      initStickyCTA();
      initLogoCloud();
      initContactModal();
      initContactForms();
      initSmartConversionBlocks();
      initProjectProof();
    }, { once: true });
  } else {
    initStickyCTA();
    initLogoCloud();
    initContactModal();
    initContactForms();
    initSmartConversionBlocks();
    initProjectProof();
  }

  // Subtiele micro-animaties (reveal on scroll)
  var revealTargets = [].slice.call(document.querySelectorAll('.sec, .card, .node, details.chooser__item, .media-card'));
  revealTargets.forEach(function(el){ if(!el.classList.contains('reveal')) el.classList.add('reveal'); });

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });

    revealTargets.forEach(function(el){ io.observe(el); });
  } else {
    revealTargets.forEach(function(el){ el.classList.add('is-in'); });
  }
})();
