from pathlib import Path
from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parent.parent
SKIN_DIR = PROJECT_ROOT / "assets" / "skins" / "Skin02"
WALK_DIR = SKIN_DIR / "Walk"
JUMP_DIR = SKIN_DIR / "Jump"
TARGET_SIZE = (160, 160)
SCALE_MULTIPLIER = 1.5
MAX_CONTENT_WIDTH = 156
MAX_CONTENT_HEIGHT = 154
BOTTOM_ANCHOR = 158


def normalize_frame(source_path: Path, output_path: Path) -> None:
    with Image.open(source_path).convert("RGBA") as image:
        alpha = image.getchannel("A")
        bbox = alpha.getbbox()
        if bbox is None:
            normalized = Image.new("RGBA", TARGET_SIZE, (0, 0, 0, 0))
        else:
            crop = image.crop(bbox)
            scaled_width = min(MAX_CONTENT_WIDTH, round(crop.width * SCALE_MULTIPLIER))
            scaled_height = min(MAX_CONTENT_HEIGHT, round(crop.height * SCALE_MULTIPLIER))
            scale_ratio = min(
                scaled_width / crop.width,
                scaled_height / crop.height
            )
            draw_width = max(1, round(crop.width * scale_ratio))
            draw_height = max(1, round(crop.height * scale_ratio))
            resized = crop.resize((draw_width, draw_height), Image.Resampling.NEAREST)

            normalized = Image.new("RGBA", TARGET_SIZE, (0, 0, 0, 0))
            draw_x = round((TARGET_SIZE[0] - draw_width) / 2)
            draw_y = BOTTOM_ANCHOR - draw_height + 1
            normalized.alpha_composite(resized, (draw_x, draw_y))

        normalized.save(output_path)


def build_set(source_dir: Path, hero_prefix: str, legacy_prefix: str) -> int:
    source_files = sorted(source_dir.glob("*.png"))
    if not source_files:
        raise RuntimeError(f"No source frames found in {source_dir}")

    for index, source_path in enumerate(source_files, start=1):
        hero_path = SKIN_DIR / f"{hero_prefix}-{index:02d}.png"
        legacy_path = SKIN_DIR / f"{legacy_prefix}-{index:02d}.png"
        normalize_frame(source_path, hero_path)
        normalize_frame(source_path, legacy_path)

    for cleanup_index in range(len(source_files) + 1, 21):
        for prefix in (hero_prefix, legacy_prefix):
            cleanup_path = SKIN_DIR / f"{prefix}-{cleanup_index:02d}.png"
            cleanup_path.unlink(missing_ok=True)

    return len(source_files)


def main() -> None:
    walk_count = build_set(WALK_DIR, "hero-walk", "run")
    jump_count = build_set(JUMP_DIR, "hero-jump", "jump")
    print(f"Prepared Skin02 with {walk_count} walk frames and {jump_count} jump frames in {SKIN_DIR}")


if __name__ == "__main__":
    main()
