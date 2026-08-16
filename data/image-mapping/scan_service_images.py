from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[2]

FILES = [
    "diensten/dakconstructie-vervangen/index.html",
    "diensten/dakconstructie-repareren/index.html",
    "diensten/dakconstructie-verstevigen/index.html",
    "diensten/dakrenovatie/index.html",
    "diensten/dakbeschot-aanbrengen/index.html",
    "diensten/dakbeschot-repareren/index.html",
    "diensten/dakbeschot-vervangen/index.html",
    "diensten/dakbeschot-plat-dak-vervangen/index.html",
    "diensten/dakbeschot-plat-dak-repareren/index.html",
    "diensten/dak-isoleren/index.html",
    "diensten/dakoverstek-vervangen/index.html",
    "diensten/dakrand-vervangen/index.html",
    "diensten/dakrand-repareren/index.html",
    "diensten/windveer-vervangen/index.html",
    "diensten/windveer-repareren/index.html",
    "diensten/boeideel-bekleden/index.html",
    "diensten/boeideel-repareren/index.html",
    "diensten/boeideel-vervangen/index.html",
    "diensten/dakdoorvoer-aanbrengen/index.html",
    "diensten/dakdoorvoer-repareren/index.html",
    "diensten/dakdoorvoer-vervangen/index.html",
]

IMG_RE = re.compile(r"<img[^>]+src=['\"]([^'\"]+)", re.I)


for rel in FILES:
    path = ROOT / rel
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    print(f"\n{rel}")
    for src in IMG_RE.findall(text)[:10]:
        print(f"  {src}")
