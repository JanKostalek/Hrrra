Add-Type -AssemblyName System.Drawing

$backPath = Join-Path $PSScriptRoot "..\assets\level3\background_back_tile.png"
$frontPath = Join-Path $PSScriptRoot "..\assets\level3\background_front_tile.png"
$width = 1536
$height = 560
$rng = [System.Random]::new(20260319)

function Fill-PolygonFromPoints($graphics, $brush, [double[]]$points) {
  $pointObjects = New-Object System.Drawing.PointF[] ($points.Length / 2)
  for ($i = 0; $i -lt $points.Length; $i += 2) {
    $pointObjects[$i / 2] = [System.Drawing.PointF]::new([float]$points[$i], [float]$points[$i + 1])
  }
  $graphics.FillPolygon($brush, $pointObjects)
}

function New-Brush([int]$a, [int]$r, [int]$g, [int]$b) {
  return [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($a, $r, $g, $b))
}

function Add-SmokePuffs($graphics, [int]$count, [double]$baseX, [double]$baseY, [double]$spreadX, [double]$spreadY) {
  for ($i = 0; $i -lt $count; $i++) {
    $w = 90 + $rng.NextDouble() * 170
    $h = 36 + $rng.NextDouble() * 80
    $x = $baseX + ($rng.NextDouble() - 0.5) * $spreadX
    $y = $baseY + ($rng.NextDouble() - 0.5) * $spreadY
    $alpha = 18 + [int]($rng.NextDouble() * 34)
    $brush = New-Brush $alpha (95 + [int]($rng.NextDouble() * 35)) (55 + [int]($rng.NextDouble() * 30)) (75 + [int]($rng.NextDouble() * 35))
    $graphics.FillEllipse($brush, [float]$x, [float]$y, [float]$w, [float]$h)
    $brush.Dispose()
  }
}

function Draw-LavaRiver($graphics, [double]$startX, [double]$startY, [double]$length, [double]$thickness, [double]$wiggle, [System.Drawing.Color]$coreColor, [System.Drawing.Color]$glowColor) {
  $glowPen = [System.Drawing.Pen]::new($glowColor, [float]($thickness * 1.9))
  $corePen = [System.Drawing.Pen]::new($coreColor, [float]$thickness)
  $glowPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $glowPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $corePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $corePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $glowPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $corePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

  $points = New-Object System.Drawing.PointF[] 6
  for ($i = 0; $i -lt 6; $i++) {
    $t = $i / 5.0
    $x = $startX + ($length * $t)
    $y = $startY + [Math]::Sin($t * [Math]::PI * 1.4) * $wiggle + ([Math]::Cos($t * [Math]::PI * 3.0) * $wiggle * 0.28)
    $points[$i] = [System.Drawing.PointF]::new([float]$x, [float]$y)
  }
  $graphics.DrawCurve($glowPen, $points)
  $graphics.DrawCurve($corePen, $points)

  $corePen.Dispose()
  $glowPen.Dispose()
}

function Add-SparkDots($graphics, [int]$count, [double]$minY, [double]$maxY) {
  for ($i = 0; $i -lt $count; $i++) {
    $x = $rng.NextDouble() * $width
    $y = $minY + $rng.NextDouble() * ($maxY - $minY)
    $size = 2 + $rng.NextDouble() * 4
    $brush = New-Brush (90 + [int]($rng.NextDouble() * 110)) 255 (160 + [int]($rng.NextDouble() * 60)) (40 + [int]($rng.NextDouble() * 40))
    $graphics.FillEllipse($brush, [float]$x, [float]$y, [float]$size, [float]$size)
    $brush.Dispose()
  }
}

$back = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gBack = [System.Drawing.Graphics]::FromImage($back)
$gBack.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gBack.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gBack.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$skyGradient = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
  [System.Drawing.PointF]::new(0, 0),
  [System.Drawing.PointF]::new(0, $height),
  [System.Drawing.Color]::FromArgb(255, 46, 10, 60),
  [System.Drawing.Color]::FromArgb(255, 255, 126, 52)
)
$gBack.FillRectangle($skyGradient, 0, 0, $width, $height)
$skyGradient.Dispose()

for ($i = 0; $i -lt 10; $i++) {
  $w = 260 + $rng.NextDouble() * 420
  $h = 80 + $rng.NextDouble() * 150
  $x = ($rng.NextDouble() * $width) - ($w * 0.25)
  $y = 25 + $rng.NextDouble() * 170
  $brush = New-Brush (16 + [int]($rng.NextDouble() * 20)) 255 (100 + [int]($rng.NextDouble() * 60)) (90 + [int]($rng.NextDouble() * 60))
  $gBack.FillEllipse($brush, [float]$x, [float]$y, [float]$w, [float]$h)
  $brush.Dispose()
}

$mountainBrushFar = New-Brush 255 72 28 48
$mountainBrushMid = New-Brush 255 98 34 44

Fill-PolygonFromPoints $gBack $mountainBrushFar @(
  0, $height,
  0, 370,
  150, 325,
  280, 360,
  420, 300,
  580, 352,
  760, 290,
  940, 360,
  1120, 298,
  1290, 344,
  1536, 280,
  1536, $height
)

