param(
  [ValidateSet("a", "b", "c")]
  [string]$Variant
)

Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $PSScriptRoot "..\\assets\\bck_forest_01.png"
$outputPaths = @(
  (Join-Path $PSScriptRoot "..\\assets\\bck_forest_tile_a.png"),
  (Join-Path $PSScriptRoot "..\\assets\\bck_forest_tile_b.png"),
  (Join-Path $PSScriptRoot "..\\assets\\bck_forest_tile_c.png")
)

$downscaleFactor = 3
$outputScale = 0.25
$seamWidth = 32
$offsets = @(0, 384, 768)

function Clamp-Byte([double]$value) {
  if ($value -lt 0) { return 0 }
  if ($value -gt 255) { return 255 }
  return [int][Math]::Round($value)
}

function Quantize-Channel([int]$value) {
  return Clamp-Byte(([Math]::Round($value / 16.0) * 16.0))
}

function Is-SkyPixel([System.Drawing.Color]$color) {
  if ($color.A -lt 16) { return $true }
  if ($color.R -ge 220 -and $color.G -ge 220 -and $color.B -ge 220) { return $true }
  if (
    $color.B -ge 170 -and
    $color.G -ge 135 -and
    $color.B -ge ($color.G + 12) -and
    $color.G -ge ($color.R + 5)
  ) {
    return $true
  }
  return $false
}

function Blend-Color([System.Drawing.Color]$a, [System.Drawing.Color]$b, [double]$t) {
  $aWeight = 1.0 - $t
  return [System.Drawing.Color]::FromArgb(
    (Clamp-Byte($a.A * $aWeight + $b.A * $t)),
    (Clamp-Byte($a.R * $aWeight + $b.R * $t)),
    (Clamp-Byte($a.G * $aWeight + $b.G * $t)),
    (Clamp-Byte($a.B * $aWeight + $b.B * $t))
  )
}

function Quantize-Color([System.Drawing.Color]$color) {
  if ($color.A -lt 16) {
    return [System.Drawing.Color]::FromArgb(0, 0, 0, 0)
  }

  return [System.Drawing.Color]::FromArgb(
    $color.A,
    (Quantize-Channel $color.R),
    (Quantize-Channel $color.G),
    (Quantize-Channel $color.B)
  )
}

