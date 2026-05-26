// Page scripts extracted from TE VERWERKEN/lekkageskeuzepagina.html
/* Typeform links -> correct URL + new tab */
(function(){
  var url = 'https://form.typeform.com/to/rQsxIgyZ';
  document.querySelectorAll('.tf-popup').forEach(function(el){
    el.setAttribute('href', url);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
})();