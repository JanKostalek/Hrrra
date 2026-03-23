$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$runSheetPath = Join-Path $projectRoot "assets/skins/skin02 run.png"
$jumpSheetPath = Join-Path $projectRoot "assets/skins/Skin02 jump.png"
$heroFullSheetPath = Join-Path $projectRoot "assets/skins/Skin02/hero_full.png"
$outputDir = Join-Path $projectRoot "assets/skins/Skin02"
$canvasSize = 160

function Get-BackgroundColor {
  param(
    [System.Drawing.Bitmap]$Bitmap
  )

  return $Bitmap.GetPixel(0, 0)
}

function Is-ForegroundPixel {
  param(
    [System.Drawing.Color]$Color,
    [System.Drawing.Color]$BackgroundColor
  )

  if ($Color.A -lt 10) {
    return $false
  }

  $distance =
    [Math]::Abs([int]$Color.R - [int]$BackgroundColor.R) +
    [Math]::Abs([int]$Color.G - [int]$BackgroundColor.G) +
    [Math]::Abs([int]$Color.B - [int]$BackgroundColor.B)

  return $distance -ge 36
}

function Get-SpriteBoundsFromCell {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [System.Drawing.Color]$BackgroundColor,
    [int]$CellX,
    [int]$CellY,
    [int]$CellWidth,
    [int]$CellHeight
  )

  $minX = $null
  $minY = $null
  $maxX = $null
  $maxY = $null

  for ($y = $CellY; $y -lt ($CellY + $CellHeight); $y += 1) {
    for ($x = $CellX; $x -lt ($CellX + $CellWidth); $x += 1) {
      if (-not (Is-ForegroundPixel -Color $Bitmap.GetPixel($x, $y) -BackgroundColor $BackgroundColor)) {
        continue
      }

      if ($null -eq $minX -or $x -lt $minX) { $minX = $x }
      if ($null -eq $maxX -or $x -gt $maxX) { $maxX = $x }
      if ($null -eq $minY -or $y -lt $minY) { $minY = $y }
      if ($null -eq $maxY -or $y -gt $maxY) { $maxY = $y }
    }
  }

  if ($null -eq $minX) {
    throw "No sprite pixels found inside expected cell area."
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

function Export-SpriteFrame {
  param(
    [System.Drawing.Bitmap]$SourceBitmap,
    [System.Drawing.Color]$BackgroundColor,
    [pscustomobject]$Bounds,
    [string]$OutputPath,
    [int]$YOffset = 0
  )

  $padding = 4
  $srcX = [Math]::Max($Bounds.CellX, $Bounds.X - $padding)
  $srcY = [Math]::Max($Bounds.CellY, $Bounds.Y - $padding)
  $srcRight = [Math]::Min($Bounds.CellX + $Bounds.CellWidth - 1, $Bounds.X + $Bounds.Width - 1 + $padding)
  $srcBottom = [Math]::Min($Bounds.CellY + $Bounds.CellHeight - 1, $Bounds.Y + $Bounds.Height - 1 + $padding)
  $srcW = $srcRight - $srcX + 1
  $srcH = $srcBottom - $srcY + 1

  $destBitmap = [System.Drawing.Bitmap]::new($canvasSize, $canvasSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
  $maskedBitmap = [System.Drawing.Bitmap]::new($srcW, $srcH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $filteredBitmap = [System.Drawing.Bitmap]::new($srcW, $srcH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  try {
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

    for ($localY = 0; $localY -lt $srcH; $localY += 1) {
      for ($localX = 0; $localX -lt $srcW; $localX += 1) {
        $sourceX = $srcX + $localX
        $sourceY = $srcY + $localY
        $color = $SourceBitmap.GetPixel($sourceX, $sourceY)
        if (-not (Is-ForegroundPixel -Color $color -BackgroundColor $BackgroundColor)) {
          continue
        }

        $maskedBitmap.SetPixel($localX, $localY, $color)
      }
    }

    $visited = New-Object 'bool[,]' $srcW, $srcH
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

    for ($scanY = 0; $scanY -lt $srcH; $scanY += 1) {
      for ($scanX = 0; $scanX -lt $srcW; $scanX += 1) {
        if ($visited[$scanX, $scanY]) {
          continue
        }

        $seedColor = $maskedBitmap.GetPixel($scanX, $scanY)
        if ($seedColor.A -lt 10) {
          $visited[$scanX, $scanY] = $true
          continue
        }

        $component = New-Object System.Collections.ArrayList
        $queue = New-Object System.Collections.Queue
        $queue.Enqueue([pscustomobject]@{ X = $scanX; Y = $scanY })
        $visited[$scanX, $scanY] = $true

        while ($queue.Count -gt 0) {
          $point = $queue.Dequeue()
          [void]$component.Add($point)

          foreach ($offset in $neighborOffsets) {
            $nextX = $point.X + $offset.X
            $nextY = $point.Y + $offset.Y
            if ($nextX -lt 0 -or $nextY -lt 0 -or $nextX -ge $srcW -or $nextY -ge $srcH) {
              continue
            }

            if ($visited[$nextX, $nextY]) {
              continue
            }

            $nextColor = $maskedBitmap.GetPixel($nextX, $nextY)
            if ($nextColor.A -lt 10) {
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

    foreach ($point in $largestComponent) {
      $filteredBitmap.SetPixel($point.X, $point.Y, $maskedBitmap.GetPixel($point.X, $point.Y))
    }

    $scale = [Math]::Min(120 / $srcW, 120 / $srcH)
    $drawW = [Math]::Max(1, [int][Math]::Round($srcW * $scale))
    $drawH = [Math]::Max(1, [int][Math]::Round($srcH * $scale))
    $destX = [int][Math]::Round(($canvasSize - $drawW) * 0.5)
    $destY = [int][Math]::Round($canvasSize - $drawH - 18 + $YOffset)

    $srcRect = [System.Drawing.Rectangle]::new(0, 0, $srcW, $srcH)
    $destRect = [System.Drawing.Rectangle]::new($destX, $destY, $drawW, $drawH)
    $graphics.DrawImage($filteredBitmap, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $destBitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $filteredBitmap.Dispose()
    $maskedBitmap.Dispose()
    $graphics.Dispose()
    $destBitmap.Dispose()
  }
}

function Is-LightBackgroundPixel {
  param(
    [System.Drawing.Color]$Color
  )

  return $Color.A -gt 0 -and $Color.R -ge 240 -and $Color.G -ge 240 -and $Color.B -ge 240
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
    throw "No foreground component found inside hero_full cell."
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

function Export-HeroFullFrame {
  param(
    [System.Drawing.Bitmap]$SourceBitmap,
    [pscustomobject]$Bounds,
    [string]$OutputPath,
    [int]$TargetMaxWidth = 86,
    [int]$TargetMaxHeight = 86,
    [int]$BottomPadding = 18,
    [int]$YOffset = 0
  )

  $padding = 4
  $srcX = [Math]::Max($Bounds.CellX, $Bounds.X - $padding)
  $srcY = [Math]::Max($Bounds.CellY, $Bounds.Y - $padding)
  $srcRight = [Math]::Min($Bounds.CellX + $Bounds.CellWidth - 1, $Bounds.X + $Bounds.Width - 1 + $padding)
  $srcBottom = [Math]::Min($Bounds.CellY + $Bounds.CellHeight - 1, $Bounds.Y + $Bounds.Height - 1 + $padding)
  $srcW = $srcRight - $srcX + 1
  $srcH = $srcBottom - $srcY + 1

  $sourceFrame = [System.Drawing.Bitmap]::new($srcW, $srcH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $destBitmap = [System.Drawing.Bitmap]::new($canvasSize, $canvasSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $sourceGraphics = [System.Drawing.Graphics]::FromImage($sourceFrame)
  $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
  try {
    $sourceGraphics.Clear([System.Drawing.Color]::Transparent)
    for ($localY = 0; $localY -lt $srcH; $localY += 1) {
      for ($localX = 0; $localX -lt $srcW; $localX += 1) {
        $pixel = $SourceBitmap.GetPixel($srcX + $localX, $srcY + $localY)
        if (Is-LightBackgroundPixel -Color $pixel) {
          continue
        }

        $sourceFrame.SetPixel($localX, $localY, $pixel)
      }
    }

    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

    $scale = [Math]::Min($TargetMaxWidth / $srcW, $TargetMaxHeight / $srcH)
    $drawW = [Math]::Max(1, [int][Math]::Round($srcW * $scale))
    $drawH = [Math]::Max(1, [int][Math]::Round($srcH * $scale))
    $destX = [int][Math]::Round(($canvasSize - $drawW) * 0.5)
    $destY = [int][Math]::Round($canvasSize - $drawH - $BottomPadding + $YOffset)

    $srcRect = [System.Drawing.Rectangle]::new(0, 0, $srcW, $srcH)
    $destRect = [System.Drawing.Rectangle]::new($destX, $destY, $drawW, $drawH)
    $graphics.DrawImage($sourceFrame, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $destBitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $graphics.Dispose()
    $sourceGraphics.Dispose()
    $destBitmap.Dispose()
    $sourceFrame.Dispose()
  }
}

function Export-Skin02FromHeroFull {
  $sheet = [System.Drawing.Bitmap]::FromFile($heroFullSheetPath)
  try {
    $runCells = @(
      @{ X = 3; Y = 61; Width = 217; Height = 233 },
      @{ X = 226; Y = 61; Width = 219; Height = 233 },
      @{ X = 451; Y = 61; Width = 213; Height = 233 },
      @{ X = 670; Y = 61; Width = 223; Height = 233 },
      @{ X = 3; Y = 299; Width = 217; Height = 249 },
      @{ X = 226; Y = 299; Width = 219; Height = 249 }
    )

    $jumpCells = @(
      @{ X = 3; Y = 611; Width = 174; Height = 289 },
      @{ X = 183; Y = 611; Width = 173; Height = 289 },
      @{ X = 361; Y = 611; Width = 174; Height = 289 },
      @{ X = 540; Y = 611; Width = 173; Height = 289 },
      @{ X = 719; Y = 611; Width = 174; Height = 289 },
      @{ X = 3; Y = 906; Width = 174; Height = 288 },
      @{ X = 183; Y = 906; Width = 173; Height = 288 },
      @{ X = 361; Y = 906; Width = 174; Height = 288 },
      @{ X = 540; Y = 906; Width = 173; Height = 288 }
    )

    for ($i = 0; $i -lt $runCells.Count; $i += 1) {
      $cell = $runCells[$i]
      $bounds = Get-LargestForegroundBoundsFromCell -Bitmap $sheet -CellX $cell.X -CellY $cell.Y -CellWidth $cell.Width -CellHeight $cell.Height
      $name = "hero-walk-{0}.png" -f ($i + 1).ToString("00")
      Export-HeroFullFrame -SourceBitmap $sheet -Bounds $bounds -OutputPath (Join-Path $outputDir $name) -TargetMaxWidth 88 -TargetMaxHeight 86
    }

    for ($i = 0; $i -lt $jumpCells.Count; $i += 1) {
      $cell = $jumpCells[$i]
      $bounds = Get-LargestForegroundBoundsFromCell -Bitmap $sheet -CellX $cell.X -CellY $cell.Y -CellWidth $cell.Width -CellHeight $cell.Height
      $name = "hero-jump-{0}.png" -f ($i + 1).ToString("00")
      Export-HeroFullFrame -SourceBitmap $sheet -Bounds $bounds -OutputPath (Join-Path $outputDir $name) -TargetMaxWidth 88 -TargetMaxHeight 88
    }
  }
  finally {
    $sheet.Dispose()
  }
}

function Export-Skin02 {
  if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
  }

  if (Test-Path $heroFullSheetPath) {
    Export-Skin02FromHeroFull
    return
  }

  $runSheet = [System.Drawing.Bitmap]::FromFile($runSheetPath)
  $jumpSheet = [System.Drawing.Bitmap]::FromFile($jumpSheetPath)

  try {
    $runBackground = Get-BackgroundColor -Bitmap $runSheet
    $jumpBackground = Get-BackgroundColor -Bitmap $jumpSheet

    $runComponents = @()
    $runContentTop = 56
    $runCellWidth = [int][Math]::Floor($runSheet.Width / 3)
    $runCellHeight = [int][Math]::Floor(($runSheet.Height - $runContentTop) / 2)
    for ($row = 0; $row -lt 2; $row += 1) {
      for ($col = 0; $col -lt 3; $col += 1) {
        $cellX = $col * $runCellWidth
        $cellY = $runContentTop + ($row * $runCellHeight)
        $actualCellWidth = if ($col -eq 2) { $runSheet.Width - $cellX } else { $runCellWidth }
        $actualCellHeight = if ($row -eq 1) { $runSheet.Height - $cellY } else { $runCellHeight }
        $runComponents += Get-SpriteBoundsFromCell `
          -Bitmap $runSheet `
          -BackgroundColor $runBackground `
          -CellX $cellX `
          -CellY $cellY `
          -CellWidth $actualCellWidth `
          -CellHeight $actualCellHeight
      }
    }

    $jumpComponents = @()
    $jumpContentTop = 44
    $jumpCellWidth = [int][Math]::Floor($jumpSheet.Width / 4)
    $jumpCellHeight = $jumpSheet.Height - $jumpContentTop
    for ($col = 0; $col -lt 4; $col += 1) {
      $cellX = $col * $jumpCellWidth
      $actualCellWidth = if ($col -eq 3) { $jumpSheet.Width - $cellX } else { $jumpCellWidth }
      $jumpComponents += Get-SpriteBoundsFromCell `
        -Bitmap $jumpSheet `
        -BackgroundColor $jumpBackground `
        -CellX $cellX `
        -CellY $jumpContentTop `
        -CellWidth $actualCellWidth `
        -CellHeight $jumpCellHeight
    }

    for ($i = 0; $i -lt $runComponents.Count; $i += 1) {
      $name = "hero-walk-{0}.png" -f ($i + 1).ToString("00")
      Export-SpriteFrame `
        -SourceBitmap $runSheet `
        -BackgroundColor $runBackground `
        -Bounds $runComponents[$i] `
        -OutputPath (Join-Path $outputDir $name)
    }

    $jumpFramePlan = @(
      @{ Index = 0; Offset = 2 },
      @{ Index = 0; Offset = 0 },
      @{ Index = 1; Offset = 0 },
      @{ Index = 1; Offset = -4 },
      @{ Index = 2; Offset = -2 },
      @{ Index = 2; Offset = -6 },
      @{ Index = 2; Offset = 0 },
      @{ Index = 3; Offset = 0 },
      @{ Index = 3; Offset = 2 }
    )

    for ($i = 0; $i -lt $jumpFramePlan.Count; $i += 1) {
      $frame = $jumpFramePlan[$i]
      $name = "hero-jump-{0}.png" -f ($i + 1).ToString("00")
      Export-SpriteFrame `
        -SourceBitmap $jumpSheet `
        -BackgroundColor $jumpBackground `
        -Bounds $jumpComponents[$frame.Index] `
        -OutputPath (Join-Path $outputDir $name) `
        -YOffset $frame.Offset
    }
  }
  finally {
    $runSheet.Dispose()
    $jumpSheet.Dispose()
  }
}

Export-Skin02
Write-Output "Skin02 frames exported to $outputDir"
