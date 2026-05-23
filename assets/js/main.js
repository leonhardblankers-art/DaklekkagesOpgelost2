(function(){
  // Sticky CTA na 300px scroll (desktop)
  var cta = document.querySelector('.sticky-cta');
  function toggleCTA(){
    if(!cta) return;
    if(window.innerWidth > 980 && window.scrollY > 300){
      cta.classList.add('is-visible');
    } else {
      cta.classList.remove('is-visible');
    }
  }
  window.addEventListener('scroll', toggleCTA);
  window.addEventListener('resize', toggleCTA);
  toggleCTA();

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