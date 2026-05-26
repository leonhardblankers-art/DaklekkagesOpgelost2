async function loadSEO(path) {
  try {
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`SEO-bestand niet gevonden: ${path}`);
    }

    const seo = await res.json();

    // Basis meta
    document.title = seo.title;
    document.getElementById("seo-description").setAttribute("content", seo.description);
    document.getElementById("seo-robots").setAttribute("content", seo.robots);
    document.getElementById("seo-canonical").setAttribute("href", seo.canonical);

    // Open Graph
    document.getElementById("seo-og-title").setAttribute("content", seo.ogTitle);
    document.getElementById("seo-og-description").setAttribute("content", seo.ogDescription);
    document.getElementById("seo-og-type").setAttribute("content", seo.ogType);
    document.getElementById("seo-og-url").setAttribute("content", seo.canonical);

    // OG Image (optioneel)
    if (seo.ogImage) {
      let ogImg = document.getElementById("seo-og-image");
      if (!ogImg) {
        ogImg = document.createElement("meta");
        ogImg.setAttribute("property", "og:image");
        ogImg.id = "seo-og-image";
        document.head.appendChild(ogImg);
      }
      ogImg.setAttribute("content", seo.ogImage);
    }

    // Structured data / schema
    if (seo.schema) {
      let script = document.getElementById("seo-schema");
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "seo-schema";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(seo.schema, null, 2);
    }

  } catch (e) {
    console.error("SEO laden mislukt:", e);
  }
}
