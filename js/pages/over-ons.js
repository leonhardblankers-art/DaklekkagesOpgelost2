// Page scripts extracted from TE VERWERKEN/overons.html
(function(){
  var infoButtons = document.querySelectorAll('.info-trigger');

  infoButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var id = btn.getAttribute('aria-controls');
      if(!id) return;

      var panel = document.getElementById(id);
      var cell = document.getElementById('cell-' + id);
      if(!panel || !cell) return;

      var isOpen = panel.classList.contains('is-open');

      document.querySelectorAll('.guarantee-info.is-open').forEach(function(openPanel){
        openPanel.classList.remove('is-open');
      });
      document.querySelectorAll('.guarantee-cell.is-open').forEach(function(openCell){
        openCell.classList.remove('is-open');
      });
      document.querySelectorAll('.info-trigger[aria-expanded="true"]').forEach(function(openBtn){
        openBtn.setAttribute('aria-expanded', 'false');
      });

      if(!isOpen){
        panel.classList.add('is-open');
        cell.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', function(e){
    var insideTrigger = e.target.closest('.info-trigger');
    var insideInfo = e.target.closest('.guarantee-info');
    if(insideTrigger || insideInfo) return;

    document.querySelectorAll('.guarantee-info.is-open').forEach(function(openPanel){
      openPanel.classList.remove('is-open');
    });
    document.querySelectorAll('.guarantee-cell.is-open').forEach(function(openCell){
      openCell.classList.remove('is-open');
    });
    document.querySelectorAll('.info-trigger[aria-expanded="true"]').forEach(function(openBtn){
      openBtn.setAttribute('aria-expanded', 'false');
    });
  });
})();