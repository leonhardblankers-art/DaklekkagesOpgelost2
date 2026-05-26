// Page scripts extracted from TE VERWERKEN/lekkageopsporen.html
(function(){
  // Subtiele micro-animaties (reveal on scroll)
  var targets = [].slice.call(document.querySelectorAll('.reveal'));
  if(!targets.length) return;

  // Als prefers-reduced-motion: meteen tonen
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    targets.forEach(function(el){ el.classList.add('is-in'); });
    return;
  }

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });

    targets.forEach(function(el){ io.observe(el); });
  } else {
    targets.forEach(function(el){ el.classList.add('is-in'); });
  }
})();