function includeHTML() {
  document.querySelectorAll("[data-include]").forEach((el) => {
    const file = el.getAttribute("data-include");

    fetch(file)
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
  });
}

document.addEventListener("DOMContentLoaded", includeHTML);