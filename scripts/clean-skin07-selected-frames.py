from collections import deque
from pathlib import Path
import os
from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parent.parent
SKIN07_DIR = PROJECT_ROOT / "assets" / "skins" / "Skin07"
TARGET_DIRS = [SKIN07_DIR / "walk", SKIN07_DIR / "jump"]
NEIGHBORS = [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]


def is_marker_pixel(r, g, b, a):
    if a < 10:
        return False
    is_red_shirt = r >= 125 and r >= g + 20 and r >= b + 20
    is_skin = r >= 165 and 90 <= g <= 215 and b <= 165 and r >= b + 25
    return is_red_shirt or is_skin


def is_body_pixel(r, g, b, a):
    if a < 10:
        return False
    brightness = (r + g + b) / 3.0
    if is_marker_pixel(r, g, b, a):
        return True
    return brightness <= 72


def is_dust_pixel(r, g, b, a):
    if a < 10:
        return False
    brightness = (r + g + b) / 3.0
    saturation = max(r, g, b) - min(r, g, b)
    return brightness >= 215 and saturation <= 55


def collect_best_marker_component(pixels, width, height):
    visited = [[False] * width for _ in range(height)]
    best_component = None
    best_score = None
    center_x = width / 2.0
    center_y = height / 2.0

    for y in range(height):
        for x in range(width):
            if visited[y][x]:
                continue
            visited[y][x] = True
            if not is_marker_pixel(*pixels[x, y]):
                continue

            queue = deque([(x, y)])
            component = []
            min_x = max_x = x
            min_y = max_y = y

            while queue:
                cx, cy = queue.popleft()
                component.append((cx, cy))
                min_x = min(min_x, cx)
                min_y = min(min_y, cy)
                max_x = max(max_x, cx)
                max_y = max(max_y, cy)

                for dx, dy in NEIGHBORS:
                    nx, ny = cx + dx, cy + dy
                    if nx < 0 or ny < 0 or nx >= width or ny >= height or visited[ny][nx]:
                        continue
                    visited[ny][nx] = True
                    if is_marker_pixel(*pixels[nx, ny]):
                        queue.append((nx, ny))

            bbox_cx = (min_x + max_x) / 2.0
            bbox_cy = (min_y + max_y) / 2.0
            distance_penalty = abs(bbox_cx - center_x) + abs(bbox_cy - center_y)
            score = len(component) * 8 - distance_penalty
            if best_score is None or score > best_score:
                best_score = score
                best_component = (component, (min_x, min_y, max_x, max_y))

    if best_component is None:
        raise RuntimeError("No marker component detected for Skin07 frame.")
    return best_component


def collect_dust_component(body_component, pixels, width, height, start_x, start_y, bounds):
    min_body_x, _, max_body_x, max_body_y = bounds
    dust_left = max(0, min_body_x - 16)
    dust_right = min(width - 1, max_body_x + 16)
    dust_top = max(0, max_body_y - 8)
    dust_bottom = min(height - 1, max_body_y + 18)
    if start_x < dust_left or start_x > dust_right or start_y < dust_top or start_y > dust_bottom:
        return None

    visited = set()
    queue = deque([(start_x, start_y)])
    visited.add((start_x, start_y))
    component = []
    min_x = max_x = start_x
    min_y = max_y = start_y

    while queue:
        x, y = queue.popleft()
        r, g, b, a = pixels[x, y]
        if not is_dust_pixel(r, g, b, a) or body_component[y][x]:
            continue
        component.append((x, y))
        min_x = min(min_x, x)
        min_y = min(min_y, y)
        max_x = max(max_x, x)
        max_y = max(max_y, y)

        for dx, dy in NEIGHBORS:
            nx, ny = x + dx, y + dy
            if nx < dust_left or nx > dust_right or ny < dust_top or ny > dust_bottom:
                continue
            if (nx, ny) in visited:
                continue
            visited.add((nx, ny))
            queue.append((nx, ny))

    if not component:
        return None

    width_px = max_x - min_x + 1
    height_px = max_y - min_y + 1
    area = len(component)
    near_feet = max_y >= max_body_y - 2
    narrow_enough = width_px <= 18
    short_enough = height_px <= 12
    small_enough = area <= 52
    if near_feet and narrow_enough and short_enough and small_enough:
        return component
    return None


