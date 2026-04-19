async function loadSEO(path) {
  try {
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`SEO-bestand niet gevonden: ${path}`);
    }

    const seo = await res.json();

    document.title = seo.title;

    document.getElementById("seo-description").setAttribute("content", seo.description);
    document.getElementById("seo-robots").setAttribute("content", seo.robots);
    document.getElementById("seo-canonical").setAttribute("href", seo.canonical);

    document.getElementById("seo-og-title").setAttribute("content", seo.ogTitle);
    document.getElementById("seo-og-description").setAttribute("content", seo.ogDescription);
    document.getElementById("seo-og-type").setAttribute("content", seo.ogType);
    document.getElementById("seo-og-url").setAttribute("content", seo.canonical);
  } catch (e) {
    console.error("SEO laden mislukt:", e);
  }
}