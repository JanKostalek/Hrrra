$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$skinDir = Join-Path $projectRoot "assets/skins/Skin05"

function Is-ForegroundPixel {
  param(
    [System.Drawing.Color]$Color
  )

  if ($Color.A -lt 10) {
    return $false
  }

  $brightness = ($Color.R + $Color.G + $Color.B) / 3.0
  return $brightness -lt 245
}

function Get-ForegroundBounds {
  param(
    [System.Drawing.Bitmap]$Bitmap
  )

  $minX = $Bitmap.Width
  $minY = $Bitmap.Height
  $maxX = -1
  $maxY = -1

  for ($y = 0; $y -lt $Bitmap.Height; $y += 1) {
    for ($x = 0; $x -lt $Bitmap.Width; $x += 1) {
      if (Is-ForegroundPixel $Bitmap.GetPixel($x, $y)) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if ($maxX -lt 0) {
    return @{ X = 0; Y = 0; Width = $Bitmap.Width; Height = $Bitmap.Height }
  }

  return @{
    X = $minX
    Y = $minY
    Width = $maxX - $minX + 1
    Height = $maxY - $minY + 1
  }
}

function Save-TransparentFrame {
  param(
    [System.Drawing.Bitmap]$Source,
    [string]$OutputPath,
    [int]$TargetHeight = 150,
    [int]$TargetBottom = 158,
    [double]$WidthScale = 1.0,
    [double]$HeightScale = 1.0,
    [int]$OffsetX = 0,
    [int]$OffsetY = 0
  )

  $dest = New-Object System.Drawing.Bitmap 160, 160, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  try {
    $g = [System.Drawing.Graphics]::FromImage($dest)
    try {
      $g.Clear([System.Drawing.Color]::Transparent)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

      $baseWidth = [Math]::Max(1, [int][Math]::Round($Source.Width * ($TargetHeight / [double]$Source.Height)))
      $drawWidth = [Math]::Max(1, [int][Math]::Round($baseWidth * $WidthScale))
      $drawHeight = [Math]::Max(1, [int][Math]::Round($TargetHeight * $HeightScale))
      $drawX = [int][Math]::Round((160 - $drawWidth) / 2.0) + $OffsetX
      $drawY = $TargetBottom - $drawHeight + 1 + $OffsetY

      $g.DrawImage(
        $Source,
        [System.Drawing.Rectangle]::FromLTRB($drawX, $drawY, $drawX + $drawWidth, $drawY + $drawHeight),
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

$sourceRunFiles = @(Get-ChildItem $skinDir -Filter 'hero-walk-*.png' | Sort-Object Name)
if ($sourceRunFiles.Count -lt 6) {
  $sourceRunFiles = @(Get-ChildItem $skinDir -Filter 'run-*.png' | Sort-Object Name)
}
if ($sourceRunFiles.Count -ne 6) {
  throw "Expected 6 Skin05 run source frames in $skinDir, detected $($sourceRunFiles.Count)."
}
$usingHeroWalkSources = $sourceRunFiles[0].Name -like 'hero-walk-*'

$runFrames = @()
try {
  for ($i = 0; $i -lt $sourceRunFiles.Count; $i += 1) {
    $sourcePath = $sourceRunFiles[$i].FullName
    $sourceBitmap = [System.Drawing.Bitmap]::FromFile($sourcePath)
    try {
      $bounds = Get-ForegroundBounds -Bitmap $sourceBitmap
      $frame = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      try {
        for ($y = 0; $y -lt $bounds.Height; $y += 1) {
          for ($x = 0; $x -lt $bounds.Width; $x += 1) {
            $pixel = $sourceBitmap.GetPixel($bounds.X + $x, $bounds.Y + $y)
            if (Is-ForegroundPixel $pixel) {
              $frame.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 20, 20, 20))
            } else {
              $frame.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
          }
        }

        $runFrames += $frame
        $runSourcePath = Join-Path $skinDir ("run-{0}.png" -f ($i + 1).ToString("00"))
        $heroWalkPath = Join-Path $skinDir ("hero-walk-{0}.png" -f ($i + 1).ToString("00"))
        $runTempPath = $runSourcePath + ".tmp"
        $frame.Save($runTempPath, [System.Drawing.Imaging.ImageFormat]::Png)
        if (Test-Path $runSourcePath) { Remove-Item -Force $runSourcePath }
        Move-Item -Force $runTempPath $runSourcePath
        if (-not $usingHeroWalkSources) {
          $heroWalkTempPath = $heroWalkPath + ".tmp"
          Save-TransparentFrame -Source $frame -OutputPath $heroWalkTempPath
          if (Test-Path $heroWalkPath) { Remove-Item -Force $heroWalkPath }
          Move-Item -Force $heroWalkTempPath $heroWalkPath
        }
      } catch {
        $frame.Dispose()
        throw
      }
    } finally {
      $sourceBitmap.Dispose()
    }
  }

  $jumpMap = @(
    @{ Source = 1; WidthScale = 0.95; HeightScale = 0.90; OffsetX = -1; OffsetY = 0; TargetBottom = 158 },
    @{ Source = 0; WidthScale = 0.94; HeightScale = 0.92; OffsetX = 0; OffsetY = 0; TargetBottom = 158 },
    @{ Source = 2; WidthScale = 1.04; HeightScale = 0.90; OffsetX = -2; OffsetY = 0; TargetBottom = 158 },
    @{ Source = 3; WidthScale = 0.96; HeightScale = 0.90; OffsetX = 1; OffsetY = 0; TargetBottom = 158 },
    @{ Source = 4; WidthScale = 0.97; HeightScale = 0.91; OffsetX = 3; OffsetY = 0; TargetBottom = 158 },
    @{ Source = 5; WidthScale = 1.01; HeightScale = 0.95; OffsetX = 2; OffsetY = 0; TargetBottom = 158 }
  )

  for ($i = 0; $i -lt $jumpMap.Count; $i += 1) {
    $jumpPath = Join-Path $skinDir ("hero-jump-{0}.png" -f ($i + 1).ToString("00"))
    $jumpSourcePath = Join-Path $skinDir ("jump-{0}.png" -f ($i + 1).ToString("00"))
    $sourceFrame = $runFrames[$jumpMap[$i].Source]
    $jumpTempPath = $jumpSourcePath + ".tmp"
    $heroJumpTempPath = $jumpPath + ".tmp"
    $sourceFrame.Save($jumpTempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Save-TransparentFrame `
      -Source $sourceFrame `
      -OutputPath $heroJumpTempPath `
      -WidthScale $jumpMap[$i].WidthScale `
      -HeightScale $jumpMap[$i].HeightScale `
      -OffsetX $jumpMap[$i].OffsetX `
      -OffsetY $jumpMap[$i].OffsetY `
      -TargetBottom $jumpMap[$i].TargetBottom
    if (Test-Path $jumpSourcePath) { Remove-Item -Force $jumpSourcePath }
    if (Test-Path $jumpPath) { Remove-Item -Force $jumpPath }
    Move-Item -Force $jumpTempPath $jumpSourcePath
    Move-Item -Force $heroJumpTempPath $jumpPath
  }

  $cleanupFiles = @(
    'run-07.png',
    'hero-walk-07.png',
    'jump-07.png',
    'hero-jump-07.png',
    'skin05_sheet.png'
  )
  foreach ($fileName in $cleanupFiles) {
    $path = Join-Path $skinDir $fileName
    if (Test-Path $path) {
      Remove-Item -Force $path
    }
  }
  Get-ChildItem $skinDir -Filter '*.tmp' -ErrorAction SilentlyContinue | Remove-Item -Force

  Write-Output "Prepared Skin05 with 6 run frames and 6 derived jump frames in $skinDir"
} finally {
  foreach ($frame in $runFrames) {
    if ($frame) { $frame.Dispose() }
  }
}
