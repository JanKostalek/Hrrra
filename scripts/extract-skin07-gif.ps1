$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$skinDir = Join-Path $projectRoot "assets/skins/Skin07"
$gifPath = Join-Path $skinDir "RunInstagram-original.gif"
$allFramesDir = Join-Path $skinDir "all_frames"
$cutoutDir = Join-Path $skinDir "cutout_frames"
$normalizedDir = Join-Path $skinDir "normalized_160"

if (-not (Test-Path $gifPath)) {
  throw "Missing Skin07 GIF: $gifPath"
}

foreach ($dir in @($allFramesDir, $cutoutDir, $normalizedDir)) {
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }
}

Get-ChildItem $allFramesDir -Filter '*.png' -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem $cutoutDir -Filter '*.png' -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem $normalizedDir -Filter '*.png' -ErrorAction SilentlyContinue | Remove-Item -Force

function IsMarkerPixel {
  param(
    [System.Drawing.Color]$Color
  )

  $r = [int]$Color.R
  $g = [int]$Color.G
  $b = [int]$Color.B

  $isRedShirt = $r -ge 130 -and $r -ge ($g + 25) -and $r -ge ($b + 25)
  $isSkinTone = $r -ge 170 -and $g -ge 95 -and $g -le 210 -and $b -le 150 -and $r -ge ($b + 35)
  return $isRedShirt -or $isSkinTone
}

function IsPotentialCharacterPixel {
  param(
    [System.Drawing.Color]$Color
  )

  $r = [int]$Color.R
  $g = [int]$Color.G
  $b = [int]$Color.B
  $brightness = ($r + $g + $b) / 3.0
  $max = [Math]::Max($r, [Math]::Max($g, $b))
  $min = [Math]::Min($r, [Math]::Min($g, $b))
  $saturation = $max - $min

  $isMarker = IsMarkerPixel $Color
  $isDarkBody = $brightness -le 85
  $isWarmAccent = $r -ge 120 -and $r -ge ($b + 20) -and $saturation -ge 25

  return $isMarker -or $isDarkBody -or $isWarmAccent
}

function Clamp([int]$value, [int]$min, [int]$max) {
  return [Math]::Max($min, [Math]::Min($max, $value))
}

function Save-Normalized160 {
  param(
    [System.Drawing.Bitmap]$Source,
    [string]$OutputPath
  )

  $dest = New-Object System.Drawing.Bitmap 160, 160, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  try {
    $g = [System.Drawing.Graphics]::FromImage($dest)
    try {
      $g.Clear([System.Drawing.Color]::Transparent)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

      $targetHeight = 150
      $targetWidth = [Math]::Max(1, [int][Math]::Round($Source.Width * ($targetHeight / [double]$Source.Height)))
      $drawX = [int][Math]::Round((160 - $targetWidth) / 2.0)
      $drawY = 158 - $targetHeight + 1

      $g.DrawImage(
        $Source,
        [System.Drawing.Rectangle]::FromLTRB($drawX, $drawY, $drawX + $targetWidth, $drawY + $targetHeight),
        [System.Drawing.Rectangle]::FromLTRB(0, 0, $Source.Width, $Source.Height),
        [System.Drawing.GraphicsUnit]::Pixel
      )
    } finally {
      $g.Dispose()
    }
    $dest.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $dest.Dispose()
  }
}

