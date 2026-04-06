function includeHTML() {
  document.querySelectorAll('[data-include]').forEach(el => {
    fetch(el.getAttribute('data-include'))
      .then(resp => resp.text())
      .then(data => el.innerHTML = data);
  });
}
document.addEventListener('DOMContentLoaded', includeHTML);