function New-ShiftedBitmap([System.Drawing.Bitmap]$source, [int]$offset, [double]$scale) {
  $outWidth = [int]($source.Width * $scale)
  $outHeight = [int]($source.Height * $scale)
  $shifted = New-Object System.Drawing.Bitmap($outWidth, $outHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($shifted)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $firstSourceWidth = $source.Width - $offset
  $firstDestWidth = [int]($firstSourceWidth * $scale)
  $secondDestWidth = $outWidth - $firstDestWidth

  $graphics.DrawImage(
    $source,
    (New-Object System.Drawing.Rectangle(0, 0, $firstDestWidth, $outHeight)),
    (New-Object System.Drawing.Rectangle($offset, 0, $firstSourceWidth, $source.Height)),
    [System.Drawing.GraphicsUnit]::Pixel
  )

  if ($secondDestWidth -gt 0) {
    $graphics.DrawImage(
      $source,
      (New-Object System.Drawing.Rectangle($firstDestWidth, 0, $secondDestWidth, $outHeight)),
      (New-Object System.Drawing.Rectangle(0, 0, $offset, $source.Height)),
      [System.Drawing.GraphicsUnit]::Pixel
    )
  }

  $graphics.Dispose()
  return $shifted
}

function Get-SkylineCuts([System.Drawing.Bitmap]$source, [int]$offset, [double]$scale) {
  $outWidth = [int]($source.Width * $scale)
  $cuts = New-Object 'int[]' $outWidth
  $scanLimit = [int]($source.Height * 0.82)
  for ($x = 0; $x -lt $outWidth; $x++) {
    $sourceX = ([int]($x / $scale) + $offset) % $source.Width
    $cut = 0
    while ($cut -lt $scanLimit -and (Is-SkyPixel $source.GetPixel($sourceX, $cut))) {
      $cut += 1
    }
    if ($cut -ge $scanLimit) {
      $cut = [int]($source.Height * 0.33)
    }
    $cuts[$x] = [int]($cut * $scale)
  }

  $smoothedCuts = New-Object 'int[]' $outWidth
  $smoothRadius = 6
  for ($x = 0; $x -lt $outWidth; $x++) {
    $sum = 0
    $count = 0
    for ($sampleX = [Math]::Max(0, $x - $smoothRadius); $sampleX -le [Math]::Min($outWidth - 1, $x + $smoothRadius); $sampleX++) {
      $sum += $cuts[$sampleX]
      $count += 1
    }
    $smoothedCuts[$x] = [int]($sum / [Math]::Max(1, $count))
  }

  $flattenedCuts = New-Object 'int[]' $outWidth
  $flattenRadius = 3
  for ($x = 0; $x -lt $outWidth; $x++) {
    $localMax = 0
    for ($sampleX = [Math]::Max(0, $x - $flattenRadius); $sampleX -le [Math]::Min($outWidth - 1, $x + $flattenRadius); $sampleX++) {
      if ($smoothedCuts[$sampleX] -gt $localMax) {
        $localMax = $smoothedCuts[$sampleX]
      }
    }
    $flattenedCuts[$x] = $localMax
  }

  return $flattenedCuts
}

function Pixelate-Bitmap([System.Drawing.Bitmap]$source, [int]$factor) {
  $smallWidth = [Math]::Max(1, [int]($source.Width / $factor))
  $smallHeight = [Math]::Max(1, [int]($source.Height / $factor))

  $small = New-Object System.Drawing.Bitmap($smallWidth, $smallHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gSmall = [System.Drawing.Graphics]::FromImage($small)
  $gSmall.Clear([System.Drawing.Color]::Transparent)
  $gSmall.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $gSmall.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $gSmall.DrawImage($source, 0, 0, $smallWidth, $smallHeight)
  $gSmall.Dispose()

  $pixelated = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gPixelated = [System.Drawing.Graphics]::FromImage($pixelated)
  $gPixelated.Clear([System.Drawing.Color]::Transparent)
  $gPixelated.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $gPixelated.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $gPixelated.DrawImage($small, 0, 0, $source.Width, $source.Height)
  $gPixelated.Dispose()
  $small.Dispose()

  return $pixelated
}

function Apply-SkyTransparency([System.Drawing.Bitmap]$bitmap, [int[]]$cuts) {
  for ($x = 0; $x -lt $bitmap.Width; $x++) {
    $cut = $cuts[$x]
    for ($y = 0; $y -lt $cut; $y++) {
      $bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    }
  }
}

function Apply-SeamMatch([System.Drawing.Bitmap]$bitmap, [int]$width) {
  for ($y = 0; $y -lt $bitmap.Height; $y++) {
    $sumA = 0
    $sumR = 0
    $sumG = 0
    $sumB = 0

    for ($i = 0; $i -lt $width; $i++) {
      $leftColor = $bitmap.GetPixel($i, $y)
      $rightColor = $bitmap.GetPixel($bitmap.Width - $width + $i, $y)
      $sumA += $leftColor.A + $rightColor.A
      $sumR += $leftColor.R + $rightColor.R
      $sumG += $leftColor.G + $rightColor.G
      $sumB += $leftColor.B + $rightColor.B
    }

    $sampleCount = [Math]::Max(1, $width * 2)
    $edgeColor = Quantize-Color([System.Drawing.Color]::FromArgb(
      [int]($sumA / $sampleCount),
      [int]($sumR / $sampleCount),
      [int]($sumG / $sampleCount),
      [int]($sumB / $sampleCount)
    ))

    for ($i = 0; $i -lt $width; $i++) {
      $bitmap.SetPixel($i, $y, $edgeColor)
      $bitmap.SetPixel($bitmap.Width - $width + $i, $y, $edgeColor)
    }
  }
}

function Quantize-Bitmap([System.Drawing.Bitmap]$bitmap) {
  for ($x = 0; $x -lt $bitmap.Width; $x++) {
    for ($y = 0; $y -lt $bitmap.Height; $y++) {
      $bitmap.SetPixel($x, $y, (Quantize-Color $bitmap.GetPixel($x, $y)))
    }
  }
}

$source = [System.Drawing.Bitmap]::FromFile($sourcePath)

$variantIndices = if ($Variant) {
  switch ($Variant) {
    "a" { @(0) }
    "b" { @(1) }
    "c" { @(2) }
  }
} else {
  0..($outputPaths.Count - 1)
}

for ($variantIndex = 0; $variantIndex -lt $variantIndices.Count; $variantIndex++) {
  $targetIndex = $variantIndices[$variantIndex]
  $shifted = New-ShiftedBitmap $source $offsets[$targetIndex] $outputScale
  $cuts = Get-SkylineCuts $source $offsets[$targetIndex] $outputScale
  $pixelated = Pixelate-Bitmap $shifted $downscaleFactor

  Apply-SkyTransparency $pixelated $cuts
  Quantize-Bitmap $pixelated
  Apply-SeamMatch $pixelated $seamWidth

  $pixelated.Save($outputPaths[$targetIndex], [System.Drawing.Imaging.ImageFormat]::Png)

  $pixelated.Dispose()
  $shifted.Dispose()
}

$source.Dispose()

Write-Output "Created forest parallax tiles:"
foreach ($path in $outputPaths) {
  Write-Output $path
}
