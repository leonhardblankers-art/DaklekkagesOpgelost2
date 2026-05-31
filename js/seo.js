async function loadSEO(path) {
  try {
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`SEO-bestand niet gevonden: ${path}`);
    }

    const seo = await res.json();

    const ensureMeta = (selector, createAttrs) => {
      let node = document.querySelector(selector);
      if (!node) {
        node = document.createElement("meta");
        Object.entries(createAttrs).forEach(([key, value]) => node.setAttribute(key, value));
        document.head.appendChild(node);
      }
      return node;
    };

    const ensureLink = (selector, createAttrs) => {
      let node = document.querySelector(selector);
      if (!node) {
        node = document.createElement("link");
        Object.entries(createAttrs).forEach(([key, value]) => node.setAttribute(key, value));
        document.head.appendChild(node);
      }
      return node;
    };

    // Basis meta
    document.title = seo.title;
    ensureMeta("#seo-description, meta[name='description']", { name: "description", id: "seo-description" }).setAttribute("content", seo.description);
    ensureMeta("#seo-robots, meta[name='robots']", { name: "robots", id: "seo-robots" }).setAttribute("content", seo.robots);
    ensureLink("#seo-canonical, link[rel='canonical']", { rel: "canonical", id: "seo-canonical" }).setAttribute("href", seo.canonical);

    // Open Graph
    ensureMeta("#seo-og-title, meta[property='og:title']", { property: "og:title", id: "seo-og-title" }).setAttribute("content", seo.ogTitle);
    ensureMeta("#seo-og-description, meta[property='og:description']", { property: "og:description", id: "seo-og-description" }).setAttribute("content", seo.ogDescription);
    ensureMeta("#seo-og-type, meta[property='og:type']", { property: "og:type", id: "seo-og-type" }).setAttribute("content", seo.ogType);
    ensureMeta("#seo-og-url, meta[property='og:url']", { property: "og:url", id: "seo-og-url" }).setAttribute("content", seo.canonical);

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
