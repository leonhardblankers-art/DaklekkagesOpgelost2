(function(){
  function initStickyCTA(){
    var cta = document.querySelector('.sticky-cta');
    var hideSentinel = document.getElementById('hideStickySentinel');
    var isNearBottomCTA = false;

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

    var modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.setAttribute('data-contact-modal', '');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="contact-modal__backdrop" data-contact-modal-close></div>' +
      '<section class="contact-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">' +
        '<button class="contact-modal__close" type="button" aria-label="Formulier sluiten" data-contact-modal-close>&times;</button>' +
        '<div class="premium-kicker"><span></span>Gratis inspectie</div>' +
        '<h2 id="contact-modal-title">Vertel kort wat er aan de hand is</h2>' +
        '<p>Vul in wat u ziet of vermoedt. We beoordelen uw situatie en nemen contact op over de logische vervolgstap.</p>' +
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
          '<p class="premium-form__hint">Uw aanvraag wordt veilig naar Daklekkages Opgelost verstuurd. We gebruiken uw gegevens alleen om contact op te nemen over uw dakvraag.</p>' +
          '<p class="premium-form__status" data-form-status>Uw aanvraag wordt verstuurd...</p>' +
          '<div class="premium-actions">' +
            '<button class="premium-btn premium-btn--primary" type="submit">Formulier versturen</button>' +
            '<a class="premium-btn premium-btn--ghost" href="tel:0851308251">Liever bellen</a>' +
          '</div>' +
        '</form>' +
      '</section>';
    document.body.appendChild(modal);

    function closeModal(){
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('contact-modal-open');
    }

    function openModal(){
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
      openModal();
    });

    modal.querySelectorAll('[data-contact-modal-close]').forEach(function(closeButton){
      closeButton.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function(event){
      if(event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  if(document.documentElement.dataset.includesLoaded === 'true'){
    initStickyCTA();
    initLogoCloud();
    initContactModal();
    initContactForms();
  } else if(document.querySelector('[data-include]')){
    document.addEventListener('includes:loaded', function(){
      initStickyCTA();
      initLogoCloud();
      initContactModal();
      initContactForms();
    }, { once: true });
  } else {
    initStickyCTA();
    initLogoCloud();
    initContactModal();
    initContactForms();
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
