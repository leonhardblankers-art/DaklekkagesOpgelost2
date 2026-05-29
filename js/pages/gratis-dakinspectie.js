// Page scripts extracted from TE VERWERKEN/gratisdakinspectie.html

// Formulierlinks naar het eigen contactformulier
(function(){
  document.querySelectorAll('[data-contact-form-link]').forEach(function(el){
    el.setAttribute('href', '/contact#formulier');
  });
})();
