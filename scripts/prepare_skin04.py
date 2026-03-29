from pathlib import Path
from PIL import Image, ImageSequence


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_GIF = Path(r"C:\-_WeB_-\_test\spider walk.gif")
SKIN_DIR = PROJECT_ROOT / "assets" / "skins" / "Skin04"
CANVAS_SIZE = (160, 160)
ICON_SIZE = (112, 112)


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def transparentize_white(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = []
    for r, g, b, a in image.getdata():
        if a == 0 or (r > 245 and g > 245 and b > 245):
            pixels.append((255, 255, 255, 0))
        else:
            pixels.append((r, g, b, 255))
    image.putdata(pixels)
    return image


def crop_visible(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    if not bbox:
        return image
    return image.crop(bbox)


def fit_to_canvas(image: Image.Image, scale: float = 1.0, anchor: str = "bottom") -> Image.Image:
    image = crop_visible(transparentize_white(image))
    base_ratio = min((CANVAS_SIZE[0] - 12) / image.width, (CANVAS_SIZE[1] - 18) / image.height)
    resize_ratio = max(0.01, base_ratio * scale)
    new_size = (
        max(1, int(round(image.width * resize_ratio))),
        max(1, int(round(image.height * resize_ratio))),
    )
    resized = image.resize(new_size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", CANVAS_SIZE, (255, 255, 255, 0))
    x = (CANVAS_SIZE[0] - resized.width) // 2
    if anchor == "top":
        y = 8
    elif anchor == "center":
        y = (CANVAS_SIZE[1] - resized.height) // 2
    else:
        y = CANVAS_SIZE[1] - resized.height - 6
    canvas.alpha_composite(resized, (x, y))
    return canvas


def make_icon(image: Image.Image) -> Image.Image:
    image = crop_visible(transparentize_white(image))
    ratio = min(ICON_SIZE[0] / image.width, ICON_SIZE[1] / image.height)
    size = (
        max(1, int(round(image.width * ratio))),
        max(1, int(round(image.height * ratio))),
    )
    resized = image.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", ICON_SIZE, (255, 255, 255, 0))
    x = (ICON_SIZE[0] - resized.width) // 2
    y = (ICON_SIZE[1] - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))
    return canvas


def shear_x(image: Image.Image, factor: float) -> Image.Image:
    w, h = image.size
    shift = int(abs(factor) * h)
    new_w = w + shift
    transformed = image.transform(
        (new_w, h),
        Image.Transform.AFFINE,
        (1, factor, -shift if factor > 0 else 0, 0, 1, 0),
        resample=Image.Resampling.BICUBIC,
    )
    return transformed


def build_jump_variant(image: Image.Image, scale: float, shear: float = 0.0, vertical_offset: int = 0) -> Image.Image:
    sprite = crop_visible(transparentize_white(image))
    if shear:
        sprite = shear_x(sprite, shear)
    base_ratio = min((CANVAS_SIZE[0] - 12) / sprite.width, (CANVAS_SIZE[1] - 18) / sprite.height)
    ratio = max(0.01, base_ratio * scale)
    size = (
        max(1, int(round(sprite.width * ratio))),
        max(1, int(round(sprite.height * ratio))),
    )
    sprite = sprite.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", CANVAS_SIZE, (255, 255, 255, 0))
    x = (CANVAS_SIZE[0] - sprite.width) // 2
    y = CANVAS_SIZE[1] - sprite.height - 6 - vertical_offset
    canvas.alpha_composite(sprite, (x, y))
    return canvas


def main() -> None:
    ensure_dir(SKIN_DIR)
    if not SOURCE_GIF.exists():
        raise FileNotFoundError(f"Missing source GIF: {SOURCE_GIF}")

    gif = Image.open(SOURCE_GIF)
    walk_frames = [frame.convert("RGBA") for frame in ImageSequence.Iterator(gif)]

    for index, frame in enumerate(walk_frames, start=1):
        raw_path = SKIN_DIR / f"run-{index:02}.png"
        hero_path = SKIN_DIR / f"hero-walk-{index:02}.png"
        transparentize_white(frame).save(raw_path)
        fit_to_canvas(frame, scale=1.0, anchor="bottom").save(hero_path)

    jump_sources = [
        (walk_frames[0], 0.96, -0.10, 0),
        (walk_frames[3], 0.98, -0.18, 8),
        (walk_frames[5], 0.92, -0.10, 18),
        (walk_frames[7], 0.84, 0.0, 26),
        (walk_frames[10], 0.92, 0.10, 18),
        (walk_frames[13], 0.98, 0.18, 8),
        (walk_frames[15], 0.96, 0.10, 0),
    ]

    for index, (frame, scale, shear, vertical_offset) in enumerate(jump_sources, start=1):
        raw_path = SKIN_DIR / f"jump-{index:02}.png"
        hero_path = SKIN_DIR / f"hero-jump-{index:02}.png"
        jump_frame = build_jump_variant(frame, scale=scale, shear=shear, vertical_offset=vertical_offset)
        jump_frame.save(raw_path)
        jump_frame.save(hero_path)

    make_icon(walk_frames[7]).save(SKIN_DIR / "hero-icon.png")


if __name__ == "__main__":
    main()