Fill-PolygonFromPoints $gBack $mountainBrushMid @(
  0, $height,
  0, 420,
  220, 378,
  380, 404,
  520, 270,
  620, 185,
  705, 240,
  820, 392,
  1010, 360,
  1170, 408,
  1335, 332,
  1536, 392,
  1536, $height
)

$craterGlow = [System.Drawing.Drawing2D.PathGradientBrush]::new(([System.Drawing.PointF[]]@(
  [System.Drawing.PointF]::new(560, 210),
  [System.Drawing.PointF]::new(650, 178),
  [System.Drawing.PointF]::new(730, 220),
  [System.Drawing.PointF]::new(650, 270)
)))
$craterGlow.CenterColor = [System.Drawing.Color]::FromArgb(220, 255, 221, 106)
$craterGlow.SurroundColors = [System.Drawing.Color[]]@([System.Drawing.Color]::FromArgb(0, 255, 120, 60))
$gBack.FillEllipse($craterGlow, 530, 160, 230, 150)
$craterGlow.Dispose()

Add-SmokePuffs $gBack 20 610 90 320 110
Add-SparkDots $gBack 70 40 300

$mountainBrushMid.Dispose()
$mountainBrushFar.Dispose()
$back.Save($backPath, [System.Drawing.Imaging.ImageFormat]::Png)
$gBack.Dispose()
$back.Dispose()

$front = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gFront = [System.Drawing.Graphics]::FromImage($front)
$gFront.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gFront.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gFront.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFront.Clear([System.Drawing.Color]::Transparent)

$groundBrush = New-Brush 255 42 20 28
Fill-PolygonFromPoints $gFront $groundBrush @(
  0, $height,
  0, 430,
  110, 405,
  180, 440,
  300, 372,
  450, 426,
  610, 390,
  780, 438,
  920, 382,
  1100, 432,
  1260, 392,
  1410, 420,
  1536, 376,
  1536, $height
)
$groundBrush.Dispose()

$ridgeBrush = New-Brush 255 26 14 20
for ($i = 0; $i -lt 11; $i++) {
  $x = $rng.NextDouble() * $width
  $w = 140 + $rng.NextDouble() * 320
  $h = 70 + $rng.NextDouble() * 150
  $yBase = 320 + $rng.NextDouble() * 90
  Fill-PolygonFromPoints $gFront $ridgeBrush @(
    ($x - $w * 0.5), $height,
    ($x - $w * 0.28), ($yBase + $h * 0.22),
    ($x - $w * 0.08), $yBase,
    ($x + $w * 0.18), ($yBase + $h * 0.12),
    ($x + $w * 0.46), $height
  )
}
$ridgeBrush.Dispose()

for ($i = 0; $i -lt 9; $i++) {
  $riverStartX = -120 + $i * 190
  $riverStartY = 420 + ($rng.NextDouble() * 60)
  Draw-LavaRiver $gFront $riverStartX $riverStartY (250 + $rng.NextDouble() * 160) (16 + $rng.NextDouble() * 18) (18 + $rng.NextDouble() * 20) ([System.Drawing.Color]::FromArgb(255, 255, 232, 110)) ([System.Drawing.Color]::FromArgb(120, 255, 78, 28))
}

for ($i = 0; $i -lt 18; $i++) {
  $x = 40 + $rng.NextDouble() * ($width - 80)
  $y = 360 + $rng.NextDouble() * 170
  $w = 18 + $rng.NextDouble() * 34
  $h = 10 + $rng.NextDouble() * 22
  $glowBrush = New-Brush (50 + [int]($rng.NextDouble() * 40)) 255 110 50
  $coreBrush = New-Brush 230 255 208 (70 + [int]($rng.NextDouble() * 30))
  $gFront.FillEllipse($glowBrush, [float]($x - $w * 0.35), [float]($y - $h * 0.2), [float]($w * 1.7), [float]($h * 1.8))
  $gFront.FillEllipse($coreBrush, [float]$x, [float]$y, [float]$w, [float]$h)
  $glowBrush.Dispose()
  $coreBrush.Dispose()
}

for ($i = 0; $i -lt 16; $i++) {
  $x = $rng.NextDouble() * $width
  $h = 50 + $rng.NextDouble() * 120
  $w = 28 + $rng.NextDouble() * 44
  $baseY = 330 + $rng.NextDouble() * 140
  $brush = New-Brush 255 34 18 26
  Fill-PolygonFromPoints $gFront $brush @(
    ($x - $w * 0.5), ($baseY + $h),
    ($x - $w * 0.18), ($baseY + $h * 0.18),
    $x, $baseY,
    ($x + $w * 0.15), ($baseY + $h * 0.24),
    ($x + $w * 0.45), ($baseY + $h)
  )
  $brush.Dispose()
}

Add-SparkDots $gFront 110 200 430

$front.Save($frontPath, [System.Drawing.Imaging.ImageFormat]::Png)
$gFront.Dispose()
$front.Dispose()

Write-Output "Created:"
Write-Output $backPath
Write-Output $frontPath
