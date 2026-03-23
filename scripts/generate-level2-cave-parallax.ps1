Add-Type -AssemblyName System.Drawing

$backPath = Join-Path $PSScriptRoot "..\assets\level2\background_back_tile.png"
$frontPath = Join-Path $PSScriptRoot "..\assets\level2\background_front_tile.png"
$width = 1536
$height = 560
$rng = [System.Random]::new(20260318)

function Clamp-Byte([double]$value) {
  if ($value -lt 0) { return 0 }
  if ($value -gt 255) { return 255 }
  return [int][Math]::Round($value)
}

function New-ArgbBrush([int]$a, [int]$r, [int]$g, [int]$b) {
  return [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($a, $r, $g, $b))
}

function Fill-PolygonFromPoints($graphics, $brush, [double[]]$points) {
  $pointObjects = New-Object System.Drawing.PointF[] ($points.Length / 2)
  for ($i = 0; $i -lt $points.Length; $i += 2) {
    $pointObjects[$i / 2] = [System.Drawing.PointF]::new([float]$points[$i], [float]$points[$i + 1])
  }
  $graphics.FillPolygon($brush, $pointObjects)
}

function Draw-Crystal($graphics, [double]$x, [double]$y, [double]$w, [double]$h, [System.Drawing.Color]$core, [System.Drawing.Color]$glow) {
  $glowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(68, $glow.R, $glow.G, $glow.B))
  $coreBrush = [System.Drawing.SolidBrush]::new($core)
  $highlightPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(180, 255, 255, 255), 2)

  $graphics.FillEllipse($glowBrush, [float]($x - $w * 0.55), [float]($y - $h * 0.35), [float]($w * 1.1), [float]($h * 1.1))
  Fill-PolygonFromPoints $graphics $coreBrush @(
    $x, ($y - $h * 0.5),
    ($x + $w * 0.38), ($y - $h * 0.05),
    ($x + $w * 0.14), ($y + $h * 0.5),
    ($x - $w * 0.22), ($y + $h * 0.12)
  )
  $graphics.DrawLine($highlightPen, [float]$x, [float]($y - $h * 0.42), [float]($x + $w * 0.15), [float]($y + $h * 0.18))
  $graphics.DrawLine($highlightPen, [float]($x - $w * 0.05), [float]($y - $h * 0.22), [float]($x - $w * 0.1), [float]($y + $h * 0.22))

  $highlightPen.Dispose()
  $coreBrush.Dispose()
  $glowBrush.Dispose()
}

function Add-Stalactites($graphics, [int]$canvasWidth, [int]$canvasHeight, [bool]$fromTop, [int]$count, [System.Drawing.Color]$color) {
  $brush = [System.Drawing.SolidBrush]::new($color)
  for ($i = 0; $i -lt $count; $i++) {
    $baseX = $rng.NextDouble() * $canvasWidth
    $baseWidth = 70 + $rng.NextDouble() * 160
    $depth = 70 + $rng.NextDouble() * 150
    if ($fromTop) {
      Fill-PolygonFromPoints $graphics $brush @(
        ($baseX - $baseWidth * 0.5), -4,
        ($baseX + $baseWidth * 0.5), -4,
        ($baseX + $baseWidth * 0.16), ($depth * 0.38),
        ($baseX + $baseWidth * 0.06), ($depth * 0.62),
        $baseX, $depth,
        ($baseX - $baseWidth * 0.08), ($depth * 0.58),
        ($baseX - $baseWidth * 0.18), ($depth * 0.3)
      )
    } else {
      Fill-PolygonFromPoints $graphics $brush @(
        ($baseX - $baseWidth * 0.46), ($canvasHeight + 4),
        ($baseX + $baseWidth * 0.46), ($canvasHeight + 4),
        ($baseX + $baseWidth * 0.14), ($canvasHeight - $depth * 0.38),
        ($baseX + $baseWidth * 0.02), ($canvasHeight - $depth * 0.72),
        $baseX, ($canvasHeight - $depth),
        ($baseX - $baseWidth * 0.08), ($canvasHeight - $depth * 0.64),
        ($baseX - $baseWidth * 0.18), ($canvasHeight - $depth * 0.28)
      )
    }
  }
  $brush.Dispose()
}

function Add-CaveFog($graphics, [int]$canvasWidth, [int]$canvasHeight) {
  for ($i = 0; $i -lt 12; $i++) {
    $w = 220 + $rng.NextDouble() * 320
    $h = 40 + $rng.NextDouble() * 70
    $x = ($rng.NextDouble() * $canvasWidth) - ($w * 0.3)
    $y = ($canvasHeight * 0.18) + ($rng.NextDouble() * $canvasHeight * 0.55)
    $alpha = 14 + [int]($rng.NextDouble() * 20)
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($alpha, 170, 228, 255))
    $graphics.FillEllipse($brush, [float]$x, [float]$y, [float]$w, [float]$h)
    $brush.Dispose()
  }
}

