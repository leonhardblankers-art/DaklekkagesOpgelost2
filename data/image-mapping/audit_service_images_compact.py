import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
IMG_RE = re.compile(r'<img[^>]+src="([^"]+)"', re.I)


def load_json(name):
    return json.loads((ROOT / "data" / "image-mapping" / name).read_text(encoding="utf-8"))


def service_pages():
    for html in sorted((ROOT / "diensten").glob("*/index.html")):
        slug = html.parent.name
        text = html.read_text(encoding="utf-8", errors="replace")
        imgs = [src for src in IMG_RE.findall(text) if src.startswith("/assets/img/")]
        yield slug, html, imgs


def main():
    refs = list(service_pages())
    weak = load_json("service-image-weak-candidates.json")

    by_reason = Counter(item["reason"] for item in weak)
    by_src = defaultdict(list)
    for slug, _html, imgs in refs:
        for src in imgs:
            by_src[src].append(slug)

    repeated = {
        src: slugs
        for src, slugs in by_src.items()
        if len(set(slugs)) > 1 and "/logo" not in src.lower()
    }

    firsts = []
    for slug, _html, imgs in refs:
        first = imgs[0] if imgs else ""
        folder = first.split("/")[3] if first.startswith("/assets/img/") and len(first.split("/")) > 3 else ""
        firsts.append((slug, folder, first))

    # Very light mismatch hints; this is only for prioritising manual review.
    category_terms = {
        "dakconstructie": ["constructie", "kap", "spoor", "gording", "dakconstructie"],
        "dakbeschot": ["dakbeschot", "beschot", "dakrenovatie", "dakconstructie"],
        "dakdoorvoer": ["dakdoorvoer", "doorvoer", "ventilatie", "rookgas", "riool"],
        "boeideel": ["boeideel", "dakrand", "overstek", "windveer"],
        "windveer": ["windveer", "dakrand", "boeideel", "overstek"],
        "dakrand": ["dakrand", "boeideel", "overstek", "windveer"],
        "dakoverstek": ["overstek", "dakrand", "boeideel"],
    }
    hints = []
    for slug, folder, first in firsts:
        for key, terms in category_terms.items():
            if key in slug:
                hay = f"{folder} {first}".lower()
                if not any(term in hay for term in terms):
                    hints.append((slug, folder, first))
                break

    report = {
        "service_page_count": len(refs),
        "weak_reason_counts": dict(by_reason),
        "repeated_asset_count": len(repeated),
        "repeated_assets": [
            {"src": src, "slugs": sorted(set(slugs))}
            for src, slugs in sorted(repeated.items(), key=lambda kv: (-len(set(kv[1])), kv[0]))
        ],
        "first_image_mismatch_hints": [
            {"slug": slug, "folder": folder, "src": src} for slug, folder, src in hints
        ],
        "first_images": [
            {"slug": slug, "folder": folder, "src": src} for slug, folder, src in firsts
        ],
    }
    out = ROOT / "data" / "image-mapping" / "service-image-compact-report.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"service pages: {report['service_page_count']}")
    print(f"weak candidates: {len(weak)}")
    print("weak reasons:", ", ".join(f"{k}={v}" for k, v in by_reason.most_common()))
    print(f"repeated assets: {report['repeated_asset_count']}")
    print(f"first-image mismatch hints: {len(hints)}")
    print("top repeated:")
    for item in report["repeated_assets"][:12]:
        print(f"- {item['src']} :: {', '.join(item['slugs'][:8])}")
    print("top mismatch hints:")
    for item in report["first_image_mismatch_hints"][:16]:
        print(f"- {item['slug']} -> {item['folder']} :: {item['src']}")
    print(f"report: {out}")


if __name__ == "__main__":
    main()
