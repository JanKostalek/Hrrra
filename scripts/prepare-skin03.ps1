$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$sheetPath = Join-Path $projectRoot "assets/skins/Skin03/skin03.png"
$outputDir = Join-Path $projectRoot "assets/skins/Skin03"
$canvasSize = 160
$cellWidth = 172
$cellHeight = 240

function Is-LightBackgroundPixel {
  param(
    [System.Drawing.Color]$Color
  )

  if ($Color.A -lt 10) {
    return $true
  }

  $maxChannel = [Math]::Max($Color.R, [Math]::Max($Color.G, $Color.B))
  $minChannel = [Math]::Min($Color.R, [Math]::Min($Color.G, $Color.B))
  return $minChannel -ge 210 -and ($maxChannel - $minChannel) -le 18
}

function Get-LargestForegroundBoundsFromCell {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [int]$CellX,
    [int]$CellY,
    [int]$CellWidth,
    [int]$CellHeight,
    [int]$Inset = 6
  )

  $scanX = $CellX + $Inset
  $scanY = $CellY + $Inset
  $scanWidth = [Math]::Max(1, $CellWidth - ($Inset * 2))
  $scanHeight = [Math]::Max(1, $CellHeight - ($Inset * 2))
  $visited = New-Object 'bool[,]' $scanWidth, $scanHeight
  $largestComponent = New-Object System.Collections.ArrayList
  $neighborOffsets = @(
    @{ X = -1; Y = -1 },
    @{ X = 0; Y = -1 },
    @{ X = 1; Y = -1 },
    @{ X = -1; Y = 0 },
    @{ X = 1; Y = 0 },
    @{ X = -1; Y = 1 },
    @{ X = 0; Y = 1 },
    @{ X = 1; Y = 1 }
  )

  for ($localY = 0; $localY -lt $scanHeight; $localY += 1) {
    for ($localX = 0; $localX -lt $scanWidth; $localX += 1) {
      if ($visited[$localX, $localY]) {
        continue
      }

      $pixel = $Bitmap.GetPixel($scanX + $localX, $scanY + $localY)
      if (Is-LightBackgroundPixel -Color $pixel) {
        $visited[$localX, $localY] = $true
        continue
      }

      $component = New-Object System.Collections.ArrayList
      $queue = New-Object System.Collections.Queue
      $queue.Enqueue([pscustomobject]@{ X = $localX; Y = $localY })
      $visited[$localX, $localY] = $true

      while ($queue.Count -gt 0) {
        $point = $queue.Dequeue()
        [void]$component.Add($point)

        foreach ($offset in $neighborOffsets) {
          $nextX = $point.X + $offset.X
          $nextY = $point.Y + $offset.Y
          if ($nextX -lt 0 -or $nextY -lt 0 -or $nextX -ge $scanWidth -or $nextY -ge $scanHeight) {
            continue
          }

          if ($visited[$nextX, $nextY]) {
            continue
          }

          $nextPixel = $Bitmap.GetPixel($scanX + $nextX, $scanY + $nextY)
          if (Is-LightBackgroundPixel -Color $nextPixel) {
            $visited[$nextX, $nextY] = $true
            continue
          }

          $visited[$nextX, $nextY] = $true
          $queue.Enqueue([pscustomobject]@{ X = $nextX; Y = $nextY })
        }
      }

      if ($component.Count -gt $largestComponent.Count) {
        $largestComponent = $component
      }
    }
  }

  if ($largestComponent.Count -eq 0) {
    throw "No foreground component found in Skin03 cell."
  }

  $minX = $null
  $minY = $null
  $maxX = $null
  $maxY = $null
  foreach ($point in $largestComponent) {
    $pixelX = $scanX + $point.X
    $pixelY = $scanY + $point.Y
    if ($null -eq $minX -or $pixelX -lt $minX) { $minX = $pixelX }
    if ($null -eq $maxX -or $pixelX -gt $maxX) { $maxX = $pixelX }
    if ($null -eq $minY -or $pixelY -lt $minY) { $minY = $pixelY }
    if ($null -eq $maxY -or $pixelY -gt $maxY) { $maxY = $pixelY }
  }

  return [pscustomobject]@{
    X = $minX
    Y = $minY
    Width = $maxX - $minX + 1
    Height = $maxY - $minY + 1
    CellX = $CellX
    CellY = $CellY
    CellWidth = $CellWidth
    CellHeight = $CellHeight
  }
}

