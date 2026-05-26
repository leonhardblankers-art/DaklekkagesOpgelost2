// Page scripts extracted from TE VERWERKEN/gratisdakinspectie.html

// CTA's openen in nieuw tabblad (geen overlay)
(function(){
  var url = 'https://form.typeform.com/to/rQsxIgyZ';
  document.querySelectorAll('.tf-popup').forEach(function(el){
    el.setAttribute('href', url);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
})();