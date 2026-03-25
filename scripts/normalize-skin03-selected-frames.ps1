$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$skinDir = Join-Path $projectRoot "assets/skins/Skin03"

$typeDefinition = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public static class Skin03FrameNormalizer
{
    private static Bitmap LoadUnlocked(string path)
    {
        using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
        using (var image = Image.FromStream(stream))
        {
            return new Bitmap(image);
        }
    }

    public static void NormalizeFrame(string path, int canvasSize, int targetHeight, int targetBottom, int targetCenterX)
    {
        using (var source = LoadUnlocked(path))
        {
            int width = source.Width;
            int height = source.Height;
            int minX = width;
            int minY = height;
            int maxX = -1;
            int maxY = -1;
            int[] rowCounts = new int[height];
            int[] colCounts = new int[width];

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    var c = source.GetPixel(x, y);
                    if (c.A < 10) continue;
                    rowCounts[y] += 1;
                    colCounts[x] += 1;
                }
            }

            for (int y = 0; y < height; y++)
            {
                bool ignoreRow = rowCounts[y] >= (int)Math.Round(width * 0.8);
                for (int x = 0; x < width; x++)
                {
                    var c = source.GetPixel(x, y);
                    if (c.A < 10) continue;
                    if (ignoreRow) continue;
                    if (colCounts[x] >= (int)Math.Round(height * 0.8)) continue;
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }

            if (maxX < minX || maxY < minY)
            {
                return;
            }

            int spriteW = maxX - minX + 1;
            int spriteH = maxY - minY + 1;
            using (var sprite = new Bitmap(spriteW, spriteH, PixelFormat.Format32bppArgb))
            using (var output = new Bitmap(canvasSize, canvasSize, PixelFormat.Format32bppArgb))
            using (var g = Graphics.FromImage(output))
            {
                for (int y = 0; y < spriteH; y++)
                {
                    for (int x = 0; x < spriteW; x++)
                    {
                        sprite.SetPixel(x, y, source.GetPixel(minX + x, minY + y));
                    }
                }

                g.Clear(Color.Transparent);
                g.InterpolationMode = InterpolationMode.NearestNeighbor;
                g.PixelOffsetMode = PixelOffsetMode.Half;
                g.SmoothingMode = SmoothingMode.None;

                double scale = (double)targetHeight / spriteH;
                int drawW = Math.Max(1, (int)Math.Round(spriteW * scale));
                int drawH = Math.Max(1, (int)Math.Round(spriteH * scale));
                int destX = (int)Math.Round(targetCenterX - (drawW * 0.5));
                int destY = targetBottom - drawH + 1;
                var destRect = new Rectangle(destX, destY, drawW, drawH);
                var srcRect = new Rectangle(0, 0, spriteW, spriteH);
                g.DrawImage(sprite, destRect, srcRect, GraphicsUnit.Pixel);

                string tempPath = path + ".tmp.png";
                output.Save(tempPath, ImageFormat.Png);
                File.Delete(path);
                File.Move(tempPath, path);
            }
        }
    }
}
"@

Add-Type -TypeDefinition $typeDefinition -ReferencedAssemblies System.Drawing

$walkFiles = @(
  "run-01.png",
  "run-02.png",
  "run-03.png",
  "run-04.png",
  "run-05.png",
  "run-06.png",
  "run-07.png",
  "run-08.png"
)

$jumpPlans = @(
  @{ Name = "jump-02.png"; Height = 146; Bottom = 268; CenterX = 180 },
  @{ Name = "jump-03.png"; Height = 165; Bottom = 260; CenterX = 180 },
  @{ Name = "jump-05.png"; Height = 180; Bottom = 248; CenterX = 180 },
  @{ Name = "jump-06.png"; Height = 180; Bottom = 240; CenterX = 180 },
  @{ Name = "jump-07.png"; Height = 180; Bottom = 248; CenterX = 180 },
  @{ Name = "jump-19.png"; Height = 146; Bottom = 268; CenterX = 180 },
  @{ Name = "jump-20.png"; Height = 180; Bottom = 269; CenterX = 180 }
)

foreach ($name in $walkFiles) {
  [Skin03FrameNormalizer]::NormalizeFrame((Join-Path $skinDir $name), 360, 180, 269, 180)
}

foreach ($plan in $jumpPlans) {
  [Skin03FrameNormalizer]::NormalizeFrame((Join-Path $skinDir $plan.Name), 360, $plan.Height, $plan.Bottom, $plan.CenterX)
}

Write-Output "Skin03 selected frames normalized to a shared 360x360 layout."
