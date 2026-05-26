function includeHTML() {
  const includes = Array.from(document.querySelectorAll("[data-include]"));
  if (!includes.length) {
    document.documentElement.dataset.includesLoaded = "true";
    document.dispatchEvent(new CustomEvent("includes:loaded"));
    return;
  }

  Promise.all(includes.map((el) => {
    const file = el.getAttribute("data-include");
    return fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Include niet gevonden: ${file}`);
        }
        return response.text();
      })
      .then((data) => {
        el.innerHTML = data;
      })
      .catch((err) => {
        console.error("Fout bij laden van include:", err);
      });
  })).then(() => {
    document.documentElement.dataset.includesLoaded = "true";
    document.dispatchEvent(new CustomEvent("includes:loaded"));
  });
}

// Roep de functie aan wanneer het DOM klaar is
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', includeHTML);
} else {
  includeHTML();
}