function Add-CaveColumns($graphics, [int]$canvasWidth, [int]$canvasHeight, [int]$count, [System.Drawing.Color]$color, [double]$alphaScale) {
  $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb([int](255 * $alphaScale), $color.R, $color.G, $color.B))
  for ($i = 0; $i -lt $count; $i++) {
    $x = $rng.NextDouble() * $canvasWidth
    $w = 90 + $rng.NextDouble() * 180
    $h = $canvasHeight * (0.4 + $rng.NextDouble() * 0.45)
    $y = $canvasHeight - $h
    $archInset = 18 + $rng.NextDouble() * 30
    Fill-PolygonFromPoints $graphics $brush @(
      ($x - $w * 0.5), $canvasHeight,
      ($x - $w * 0.4), ($y + $archInset),
      ($x - $w * 0.18), $y,
      ($x + $w * 0.18), $y,
      ($x + $w * 0.42), ($y + $archInset * 0.9),
      ($x + $w * 0.5), $canvasHeight
    )
  }
  $brush.Dispose()
}

$back = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gBack = [System.Drawing.Graphics]::FromImage($back)
$gBack.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gBack.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gBack.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$backGradient = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
  [System.Drawing.PointF]::new(0, 0),
  [System.Drawing.PointF]::new(0, $height),
  [System.Drawing.Color]::FromArgb(255, 8, 16, 34),
  [System.Drawing.Color]::FromArgb(255, 20, 36, 58)
)
$gBack.FillRectangle($backGradient, 0, 0, $width, $height)
$backGradient.Dispose()

for ($i = 0; $i -lt 7; $i++) {
  $w = 260 + $rng.NextDouble() * 440
  $h = 130 + $rng.NextDouble() * 220
  $x = ($rng.NextDouble() * $width) - ($w * 0.2)
  $y = 30 + $rng.NextDouble() * 220
  $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(20 + [int]($rng.NextDouble() * 18), 70, 170, 215))
  $gBack.FillEllipse($brush, [float]$x, [float]$y, [float]$w, [float]$h)
  $brush.Dispose()
}

Add-CaveColumns $gBack $width $height 10 ([System.Drawing.Color]::FromArgb(30, 48, 70)) 0.42
Add-CaveColumns $gBack $width $height 7 ([System.Drawing.Color]::FromArgb(43, 67, 94)) 0.58
Add-CaveFog $gBack $width $height

for ($i = 0; $i -lt 14; $i++) {
  $x = 40 + $rng.NextDouble() * ($width - 80)
  $y = 110 + $rng.NextDouble() * ($height - 220)
  $size = 24 + $rng.NextDouble() * 34
  Draw-Crystal $gBack $x $y $size ($size * 1.7) ([System.Drawing.Color]::FromArgb(220, 94, 246, 255)) ([System.Drawing.Color]::FromArgb(120, 90, 240, 255))
}

$back.Save($backPath, [System.Drawing.Imaging.ImageFormat]::Png)
$gBack.Dispose()
$back.Dispose()

$front = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gFront = [System.Drawing.Graphics]::FromImage($front)
$gFront.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gFront.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gFront.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFront.Clear([System.Drawing.Color]::Transparent)

Add-Stalactites $gFront $width $height $true 18 ([System.Drawing.Color]::FromArgb(225, 18, 25, 39))
Add-Stalactites $gFront $width $height $false 14 ([System.Drawing.Color]::FromArgb(235, 22, 30, 44))

$ledgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 26, 36, 52))
for ($i = 0; $i -lt 9; $i++) {
  $x = $rng.NextDouble() * $width
  $w = 140 + $rng.NextDouble() * 260
  $h = 60 + $rng.NextDouble() * 120
  $y = 40 + $rng.NextDouble() * 120
  Fill-PolygonFromPoints $gFront $ledgeBrush @(
    ($x - $w * 0.5), ($y + $h * 0.2),
    ($x - $w * 0.12), $y,
    ($x + $w * 0.28), ($y + $h * 0.14),
    ($x + $w * 0.5), ($y + $h * 0.56),
    ($x + $w * 0.24), ($y + $h),
    ($x - $w * 0.28), ($y + $h * 0.86)
  )
}
$ledgeBrush.Dispose()

for ($i = 0; $i -lt 20; $i++) {
  $x = 30 + $rng.NextDouble() * ($width - 60)
  $y = 70 + $rng.NextDouble() * ($height - 120)
  $size = 30 + $rng.NextDouble() * 50
  Draw-Crystal $gFront $x $y $size ($size * 1.85) ([System.Drawing.Color]::FromArgb(236, 110, 255, 255)) ([System.Drawing.Color]::FromArgb(130, 55, 225, 255))
}

for ($i = 0; $i -lt 18; $i++) {
  $w = 180 + $rng.NextDouble() * 260
  $h = 30 + $rng.NextDouble() * 48
  $x = ($rng.NextDouble() * $width) - ($w * 0.2)
  $y = ($height * 0.5) + ($rng.NextDouble() * $height * 0.35)
  $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(12 + [int]($rng.NextDouble() * 18), 150, 220, 255))
  $gFront.FillEllipse($brush, [float]$x, [float]$y, [float]$w, [float]$h)
  $brush.Dispose()
}

$front.Save($frontPath, [System.Drawing.Imaging.ImageFormat]::Png)
$gFront.Dispose()
$front.Dispose()

Write-Output "Created:"
Write-Output $backPath
Write-Output $frontPath
