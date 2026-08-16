from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
BAD_MARKERS = ("�", "Ã", "Â", "â", "��")
SCAN_DIRS = ("", "diensten", "pages", "assets/css", "assets/js", "data")
EXTENSIONS = {".html", ".css", ".js", ".json", ".txt"}


def files():
    seen = set()
    for directory in SCAN_DIRS:
        base = ROOT / directory
        if base.is_file():
            candidates = [base]
        elif base.exists():
            candidates = list(base.rglob("*"))
        else:
            candidates = []
        for path in candidates:
            if path.is_file() and path.suffix.lower() in EXTENSIONS and path not in seen:
                seen.add(path)
                yield path


hits = []
for path in files():
    text = path.read_text(encoding="utf-8", errors="ignore")
    for number, line in enumerate(text.splitlines(), start=1):
        if any(marker in line for marker in BAD_MARKERS):
            hits.append((path.relative_to(ROOT), number, line.strip()))

print(f"encoding_hits {len(hits)}")
for path, number, line in hits[:200]:
    print(f"{path}:{number}: {line[:220]}")
