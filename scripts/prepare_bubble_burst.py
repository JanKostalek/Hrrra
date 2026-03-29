from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = PROJECT_ROOT / "assets" / "bubbel burst.png"
OUTPUT_DIR = PROJECT_ROOT / "assets" / "Bubble_burst"
FRAME_PREFIX = "bubble-burst-"
FRAME_COUNT = 9
OUTPUT_SIZE = (160, 160)
BACKGROUND_DISTANCE_THRESHOLD = 32
IDLE_OUTPUT_NAME = "shield-idle.png"


def split_bounds(total_size: int, parts: int) -> list[tuple[int, int]]:
    bounds: list[tuple[int, int]] = []
    for index in range(parts):
        start = round(index * total_size / parts)
        end = round((index + 1) * total_size / parts)
        bounds.append((start, end))
    return bounds


def remove_background(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    background_color = pixels[0, 0]
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            distance = (
                (r - background_color[0]) ** 2
                + (g - background_color[1]) ** 2
                + (b - background_color[2]) ** 2
            ) ** 0.5
            if distance <= BACKGROUND_DISTANCE_THRESHOLD:
                pixels[x, y] = (r, g, b, 0)
    return image


def create_idle_shield_asset() -> Image.Image:
    canvas = Image.new("RGBA", OUTPUT_SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas, "RGBA")

    bubble_bounds = (28, 18, 132, 144)
    inner_bounds = (34, 24, 126, 138)

    # Outer soft glow.
    glow = Image.new("RGBA", OUTPUT_SIZE, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow, "RGBA")
    glow_draw.ellipse((24, 14, 136, 148), fill=(65, 232, 255, 40))
    glow = glow.filter(ImageFilter.GaussianBlur(4))
    canvas.alpha_composite(glow)

    # Main bubble body.
    draw.ellipse(bubble_bounds, fill=(63, 196, 216, 78), outline=(37, 175, 198, 150), width=3)
    draw.ellipse(inner_bounds, fill=(152, 244, 255, 22))

    # Gentle side sheen.
    draw.ellipse((90, 32, 122, 128), fill=(255, 255, 255, 28))
    draw.ellipse((100, 40, 114, 122), fill=(255, 255, 255, 18))

    # Soft top highlights without the darker detached cap.
    draw.ellipse((48, 34, 90, 54), fill=(255, 255, 255, 46))
    draw.ellipse((86, 40, 102, 52), fill=(255, 255, 255, 32))

    # Slight lower shadow to keep volume.
    shadow = Image.new("RGBA", OUTPUT_SIZE, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow, "RGBA")
    shadow_draw.ellipse((40, 74, 120, 138), fill=(31, 78, 124, 46))
    shadow = shadow.filter(ImageFilter.GaussianBlur(8))
    canvas.alpha_composite(shadow)

    # Re-apply crisp outline after shadow blending.
    draw = ImageDraw.Draw(canvas, "RGBA")
    draw.ellipse(bubble_bounds, outline=(41, 186, 210, 170), width=2)
    return canvas


def main() -> None:
    source = Image.open(SOURCE_PATH).convert("RGBA")
    column_bounds = split_bounds(source.width, 3)
    row_bounds = split_bounds(source.height, 3)

    prepared_frames: list[Image.Image] = []
    alpha_bboxes: list[tuple[int, int, int, int]] = []
    center_x_samples: list[float] = []
    center_y_samples: list[float] = []

    for row_start, row_end in row_bounds:
        for col_start, col_end in column_bounds:
            crop = source.crop((col_start, row_start, col_end, row_end))
            crop = remove_background(crop)
            frame = crop.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)
            bbox = frame.getchannel("A").getbbox()
            if bbox is None:
                bbox = (0, 0, frame.width, frame.height)
            prepared_frames.append(frame)
            alpha_bboxes.append(bbox)
            center_x_samples.append((bbox[0] + bbox[2]) * 0.5)
            center_y_samples.append((bbox[1] + bbox[3]) * 0.5)

    target_center_x = sum(center_x_samples) / len(center_x_samples)
    target_center_y = sum(center_y_samples) / len(center_y_samples)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for frame_index, frame in enumerate(prepared_frames, start=1):
        bbox = alpha_bboxes[frame_index - 1]
        offset_x = round(target_center_x - ((bbox[0] + bbox[2]) * 0.5))
        offset_y = round(target_center_y - ((bbox[1] + bbox[3]) * 0.5))
        centered = Image.new("RGBA", OUTPUT_SIZE, (0, 0, 0, 0))
        centered.alpha_composite(frame, (offset_x, offset_y))
        output_path = OUTPUT_DIR / f"{FRAME_PREFIX}{frame_index:02d}.png"
        centered.save(output_path)
        print(output_path.relative_to(PROJECT_ROOT))

    idle_output_path = OUTPUT_DIR / IDLE_OUTPUT_NAME
    create_idle_shield_asset().save(idle_output_path)
    print(idle_output_path.relative_to(PROJECT_ROOT))

    if len(prepared_frames) != FRAME_COUNT:
        raise RuntimeError(f"Expected {FRAME_COUNT} frames, generated {len(prepared_frames)}")


if __name__ == "__main__":
    main()