def build_main_character_mask(image, include_dust):
    width, height = image.size
    pixels = image.load()
    seeds, marker_bbox = collect_best_marker_component(pixels, width, height)
    marker_min_x, marker_min_y, marker_max_x, marker_max_y = marker_bbox

    search_left = max(0, marker_min_x - 8)
    search_right = min(width - 1, marker_max_x + 18)
    search_top = max(0, marker_min_y - 18)
    search_bottom = min(height - 1, marker_max_y + 70)

    body_mask = [[False] * width for _ in range(height)]
    lower_body_left = max(0, marker_min_x - 12)
    lower_body_right = min(width - 1, marker_max_x + 12)
    lower_body_y = marker_max_y + 8
    for y in range(search_top, search_bottom + 1):
        for x in range(search_left, search_right + 1):
            r, g, b, a = pixels[x, y]
            if is_body_pixel(r, g, b, a):
                if y > lower_body_y and (x < lower_body_left or x > lower_body_right) and not is_marker_pixel(r, g, b, a):
                    continue
                body_mask[y][x] = True

    visited = [[False] * width for _ in range(height)]
    queue = deque()
    for sx, sy in seeds:
        if body_mask[sy][sx] and not visited[sy][sx]:
            visited[sy][sx] = True
            queue.append((sx, sy))

    component = [[False] * width for _ in range(height)]
    min_x, min_y, max_x, max_y = width, height, -1, -1

    while queue:
        x, y = queue.popleft()
        component[y][x] = True
        min_x = min(min_x, x)
        min_y = min(min_y, y)
        max_x = max(max_x, x)
        max_y = max(max_y, y)

        for dx, dy in NEIGHBORS:
            nx, ny = x + dx, y + dy
            if nx < search_left or ny < search_top or nx > search_right or ny > search_bottom:
                continue
            if not body_mask[ny][nx] or visited[ny][nx]:
                continue
            visited[ny][nx] = True
            queue.append((nx, ny))

    if max_x < 0:
        raise RuntimeError("Failed to isolate Skin07 main character component.")

    if include_dust:
        dust_left = max(0, min_x - 16)
        dust_right = min(width - 1, max_x + 16)
        dust_top = max(0, max_y - 8)
        dust_bottom = min(height - 1, max_y + 18)
        processed_dust = set()

        for y in range(dust_top, dust_bottom + 1):
            for x in range(dust_left, dust_right + 1):
                if (x, y) in processed_dust:
                    continue
                r, g, b, a = pixels[x, y]
                if not is_dust_pixel(r, g, b, a) or component[y][x]:
                    continue
                dust_component = collect_dust_component(component, pixels, width, height, x, y, (min_x, min_y, max_x, max_y))
                if dust_component:
                    for px, py in dust_component:
                        processed_dust.add((px, py))
                        component[py][px] = True
                        min_x = min(min_x, px)
                        min_y = min(min_y, py)
                        max_x = max(max_x, px)
                        max_y = max(max_y, py)
                else:
                    processed_dust.add((x, y))

    return component, (min_x, min_y, max_x, max_y), (marker_min_x, marker_min_y, marker_max_x, marker_max_y)


def clean_and_normalize(path: Path):
    with Image.open(path) as opened:
        src = opened.convert("RGBA")

    include_dust = path.parent.name.lower() == "jump"
    pixels = src.load()
    component, _, marker_bbox = build_main_character_mask(src, include_dust)
    marker_min_x, marker_min_y, marker_max_x, marker_max_y = marker_bbox
    min_x = max(0, marker_min_x - 20)
    max_x = min(src.width - 1, marker_max_x + 20)
    min_y = max(0, marker_min_y - 18)
    max_y = min(src.height - 1, marker_max_y + (34 if include_dust else 24))

    crop = Image.new("RGBA", (max_x - min_x + 1, max_y - min_y + 1), (0, 0, 0, 0))
    crop_px = crop.load()

    for y in range(min_y, max_y + 1):
        for x in range(min_x, max_x + 1):
            if not component[y][x]:
                continue
            rgba = pixels[x, y]
            keep_pixel = y <= marker_max_y + 6 or (marker_min_x - 4) <= x <= (marker_max_x + 6)
            if include_dust and is_dust_pixel(*rgba):
                keep_pixel = (
                    (marker_min_x - 14) <= x <= (marker_max_x + 14)
                    and y <= marker_max_y + 18
                )
            if keep_pixel:
                crop_px[x - min_x, y - min_y] = rgba

    dest = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
    paste_x = round((160 - crop.width) / 2.0)
    paste_y = round((160 - crop.height) / 2.0)
    dest.alpha_composite(crop, (paste_x, paste_y))

    temp_path = path.with_suffix(path.suffix + ".tmp.png")
    dest.save(temp_path)
    if path.exists():
        path.unlink()
    os.replace(temp_path, path)


def main():
    for directory in TARGET_DIRS:
        if not directory.exists():
            continue
        for temp_file in directory.glob("*.tmp.png"):
            temp_file.unlink(missing_ok=True)
        for file_path in sorted(directory.glob("*.png")):
            if file_path.name.endswith(".tmp.png"):
                continue
            clean_and_normalize(file_path)
    print("Cleaned Skin07 selected walk/jump frames to transparent 160x160 PNGs.")


if __name__ == "__main__":
    main()
