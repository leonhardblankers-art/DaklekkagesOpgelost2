from pathlib import Path
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[2]
ATTACH = ROOT.parent / ".codex-remote-attachments" / "019e88af-226f-7d03-894e-6f890301034a"


def crop_box(size, crop):
    width, height = size
    left, top, right, bottom = crop
    return (
        int(width * left),
        int(height * top),
        int(width * right),
        int(height * bottom),
    )


def save_image(source_rel, dest_rel, crop=None, max_width=1800, quality=84):
    src = ATTACH / source_rel
    dest = ROOT / dest_rel
    if not src.exists():
        raise FileNotFoundError(src)

    dest.parent.mkdir(parents=True, exist_ok=True)
    img = Image.open(src)
    img = ImageOps.exif_transpose(img).convert("RGB")
    if crop:
        img = img.crop(crop_box(img.size, crop))
    if img.width > max_width:
        height = round(img.height * (max_width / img.width))
        img = img.resize((max_width, height), Image.Resampling.LANCZOS)

    suffix = dest.suffix.lower()
    if suffix == ".webp":
        img.save(dest, "WEBP", quality=quality, method=6)
    else:
        img.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
    print(dest.relative_to(ROOT))


JOBS = [
    # Over ons
    (
        "63b416ee-72e1-40e3-b6bc-31ea2b037d51/1-Photo-1.jpg",
        "assets/img/over-ons/team/moonlight-kantoorhond-daklekkages-opgelost.webp",
        None,
    ),
    # Hellend dak / dakconstructie
    (
        "d0749cb9-b35c-4dfd-bca6-4688282db388/1-Photo-1.jpg",
        "assets/img/dakconstructie-repareren/dakconstructie-repareren-live-aangetaste-sporen.webp",
        None,
    ),
    (
        "d9f9f2c5-bac7-4194-88c5-749f54dd8f88/5-Photo-5.jpg",
        "assets/img/dakconstructie-verstevigen/dakconstructie-verstevigen-live-nieuwe-kapconstructie.webp",
        None,
    ),
    (
        "fb7dc7ea-deb8-4e77-8401-b38b66b12423/5-Photo-5.jpg",
        "assets/img/dakconstructie-vervangen/dakconstructie-vervangen-live-nieuwe-sporen.webp",
        None,
    ),
    (
        "54bcb71f-c5bb-490a-973b-256a9b1f931b/2-Photo-2.jpg",
        "assets/img/dakbeschot-aanbrengen/dakbeschot-aanbrengen-live-nieuw-dakbeschot.webp",
        None,
    ),
    (
        "d9f9f2c5-bac7-4194-88c5-749f54dd8f88/3-Photo-3.jpg",
        "assets/img/dakbeschot-vervangen/dakbeschot-vervangen-live-open-kap.webp",
        None,
    ),
    (
        "fb7dc7ea-deb8-4e77-8401-b38b66b12423/2-Photo-2.jpg",
        "assets/img/dakbeschot-repareren/dakbeschot-repareren-live-dakconstructie-controle.webp",
        None,
    ),
    (
        "54bcb71f-c5bb-490a-973b-256a9b1f931b/1-Photo-1.jpg",
        "assets/img/dakrenovatie/dakrenovatie-live-open-dakrenovatie.webp",
        None,
    ),
    (
        "ed27f76c-d6fa-4c41-959a-5bb93066ec7b/1-Photo-1.jpg",
        "assets/img/dak-isoleren/dak-isoleren-live-buitenzijde-isolatie.webp",
        (0.0, 0.0, 1.0, 0.66),
    ),
    # Platte daken / dakbeschot
    (
        "7aa92e4d-27c7-470b-8895-8babcc7c8768/4-Photo-4.jpg",
        "assets/img/dakbeschot-plat-dak-vervangen/dakbeschot-plat-dak-vervangen-live-houtrot.webp",
        None,
    ),
    (
        "7aa92e4d-27c7-470b-8895-8babcc7c8768/5-Photo-5.jpg",
        "assets/img/dakbeschot-plat-dak-repareren/dakbeschot-plat-dak-repareren-live-nieuw-dakbeschot.webp",
        None,
    ),
    # Dakrand / boeideel / windveer / overstek
    (
        "afccae7b-0ac1-47e3-9acf-c91a7091c7f6/2-Photo-2.jpg",
        "assets/img/dakoverstek-vervangen/dakoverstek-vervangen-live-overstek-woning.webp",
        None,
    ),
    (
        "fd3e173c-f48d-498a-af8f-0f894a04abf4/5-Photo-5.jpg",
        "assets/img/dakrand-vervangen/dakrand-vervangen-live-dakkapel-afwerking.webp",
        None,
    ),
    (
        "fd3e173c-f48d-498a-af8f-0f894a04abf4/1-Photo-1.jpg",
        "assets/img/dakrand-repareren/dakrand-repareren-live-dakrand-detail.webp",
        None,
    ),
    (
        "d6e2bd99-41da-4e68-b184-5385b3ee5992/5-Photo-5.jpg",
        "assets/img/boeideel-bekleden/boeideel-bekleden-live-dakkapel-afwerking.webp",
        None,
    ),
    (
        "fd3e173c-f48d-498a-af8f-0f894a04abf4/4-Photo-4.jpg",
        "assets/img/boeideel-repareren/boeideel-repareren-live-dakkapel-constructie.webp",
        None,
    ),
    (
        "d6e2bd99-41da-4e68-b184-5385b3ee5992/2-Photo-2.jpg",
        "assets/img/boeideel-vervangen/boeideel-vervangen-live-dakkapel-afwerking.webp",
        None,
    ),
    (
        "d6e2bd99-41da-4e68-b184-5385b3ee5992/1-Photo-1.jpg",
        "assets/img/windveer-vervangen/windveer-vervangen-live-dakkapel-zijkant.webp",
        None,
    ),
    (
        "d6e2bd99-41da-4e68-b184-5385b3ee5992/4-Photo-4.jpg",
        "assets/img/windveer-repareren/windveer-repareren-live-dakkapel-zijkant.webp",
        None,
    ),
]


for job in JOBS:
    save_image(*job)
