$ErrorActionPreference = 'Stop'

Add-Type -ReferencedAssemblies @('System.Drawing', 'System.Runtime') -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class Level4ParallaxGenerator {
    private static byte Clamp(double value) {
        if (value < 0) return 0;
        if (value > 255) return 255;
        return (byte)Math.Round(value);
    }

    private static void SaveBitmap(Bitmap bitmap, string path) {
        string tempPath = path + ".tmp.png";
        bitmap.Save(tempPath, ImageFormat.Png);
        if (System.IO.File.Exists(path)) {
            System.IO.File.Delete(path);
        }
        System.IO.File.Move(tempPath, path);
    }

    private static Bitmap Crop(Bitmap source, Rectangle srcRect) {
        Bitmap target = new Bitmap(srcRect.Width, srcRect.Height, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(target)) {
            g.Clear(Color.Transparent);
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            g.DrawImage(source, new Rectangle(0, 0, target.Width, target.Height), srcRect, GraphicsUnit.Pixel);
        }
        return target;
    }

    private static void TintAndAlpha(Bitmap bitmap, double rMul, double gMul, double bMul, Func<double, double, double> alphaFn) {
        Rectangle rect = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
        BitmapData data = bitmap.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        try {
            int bytes = Math.Abs(data.Stride) * data.Height;
            byte[] buffer = new byte[bytes];
            Marshal.Copy(data.Scan0, buffer, 0, bytes);

            for (int y = 0; y < bitmap.Height; y++) {
                double yRatio = (double)y / Math.Max(1, bitmap.Height - 1);
                for (int x = 0; x < bitmap.Width; x++) {
                    double xRatio = (double)x / Math.Max(1, bitmap.Width - 1);
                    int idx = (y * data.Stride) + (x * 4);
                    byte b = buffer[idx + 0];
                    byte g = buffer[idx + 1];
                    byte r = buffer[idx + 2];
                    byte a = buffer[idx + 3];

                    buffer[idx + 0] = Clamp(b * bMul);
                    buffer[idx + 1] = Clamp(g * gMul);
                    buffer[idx + 2] = Clamp(r * rMul);
                    buffer[idx + 3] = Clamp(a * alphaFn(xRatio, yRatio));
                }
            }

            Marshal.Copy(buffer, 0, data.Scan0, bytes);
        }
        finally {
            bitmap.UnlockBits(data);
        }
    }

    public static void Generate(string sourcePath, string backPath, string midPath, string frontPath) {
        using (Bitmap source = new Bitmap(sourcePath)) {
            int sliceHeight = source.Height / 3;
            using (Bitmap back = Crop(source, new Rectangle(0, 0, source.Width, sliceHeight)))
            using (Bitmap mid = Crop(source, new Rectangle(0, sliceHeight, source.Width, sliceHeight)))
            using (Bitmap front = Crop(source, new Rectangle(0, source.Height - sliceHeight, source.Width, sliceHeight))) {
                TintAndAlpha(back, 0.95, 1.02, 0.94, (x, y) => 0.98 - (y * 0.10));
                TintAndAlpha(mid, 0.94, 1.00, 0.93, (x, y) => 0.58 + ((1.0 - Math.Abs((x - 0.5) * 2.0)) * 0.12) + ((1.0 - y) * 0.08));
                TintAndAlpha(front, 0.96, 1.00, 0.92, (x, y) => {
                    double bottomBoost = 0.42 + (y * 0.58);
                    double horizonFade = y < 0.22 ? (0.18 + (y / 0.22) * 0.30) : 1.0;
                    return Math.Min(1.0, bottomBoost * horizonFade);
                });

                SaveBitmap(back, backPath);
                SaveBitmap(mid, midPath);
                SaveBitmap(front, frontPath);
            }
        }
    }
}
"@

$repoRoot = Split-Path -Parent $PSScriptRoot
[Level4ParallaxGenerator]::Generate(
  (Join-Path $repoRoot 'assets/forest/futuristic forest.png'),
  (Join-Path $repoRoot 'assets/forest/level4_forest_back_tile.png'),
  (Join-Path $repoRoot 'assets/forest/level4_forest_mid_tile.png'),
  (Join-Path $repoRoot 'assets/forest/level4_forest_front_tile.png')
)
