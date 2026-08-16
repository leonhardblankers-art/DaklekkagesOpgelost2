from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[2]


def html_files():
    yield from ROOT.glob("*.html")
    yield from (ROOT / "diensten").glob("*/index.html")
    yield from (ROOT / "pages").glob("*/index.html")


def normalize_src(src: str) -> str:
    if src.startswith("https://www.daklekkagesopgelost.nl"):
        return src.split("https://www.daklekkagesopgelost.nl", 1)[1]
    if src.startswith("./"):
        return "/" + src[2:]
    return src


missing = []
pattern = re.compile(r"""(?:src|href|content)=["']([^"']*?/assets/img/[^"']+)["']""")

for html in html_files():
    text = html.read_text(encoding="utf-8", errors="ignore")
    for match in pattern.finditer(text):
        src = match.group(1)
        rel = normalize_src(src)
        if rel.startswith("/"):
            path = ROOT / rel.lstrip("/")
            if not path.exists():
                missing.append((html.relative_to(ROOT), src))

print(f"missing {len(missing)}")
for page, src in missing:
    print(f"{page} => {src}")
