// Page scripts extracted from TE VERWERKEN/lekkageskeuzepagina.html
/* Formulierlinks -> contactformulier */
(function(){
  document.querySelectorAll('[data-contact-form-link]').forEach(function(el){
    el.setAttribute('href', '/contact#formulier');
  });
})();
