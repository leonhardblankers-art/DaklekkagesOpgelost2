(function(){
  var root = document.querySelector('[data-projects-map]');
  if(!root) return;

  var map = root.querySelector('[data-projects-pin-layer]');
  var card = root.querySelector('[data-project-card]');
  var list = root.querySelector('[data-projects-list]');
  if(!map || !card || !list) return;

  fetch('/data/projects/location-projects.json')
    .then(function(response){ return response.json(); })
    .then(function(projects){
      if(!projects.length) return;

      function renderCard(project){
        card.innerHTML =
          '<div class="projects-card__media"><img src="' + project.image + '" alt="' + project.imageAlt.replace(/"/g,'&quot;') + '"></div>' +
          '<div class="projects-card__body">' +
            '<span class="projects-card__place">' + project.place + '</span>' +
            '<h3>' + project.title + '</h3>' +
            '<p>' + project.excerpt + '</p>' +
            '<div class="premium-actions"><a class="premium-btn premium-btn--primary" href="' + project.url + '">Bekijk project</a><a class="premium-btn premium-btn--ghost" href="/contact#formulier">Vergelijkbaar probleem?</a></div>' +
          '</div>';
      }

      function activate(project, button){
        root.querySelectorAll('.projects-pin').forEach(function(pin){ pin.classList.remove('is-active'); });
        if(button) button.classList.add('is-active');
        renderCard(project);
      }

      projects.forEach(function(project, index){
        var pin = document.createElement('button');
        pin.className = 'projects-pin';
        pin.type = 'button';
        pin.style.setProperty('--x', project.x);
        pin.style.setProperty('--y', project.y);
        pin.setAttribute('aria-label', project.title);
        pin.innerHTML = '<span>' + project.place + '</span>';
        pin.addEventListener('click', function(){ activate(project, pin); });
        map.appendChild(pin);

        var item = document.createElement('a');
        item.href = project.url;
        item.innerHTML = '<img src="' + project.image + '" alt="' + project.imageAlt.replace(/"/g,'&quot;') + '" loading="lazy"><span><strong>' + project.title + '</strong><span>' + project.place + '</span></span>';
        list.appendChild(item);

        if(index === 0) activate(project, pin);
      });
    })
    .catch(function(){
      root.classList.add('projects-map--failed');
    });
})();