function New-TransparentBitmap {
  param(
    [int]$Width,
    [int]$Height
  )

  return [System.Drawing.Bitmap]::new($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
}

function Get-SpriteBitmapFromBounds {
  param(
    [System.Drawing.Bitmap]$SourceBitmap,
    [pscustomobject]$Bounds
  )

  $padding = 4
  $srcX = [Math]::Max($Bounds.CellX, $Bounds.X - $padding)
  $srcY = [Math]::Max($Bounds.CellY, $Bounds.Y - $padding)
  $srcRight = [Math]::Min($Bounds.CellX + $Bounds.CellWidth - 1, $Bounds.X + $Bounds.Width - 1 + $padding)
  $srcBottom = [Math]::Min($Bounds.CellY + $Bounds.CellHeight - 1, $Bounds.Y + $Bounds.Height - 1 + $padding)
  $srcW = $srcRight - $srcX + 1
  $srcH = $srcBottom - $srcY + 1

  $sprite = New-TransparentBitmap -Width $srcW -Height $srcH
  for ($localY = 0; $localY -lt $srcH; $localY += 1) {
    for ($localX = 0; $localX -lt $srcW; $localX += 1) {
      $pixel = $SourceBitmap.GetPixel($srcX + $localX, $srcY + $localY)
      if (Is-LightBackgroundPixel -Color $pixel) {
        continue
      }

      $sprite.SetPixel($localX, $localY, $pixel)
    }
  }

  return $sprite
}

function Export-FrameBitmap {
  param(
    [System.Drawing.Bitmap]$SpriteBitmap,
    [string]$OutputPath,
    [int]$TargetMaxWidth = 90,
    [int]$TargetMaxHeight = 90,
    [int]$BottomPadding = 18,
    [int]$YOffset = 0,
    [int]$XOffset = 0,
    [double]$ScaleX = 1.0,
    [double]$ScaleY = 1.0,
    [double]$RotationDegrees = 0.0
  )

  $destBitmap = New-TransparentBitmap -Width $canvasSize -Height $canvasSize
  $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
  try {
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

    $baseScale = [Math]::Min($TargetMaxWidth / $SpriteBitmap.Width, $TargetMaxHeight / $SpriteBitmap.Height)
    $drawW = [Math]::Max(1, [int][Math]::Round($SpriteBitmap.Width * $baseScale * $ScaleX))
    $drawH = [Math]::Max(1, [int][Math]::Round($SpriteBitmap.Height * $baseScale * $ScaleY))
    $destX = [int][Math]::Round(($canvasSize - $drawW) * 0.5 + $XOffset)
    $destY = [int][Math]::Round($canvasSize - $drawH - $BottomPadding + $YOffset)

    $centerX = $destX + ($drawW * 0.5)
    $centerY = $destY + ($drawH * 0.5)
    $destRect = [System.Drawing.Rectangle]::new(-[int][Math]::Round($drawW * 0.5), -[int][Math]::Round($drawH * 0.5), $drawW, $drawH)
    $srcRect = [System.Drawing.Rectangle]::new(0, 0, $SpriteBitmap.Width, $SpriteBitmap.Height)

    $graphics.TranslateTransform($centerX, $centerY)
    if ([Math]::Abs($RotationDegrees) -gt 0.01) {
      $graphics.RotateTransform([single]$RotationDegrees)
    }
    $graphics.DrawImage($SpriteBitmap, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.ResetTransform()
    $destBitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $graphics.Dispose()
    $destBitmap.Dispose()
  }
}

function Export-Skin03 {
  if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
  }

  Get-ChildItem $outputDir -File -Filter 'hero-*.png' | Remove-Item -Force

  $sheet = [System.Drawing.Bitmap]::FromFile($sheetPath)
  try {
    $runCells = @()
    for ($row = 0; $row -lt 2; $row += 1) {
      for ($col = 0; $col -lt 5; $col += 1) {
        $cellX = $col * $cellWidth
        $cellY = $row * $cellHeight
        $runCells += [pscustomobject]@{
          X = $cellX
          Y = $cellY
          Width = $cellWidth
          Height = $cellHeight
        }
      }
    }

    $runSprites = @()
    for ($i = 0; $i -lt $runCells.Count; $i += 1) {
      $cell = $runCells[$i]
      $bounds = Get-LargestForegroundBoundsFromCell -Bitmap $sheet -CellX $cell.X -CellY $cell.Y -CellWidth $cell.Width -CellHeight $cell.Height
      $sprite = Get-SpriteBitmapFromBounds -SourceBitmap $sheet -Bounds $bounds
      $runSprites += $sprite
      $name = "hero-walk-{0}.png" -f ($i + 1).ToString("00")
      Export-FrameBitmap -SpriteBitmap $sprite -OutputPath (Join-Path $outputDir $name) -TargetMaxWidth 138 -TargetMaxHeight 138
    }

    $jumpPlan = @(
      @{ Sprite = 0; ScaleX = 1.08; ScaleY = 0.88; Rotation = 0; YOffset = 6; XOffset = 0; BottomPadding = 16 },
      @{ Sprite = 1; ScaleX = 1.03; ScaleY = 0.95; Rotation = -6; YOffset = -2; XOffset = 0; BottomPadding = 18 },
      @{ Sprite = 2; ScaleX = 1.00; ScaleY = 1.00; Rotation = -8; YOffset = -16; XOffset = -2; BottomPadding = 18 },
      @{ Sprite = 3; ScaleX = 1.00; ScaleY = 1.00; Rotation = -4; YOffset = -28; XOffset = 0; BottomPadding = 18 },
      @{ Sprite = 4; ScaleX = 1.00; ScaleY = 1.00; Rotation = 2; YOffset = -32; XOffset = 1; BottomPadding = 18 },
      @{ Sprite = 5; ScaleX = 1.00; ScaleY = 1.00; Rotation = 8; YOffset = -18; XOffset = 2; BottomPadding = 18 },
      @{ Sprite = 6; ScaleX = 1.00; ScaleY = 1.00; Rotation = 12; YOffset = -6; XOffset = 2; BottomPadding = 18 },
      @{ Sprite = 0; ScaleX = 1.08; ScaleY = 0.90; Rotation = 0; YOffset = 4; XOffset = 0; BottomPadding = 16 },
      @{ Sprite = 7; ScaleX = 1.02; ScaleY = 0.96; Rotation = 0; YOffset = 0; XOffset = 0; BottomPadding = 18 }
    )

    for ($i = 0; $i -lt $jumpPlan.Count; $i += 1) {
      $plan = $jumpPlan[$i]
      $name = "hero-jump-{0}.png" -f ($i + 1).ToString("00")
      Export-FrameBitmap `
        -SpriteBitmap $runSprites[$plan.Sprite] `
        -OutputPath (Join-Path $outputDir $name) `
        -TargetMaxWidth 138 `
        -TargetMaxHeight 141 `
        -BottomPadding $plan.BottomPadding `
        -YOffset $plan.YOffset `
        -XOffset $plan.XOffset `
        -ScaleX $plan.ScaleX `
        -ScaleY $plan.ScaleY `
        -RotationDegrees $plan.Rotation
    }

    foreach ($sprite in $runSprites) {
      $sprite.Dispose()
    }
  }
  finally {
    $sheet.Dispose()
  }
}

Export-Skin03
Write-Output "Skin03 frames exported to $outputDir"
