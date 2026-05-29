(function(){
  var root = document.querySelector('[data-projects-map]');
  if(!root) return;

  var mapEl = root.querySelector('[data-projects-leaflet]');
  var card = root.querySelector('[data-project-card]');
  var list = root.querySelector('[data-projects-list]');
  if(!mapEl || !card || !list) return;

  function escapeHtml(value){
    return String(value || '').replace(/[&<>"']/g, function(char){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];
    });
  }

  function renderCard(project){
    card.innerHTML =
      '<div class="projects-card__media"><img src="' + escapeHtml(project.image) + '" alt="' + escapeHtml(project.imageAlt) + '"></div>' +
      '<div class="projects-card__body">' +
        '<span class="projects-card__place">' + escapeHtml(project.place) + '</span>' +
        '<h3>' + escapeHtml(project.title) + '</h3>' +
        '<p>' + escapeHtml(project.excerpt) + '</p>' +
        '<div class="premium-actions"><a class="premium-btn premium-btn--primary" href="' + escapeHtml(project.url) + '">Bekijk project</a><a class="premium-btn premium-btn--ghost" href="/contact#formulier">Vergelijkbaar probleem?</a></div>' +
      '</div>';
  }

  fetch('/data/projects/location-projects.json')
    .then(function(response){ return response.json(); })
    .then(function(projects){
      projects = projects.filter(function(project){ return project.lat && project.lng; });
      if(!projects.length) return;

      if(!window.L){
        root.classList.add('projects-map--failed');
        mapEl.textContent = 'De interactieve kaart kon niet geladen worden. De projecten hieronder blijven wel beschikbaar.';
        return;
      }

      var map = L.map(mapEl, {
        scrollWheelZoom: false,
        zoomControl: true
      }).setView([51.88, 5.35], 8);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      var bounds = L.latLngBounds([]);
      var markers = [];

      function markerIcon(active){
        return L.divIcon({
          className: '',
          html: '<span class="projects-marker' + (active ? ' is-active' : '') + '"></span>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12]
        });
      }

      function activate(project, marker){
        markers.forEach(function(item){ item.marker.setIcon(markerIcon(false)); });
        if(marker){
          marker.setIcon(markerIcon(true));
          marker.openPopup();
        }
        renderCard(project);
      }

      projects.forEach(function(project, index){
        var marker = L.marker([project.lat, project.lng], { icon: markerIcon(false), title: project.title }).addTo(map);
        marker.bindPopup(
          '<div class="projects-popup"><strong>' + escapeHtml(project.title) + '</strong><span>' + escapeHtml(project.place) + '</span><a href="' + escapeHtml(project.url) + '">Bekijk project</a></div>',
          { className: 'projects-popup' }
        );
        marker.on('click', function(){ activate(project, marker); });
        markers.push({ marker: marker, project: project });
        bounds.extend([project.lat, project.lng]);

        var item = document.createElement('a');
        item.href = project.url;
        item.innerHTML = '<img src="' + escapeHtml(project.image) + '" alt="' + escapeHtml(project.imageAlt) + '" loading="lazy"><span><strong>' + escapeHtml(project.title) + '</strong><span>' + escapeHtml(project.place) + '</span></span>';
        item.addEventListener('mouseenter', function(){ marker.setIcon(markerIcon(true)); });
        item.addEventListener('mouseleave', function(){
          if(!marker.isPopupOpen()) marker.setIcon(markerIcon(false));
        });
        item.addEventListener('focus', function(){ marker.setIcon(markerIcon(true)); });
        item.addEventListener('blur', function(){
          if(!marker.isPopupOpen()) marker.setIcon(markerIcon(false));
        });
        list.appendChild(item);

        if(index === 0) activate(project, marker);
      });

      if(markers.length > 1){
        map.fitBounds(bounds, { padding: [42, 42], maxZoom: 9 });
      }
    })
    .catch(function(){
      root.classList.add('projects-map--failed');
      mapEl.textContent = 'De interactieve kaart kon niet geladen worden. De projecten hieronder blijven wel beschikbaar.';
    });
})();
