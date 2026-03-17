Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $PSScriptRoot "..\\assets\\gamebackground.jpg"
$skyPath = Join-Path $PSScriptRoot "..\\assets\\gamebackground_sky_tile.png"
$foregroundPath = Join-Path $PSScriptRoot "..\\assets\\gamebackground_foreground_tile.png"
$outputScale = 0.5
$seamWidth = 16

function Clamp-Byte([double]$value) {
  if ($value -lt 0) { return 0 }
  if ($value -gt 255) { return 255 }
  return [int][Math]::Round($value)
}

function Is-CloudPixel([System.Drawing.Color]$color) {
  return (
    $color.R -ge 210 -and
    $color.G -ge 220 -and
    $color.B -ge 220
  )
}

function Is-SkyPixel([System.Drawing.Color]$color) {
  if (Is-CloudPixel $color) { return $true }
  return (
    $color.B -ge 170 -and
    $color.G -ge 155 -and
    $color.B -ge ($color.G + 5) -and
    $color.G -ge ($color.R + 15)
  )
}

function Apply-SeamBand([System.Drawing.Bitmap]$bitmap, [int]$width) {
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

    $count = [Math]::Max(1, $width * 2)
    $edgeColor = [System.Drawing.Color]::FromArgb(
      [int]($sumA / $count),
      [int]($sumR / $count),
      [int]($sumG / $count),
      [int]($sumB / $count)
    )

    for ($i = 0; $i -lt $width; $i++) {
      $bitmap.SetPixel($i, $y, $edgeColor)
      $bitmap.SetPixel($bitmap.Width - $width + $i, $y, $edgeColor)
    }
  }
}

$sourceFull = [System.Drawing.Bitmap]::FromFile($sourcePath)
$scaledWidth = [Math]::Max(1, [int]($sourceFull.Width * $outputScale))
$scaledHeight = [Math]::Max(1, [int]($sourceFull.Height * $outputScale))
$source = New-Object System.Drawing.Bitmap($scaledWidth, $scaledHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($source)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.DrawImage($sourceFull, 0, 0, $scaledWidth, $scaledHeight)
$graphics.Dispose()
$sourceFull.Dispose()

$sky = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$foreground = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$transparent = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)
$lastSkyFill = [System.Drawing.Color]::FromArgb(255, 135, 191, 235)

for ($y = 0; $y -lt $source.Height; $y++) {
  $rowSkyPixels = New-Object System.Collections.Generic.List[System.Drawing.Color]
  for ($x = 0; $x -lt $source.Width; $x++) {
    $pixel = $source.GetPixel($x, $y)
    if ((Is-SkyPixel $pixel) -and -not (Is-CloudPixel $pixel)) {
      $rowSkyPixels.Add($pixel)
    }
  }

  if ($rowSkyPixels.Count -gt 0) {
    $sumR = 0
    $sumG = 0
    $sumB = 0
    foreach ($color in $rowSkyPixels) {
      $sumR += $color.R
      $sumG += $color.G
      $sumB += $color.B
    }
    $lastSkyFill = [System.Drawing.Color]::FromArgb(
      255,
      (Clamp-Byte($sumR / $rowSkyPixels.Count)),
      (Clamp-Byte($sumG / $rowSkyPixels.Count)),
      (Clamp-Byte($sumB / $rowSkyPixels.Count))
    )
  }

  for ($x = 0; $x -lt $source.Width; $x++) {
    $pixel = $source.GetPixel($x, $y)

    if (Is-SkyPixel $pixel) {
      $sky.SetPixel($x, $y, $pixel)
      $foreground.SetPixel($x, $y, $transparent)
    } else {
      $sky.SetPixel($x, $y, $lastSkyFill)
      $foreground.SetPixel($x, $y, $pixel)
    }
  }
}

Apply-SeamBand $sky $seamWidth
Apply-SeamBand $foreground $seamWidth

$sky.Save($skyPath, [System.Drawing.Imaging.ImageFormat]::Png)
$foreground.Save($foregroundPath, [System.Drawing.Imaging.ImageFormat]::Png)

$source.Dispose()
$sky.Dispose()
$foreground.Dispose()

Write-Output "Created:"
Write-Output $skyPath
Write-Output $foregroundPath
