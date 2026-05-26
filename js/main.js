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
    var cloud = document.querySelector('.logo-cloud');
    if(!cloud || cloud.dataset.bound === 'true') return;

    cloud.dataset.bound = 'true';
    window.setTimeout(function(){
      cloud.classList.add('is-visible');
    }, 900);

    window.setTimeout(function(){
      cloud.classList.remove('is-visible');
    }, 5600);
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