$image = [System.Drawing.Image]::FromFile($gifPath)
try {
  $dimension = New-Object System.Drawing.Imaging.FrameDimension($image.FrameDimensionsList[0])
  $frameCount = $image.GetFrameCount($dimension)
  $previousRegion = $null

  for ($frameIndex = 0; $frameIndex -lt $frameCount; $frameIndex += 1) {
    $image.SelectActiveFrame($dimension, $frameIndex) | Out-Null
    $frame = New-Object System.Drawing.Bitmap $image.Width, $image.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($frame)
      try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)
      } finally {
        $graphics.Dispose()
      }

      $allFramePath = Join-Path $allFramesDir ("frame-{0}.png" -f ($frameIndex + 1).ToString("00"))
      $frame.Save($allFramePath, [System.Drawing.Imaging.ImageFormat]::Png)

      $minX = $frame.Width
      $minY = $frame.Height
      $maxX = -1
      $maxY = -1
      $halfX = [int][Math]::Floor($frame.Width * 0.45)

      for ($y = 0; $y -lt $frame.Height; $y += 1) {
        for ($x = $halfX; $x -lt $frame.Width; $x += 1) {
          if (IsMarkerPixel $frame.GetPixel($x, $y)) {
            if ($x -lt $minX) { $minX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -gt $maxY) { $maxY = $y }
          }
        }
      }

      if ($maxX -lt 0 -or $maxY -lt 0) {
        if ($previousRegion) {
          $minX = $previousRegion.MinX
          $minY = $previousRegion.MinY
          $maxX = $previousRegion.MaxX
          $maxY = $previousRegion.MaxY
        } else {
          throw "Failed to detect Skin07 character markers in frame $($frameIndex + 1)."
        }
      }

      $searchLeft = Clamp ($minX - 70) 0 ($frame.Width - 1)
      $searchRight = Clamp ($maxX + 70) 0 ($frame.Width - 1)
      $searchTop = Clamp ($minY - 90) 0 ($frame.Height - 1)
      $searchBottom = Clamp ($maxY + 120) 0 ($frame.Height - 1)

      $width = $searchRight - $searchLeft + 1
      $height = $searchBottom - $searchTop + 1
      $mask = New-Object 'bool[,]' $width, $height
      $visited = New-Object 'bool[,]' $width, $height
      $seedPoints = New-Object System.Collections.Generic.List[object]

      for ($y = $searchTop; $y -le $searchBottom; $y += 1) {
        for ($x = $searchLeft; $x -le $searchRight; $x += 1) {
          $pixel = $frame.GetPixel($x, $y)
          $mx = $x - $searchLeft
          $my = $y - $searchTop
          if (IsPotentialCharacterPixel $pixel) {
            $mask[$mx, $my] = $true
          }
          if (IsMarkerPixel $pixel) {
            $seedPoints.Add(@{ X = $mx; Y = $my }) | Out-Null
          }
        }
      }

      $queue = New-Object System.Collections.Queue
      foreach ($seed in $seedPoints) {
        if ($mask[$seed.X, $seed.Y] -and -not $visited[$seed.X, $seed.Y]) {
          $visited[$seed.X, $seed.Y] = $true
          $queue.Enqueue($seed)
        }
      }

      $componentMinX = $width
      $componentMinY = $height
      $componentMaxX = -1
      $componentMaxY = -1
      $componentPixels = New-Object System.Collections.Generic.List[object]
      $neighbors = @(
        @{ X = -1; Y = -1 }, @{ X = 0; Y = -1 }, @{ X = 1; Y = -1 },
        @{ X = -1; Y = 0 },                         @{ X = 1; Y = 0 },
        @{ X = -1; Y = 1 },  @{ X = 0; Y = 1 },  @{ X = 1; Y = 1 }
      )

      while ($queue.Count -gt 0) {
        $point = $queue.Dequeue()
        $componentPixels.Add($point) | Out-Null
        if ($point.X -lt $componentMinX) { $componentMinX = $point.X }
        if ($point.Y -lt $componentMinY) { $componentMinY = $point.Y }
        if ($point.X -gt $componentMaxX) { $componentMaxX = $point.X }
        if ($point.Y -gt $componentMaxY) { $componentMaxY = $point.Y }

        foreach ($neighbor in $neighbors) {
          $nx = $point.X + $neighbor.X
          $ny = $point.Y + $neighbor.Y
          if ($nx -lt 0 -or $ny -lt 0 -or $nx -ge $width -or $ny -ge $height) {
            continue
          }
          if (-not $mask[$nx, $ny] -or $visited[$nx, $ny]) {
            continue
          }
          $visited[$nx, $ny] = $true
          $queue.Enqueue(@{ X = $nx; Y = $ny })
        }
      }

      if ($componentMaxX -lt 0 -or $componentMaxY -lt 0) {
        throw "Failed to isolate Skin07 character component in frame $($frameIndex + 1)."
      }

      $cropPaddingLeft = 10
      $cropPaddingRight = 10
      $cropPaddingTop = 12
      $cropPaddingBottom = 10
      $cropLeft = Clamp ($componentMinX - $cropPaddingLeft) 0 ($width - 1)
      $cropTop = Clamp ($componentMinY - $cropPaddingTop) 0 ($height - 1)
      $cropRight = Clamp ($componentMaxX + $cropPaddingRight) 0 ($width - 1)
      $cropBottom = Clamp ($componentMaxY + $cropPaddingBottom) 0 ($height - 1)

      $cropWidth = $cropRight - $cropLeft + 1
      $cropHeight = $cropBottom - $cropTop + 1
      $cutout = New-Object System.Drawing.Bitmap $cropWidth, $cropHeight, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      try {
        for ($y = $cropTop; $y -le $cropBottom; $y += 1) {
          for ($x = $cropLeft; $x -le $cropRight; $x += 1) {
            $pixel = $frame.GetPixel($searchLeft + $x, $searchTop + $y)
            $dx = $x - $cropLeft
            $dy = $y - $cropTop
            if ($visited[$x, $y]) {
              $cutout.SetPixel($dx, $dy, $pixel)
            } else {
              $cutout.SetPixel($dx, $dy, [System.Drawing.Color]::Transparent)
            }
          }
        }

        $cutoutPath = Join-Path $cutoutDir ("frame-{0}.png" -f ($frameIndex + 1).ToString("00"))
        $normalizedPath = Join-Path $normalizedDir ("frame-{0}.png" -f ($frameIndex + 1).ToString("00"))
        $cutout.Save($cutoutPath, [System.Drawing.Imaging.ImageFormat]::Png)
        Save-Normalized160 -Source $cutout -OutputPath $normalizedPath
      } finally {
        $cutout.Dispose()
      }

      $previousRegion = @{
        MinX = $minX
        MinY = $minY
        MaxX = $maxX
        MaxY = $maxY
      }
    } finally {
      $frame.Dispose()
    }
  }

  Write-Output "Extracted $frameCount Skin07 GIF frames into all_frames, cutout_frames, and normalized_160."
} finally {
  $image.Dispose()
}
