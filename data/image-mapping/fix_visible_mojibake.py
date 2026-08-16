from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TARGETS = [
    ROOT / "pages",
    ROOT / "diensten",
    ROOT / "index.html",
]

BAD = "\ufffd"

REPLACEMENTS = {
    "??n": "een",
    f"{BAD}m": "het direct",
    f"foto{BAD}s": "foto's",
    f"Foto{BAD}s": "Foto's",
    f"zo{BAD}n": "zo'n",
    f"risico{BAD}s": "risico's",
    f"{BAD}gokreparaties{BAD}": "\"gokreparaties\"",
    f"{BAD}repareren op gevoel{BAD}": "\"repareren op gevoel\"",
    f"{BAD}opgesloten{BAD}": "\"opgesloten\"",
    f"{BAD}verplaatst{BAD}": "\"verplaatst\"",
    f"{BAD}op meerdere plekken{BAD}": "\"op meerdere plekken\"",
    f"{BAD}even volgen{BAD}": "\"even volgen\"",
    f"{BAD}nu handelen{BAD}": "\"nu handelen\"",
    f"{BAD}vroegsignalen{BAD}": "\"vroegsignalen\"",
}


def iter_html_files():
    for target in TARGETS:
        if target.is_file():
            yield target
        elif target.is_dir():
            yield from target.rglob("*.html")


changed = []
for path in iter_html_files():
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in REPLACEMENTS.items():
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8", newline="")
        changed.append(path.relative_to(ROOT).as_posix())

print(f"changed {len(changed)} files")
for item in changed:
    print(item)
