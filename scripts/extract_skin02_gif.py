from collections import deque
from pathlib import Path
from PIL import Image, ImageSequence


PROJECT_ROOT = Path(__file__).resolve().parent.parent
SKIN_DIR = PROJECT_ROOT / "assets" / "skins" / "Skin02"
GIF_PATH = SKIN_DIR / "RunInstagram-original.gif"
ALL_FRAMES_DIR = SKIN_DIR / "all_frames"
CUTOUT_DIR = SKIN_DIR / "cutout_frames"
NORMALIZED_DIR = SKIN_DIR / "normalized_160"


def ensure_clean_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)
    for file in path.glob("*.png"):
        file.unlink()


def is_marker_pixel(r, g, b, a):
    if a < 10:
        return False
    is_red_shirt = r >= 125 and r >= g + 25 and r >= b + 25
    is_skin_tone = r >= 175 and 95 <= g <= 210 and b <= 150 and r >= b + 35
    return is_red_shirt or is_skin_tone


def is_character_pixel(r, g, b, a):
    if a < 10:
        return False
    brightness = (r + g + b) / 3.0
    if is_marker_pixel(r, g, b, a):
        return True
    if brightness <= 72:
        return True
    return False


def clamp(value, low, high):
    return max(low, min(high, value))


def get_marker_bbox(rgba: Image.Image):
    width, height = rgba.size
    pixels = rgba.load()
    search_left = int(width * 0.42)
    search_right = int(width * 0.78)
    marker_mask = [[False] * width for _ in range(height)]

    for y in range(height):
        for x in range(search_left, search_right):
            r, g, b, a = pixels[x, y]
            if is_marker_pixel(r, g, b, a):
                marker_mask[y][x] = True

    visited = [[False] * width for _ in range(height)]
    neighbors = [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]
    best_component = None

    for y in range(height):
        for x in range(search_left, search_right):
            if not marker_mask[y][x] or visited[y][x]:
                continue

            queue = deque([(x, y)])
            visited[y][x] = True
            min_x, min_y, max_x, max_y = x, y, x, y
            area = 0

            while queue:
                px, py = queue.popleft()
                area += 1
                min_x = min(min_x, px)
                min_y = min(min_y, py)
                max_x = max(max_x, px)
                max_y = max(max_y, py)

                for dx, dy in neighbors:
                    nx, ny = px + dx, py + dy
                    if nx < search_left or ny < 0 or nx >= search_right or ny >= height:
                        continue
                    if not marker_mask[ny][nx] or visited[ny][nx]:
                        continue
                    visited[ny][nx] = True
                    queue.append((nx, ny))

            if area < 6:
                continue

            component = (min_x, min_y, max_x, max_y, area)
            if best_component is None:
                best_component = component
            else:
                _, _, best_max_x, _, best_area = best_component
                if max_x > best_max_x or (max_x == best_max_x and area > best_area):
                    best_component = component

    if best_component is None:
        return None
    min_x, min_y, max_x, max_y, _ = best_component
    return (min_x, min_y, max_x, max_y)


def build_character_component(rgba: Image.Image, marker_bbox, previous_bbox):
    width, height = rgba.size
    pixels = rgba.load()

    if marker_bbox is None:
        if previous_bbox is None:
            raise RuntimeError("Failed to detect marker pixels and no previous crop is available.")
        min_x, min_y, max_x, max_y = previous_bbox
    else:
        min_x, min_y, max_x, max_y = marker_bbox
    char_left = clamp(min_x - 26, 0, width - 1)
    char_right = clamp(max_x + 30, 0, width - 1)
    char_top = clamp(min_y - 18, 0, height - 1)
    char_bottom = clamp(max_y + 72, 0, height - 1)

    crop_width = char_right - char_left + 1
    crop_height = char_bottom - char_top + 1
    isolated = Image.new("RGBA", (crop_width, crop_height), (0, 0, 0, 0))
    isolated_pixels = isolated.load()

    comp_min_x, comp_min_y = crop_width, crop_height
    comp_max_x, comp_max_y = -1, -1

    for y in range(char_top, char_bottom + 1):
        iy = y - char_top
        for x in range(char_left, char_right + 1):
            ix = x - char_left
            r, g, b, a = pixels[x, y]
            if not is_character_pixel(r, g, b, a):
                continue
            isolated_pixels[ix, iy] = (r, g, b, a)
            comp_min_x = min(comp_min_x, ix)
            comp_min_y = min(comp_min_y, iy)
            comp_max_x = max(comp_max_x, ix)
            comp_max_y = max(comp_max_y, iy)

    if comp_max_x < 0:
        raise RuntimeError("Failed to isolate the character component.")

    inner_left = clamp(comp_min_x - 4, 0, crop_width - 1)
    inner_top = clamp(comp_min_y - 4, 0, crop_height - 1)
    inner_right = clamp(comp_max_x + 4, 0, crop_width - 1)
    inner_bottom = clamp(comp_max_y + 4, 0, crop_height - 1)
    isolated = isolated.crop((inner_left, inner_top, inner_right + 1, inner_bottom + 1))

    cutout = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    target_height = min(118, max(1, isolated.height))
    target_width = max(1, round(isolated.width * (target_height / isolated.height)))
    resized = isolated.resize((target_width, target_height), Image.Resampling.NEAREST)
    paste_x = round((128 - target_width) / 2.0)
    paste_y = round((128 - target_height) / 2.0)
    cutout.alpha_composite(resized, (paste_x, paste_y))

    normalized = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
    normalized_target_height = 150
    normalized_target_width = max(1, round(cutout.width * (normalized_target_height / cutout.height)))
    normalized_resized = cutout.resize((normalized_target_width, normalized_target_height), Image.Resampling.NEAREST)
    normalized_x = round((160 - normalized_target_width) / 2.0)
    normalized_y = 158 - normalized_target_height + 1
    normalized.alpha_composite(normalized_resized, (normalized_x, normalized_y))

    return cutout, normalized, (min_x, min_y, max_x, max_y)


def main():
    if not GIF_PATH.exists():
        raise FileNotFoundError(f"Missing Skin02 GIF: {GIF_PATH}")

    ensure_clean_dir(ALL_FRAMES_DIR)
    ensure_clean_dir(CUTOUT_DIR)
    ensure_clean_dir(NORMALIZED_DIR)

    gif = Image.open(GIF_PATH)
    previous_crop = None
    frame_count = 0

    for frame_index, frame in enumerate(ImageSequence.Iterator(gif), start=1):
        rgba = frame.convert("RGBA")
        rgba.save(ALL_FRAMES_DIR / f"frame-{frame_index:02d}.png")

        marker_bbox = get_marker_bbox(rgba)
        cutout, normalized, previous_crop = build_character_component(rgba, marker_bbox, previous_crop)
        cutout.save(CUTOUT_DIR / f"frame-{frame_index:02d}.png")
        normalized.save(NORMALIZED_DIR / f"frame-{frame_index:02d}.png")
        frame_count += 1

    print(f"Extracted {frame_count} Skin02 GIF frames into all_frames, cutout_frames, and normalized_160.")


if __name__ == "__main__":
    main()
