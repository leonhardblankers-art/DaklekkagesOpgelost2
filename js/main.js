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

  if(document.documentElement.dataset.includesLoaded === 'true'){
    initStickyCTA();
    initLogoCloud();
  } else if(document.querySelector('[data-include]')){
    document.addEventListener('includes:loaded', function(){
      initStickyCTA();
      initLogoCloud();
    }, { once: true });
  } else {
    initStickyCTA();
    initLogoCloud();
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
