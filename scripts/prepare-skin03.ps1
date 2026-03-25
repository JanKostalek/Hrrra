$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$skinDir = Join-Path $projectRoot "assets/skins/Skin03"

$walkSourceNames = @(
  "run-01.png",
  "run-02.png",
  "run-03.png",
  "run-04.png",
  "run-05.png",
  "run-06.png",
  "run-07.png",
  "run-08.png"
)
$jumpSourceNames = @(
  "jump-02.png",
  "jump-03.png",
  "jump-05.png",
  "jump-06.png",
  "jump-07.png",
  "jump-19.png",
  "jump-20.png"
)

function Export-To160Canvas {
  param(
    [string]$SourcePath,
    [string]$OutputPath
  )

  $source = [System.Drawing.Bitmap]::FromFile($SourcePath)
  try {
    $dest = New-Object System.Drawing.Bitmap 160, 160, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $g = [System.Drawing.Graphics]::FromImage($dest)
      try {
        $g.Clear([System.Drawing.Color]::Transparent)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
        $g.DrawImage(
          $source,
          [System.Drawing.Rectangle]::FromLTRB(0, 0, 160, 160),
          [System.Drawing.Rectangle]::FromLTRB(0, 0, $source.Width, $source.Height),
          [System.Drawing.GraphicsUnit]::Pixel
        )
      } finally {
        $g.Dispose()
      }
      $dest.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $dest.Dispose()
    }
  } finally {
    $source.Dispose()
  }
}

function Get-OpaqueBounds {
  param(
    [System.Drawing.Bitmap]$Bitmap
  )

  $minX = $Bitmap.Width
  $minY = $Bitmap.Height
  $maxX = -1
  $maxY = -1
  for ($y = 0; $y -lt $Bitmap.Height; $y += 1) {
    for ($x = 0; $x -lt $Bitmap.Width; $x += 1) {
      if ($Bitmap.GetPixel($x, $y).A -gt 0) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  if ($maxX -lt $minX -or $maxY -lt $minY) {
    return @{ X = 0; Y = 0; Width = $Bitmap.Width; Height = $Bitmap.Height }
  }
  return @{
    X = $minX
    Y = $minY
    Width = $maxX - $minX + 1
    Height = $maxY - $minY + 1
  }
}

function Export-WalkTo160Canvas {
  param(
    [string]$SourcePath,
    [string]$OutputPath
  )

  $source = [System.Drawing.Bitmap]::FromFile($SourcePath)
  try {
    $bounds = Get-OpaqueBounds -Bitmap $source
    $crop = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $cropGraphics = [System.Drawing.Graphics]::FromImage($crop)
      try {
        $cropGraphics.Clear([System.Drawing.Color]::Transparent)
        $cropGraphics.DrawImage(
          $source,
          [System.Drawing.Rectangle]::FromLTRB(0, 0, $bounds.Width, $bounds.Height),
          [System.Drawing.Rectangle]::FromLTRB($bounds.X, $bounds.Y, $bounds.X + $bounds.Width, $bounds.Y + $bounds.Height),
          [System.Drawing.GraphicsUnit]::Pixel
        )
      } finally {
        $cropGraphics.Dispose()
      }

      $targetHeight = 158
      $targetWidth = [Math]::Max(1, [int][Math]::Round($bounds.Width * ($targetHeight / [double]$bounds.Height)))
      $targetBottom = 159
      $destX = [int][Math]::Round((160 - $targetWidth) / 2.0)
      $destY = $targetBottom - $targetHeight + 1

      $dest = New-Object System.Drawing.Bitmap 160, 160, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      try {
        $g = [System.Drawing.Graphics]::FromImage($dest)
        try {
          $g.Clear([System.Drawing.Color]::Transparent)
          $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
          $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
          $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
          $g.DrawImage(
            $crop,
            [System.Drawing.Rectangle]::FromLTRB($destX, $destY, $destX + $targetWidth, $destY + $targetHeight),
            [System.Drawing.Rectangle]::FromLTRB(0, 0, $bounds.Width, $bounds.Height),
            [System.Drawing.GraphicsUnit]::Pixel
          )
        } finally {
          $g.Dispose()
        }
        $dest.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
      } finally {
        $dest.Dispose()
      }
    } finally {
      $crop.Dispose()
    }
  } finally {
    $source.Dispose()
  }
}

function Export-JumpTo160Canvas {
  param(
    [string]$SourcePath,
    [string]$OutputPath,
    [int]$TargetHeight,
    [int]$TargetBottom
  )

  $source = [System.Drawing.Bitmap]::FromFile($SourcePath)
  try {
    $bounds = Get-OpaqueBounds -Bitmap $source
    $crop = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $cropGraphics = [System.Drawing.Graphics]::FromImage($crop)
      try {
        $cropGraphics.Clear([System.Drawing.Color]::Transparent)
        $cropGraphics.DrawImage(
          $source,
          [System.Drawing.Rectangle]::FromLTRB(0, 0, $bounds.Width, $bounds.Height),
          [System.Drawing.Rectangle]::FromLTRB($bounds.X, $bounds.Y, $bounds.X + $bounds.Width, $bounds.Y + $bounds.Height),
          [System.Drawing.GraphicsUnit]::Pixel
        )
      } finally {
        $cropGraphics.Dispose()
      }

      $targetWidth = [Math]::Max(1, [int][Math]::Round($bounds.Width * ($TargetHeight / [double]$bounds.Height)))
      $destX = [int][Math]::Round((160 - $targetWidth) / 2.0)
      $destY = $TargetBottom - $TargetHeight + 1

      $dest = New-Object System.Drawing.Bitmap 160, 160, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      try {
        $g = [System.Drawing.Graphics]::FromImage($dest)
        try {
          $g.Clear([System.Drawing.Color]::Transparent)
          $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
          $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
          $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
          $g.DrawImage(
            $crop,
            [System.Drawing.Rectangle]::FromLTRB($destX, $destY, $destX + $targetWidth, $destY + $TargetHeight),
            [System.Drawing.Rectangle]::FromLTRB(0, 0, $bounds.Width, $bounds.Height),
            [System.Drawing.GraphicsUnit]::Pixel
          )
        } finally {
          $g.Dispose()
        }
        $dest.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
      } finally {
        $dest.Dispose()
      }
    } finally {
      $crop.Dispose()
    }
  } finally {
    $source.Dispose()
  }
}

function Maximize-HeroFrameInPlace {
  param(
    [string]$Path
  )

  $src = [System.Drawing.Bitmap]::FromFile($Path)
  try {
    $bounds = Get-OpaqueBounds -Bitmap $src
    $crop = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $cg = [System.Drawing.Graphics]::FromImage($crop)
      try {
        $cg.Clear([System.Drawing.Color]::Transparent)
        $cg.DrawImage(
          $src,
          [System.Drawing.Rectangle]::FromLTRB(0, 0, $bounds.Width, $bounds.Height),
          [System.Drawing.Rectangle]::FromLTRB($bounds.X, $bounds.Y, $bounds.X + $bounds.Width, $bounds.Y + $bounds.Height),
          [System.Drawing.GraphicsUnit]::Pixel
        )
      } finally {
        $cg.Dispose()
      }

      $targetHeight = 158
      $targetWidth = [Math]::Max(1, [int][Math]::Round($bounds.Width * ($targetHeight / [double]$bounds.Height)))
      $destX = [int][Math]::Round((160 - $targetWidth) / 2.0)
      $destY = 159 - $targetHeight + 1

      $dest = New-Object System.Drawing.Bitmap 160, 160, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      try {
        $g = [System.Drawing.Graphics]::FromImage($dest)
        try {
          $g.Clear([System.Drawing.Color]::Transparent)
          $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
          $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
          $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
          $g.DrawImage(
            $crop,
            [System.Drawing.Rectangle]::FromLTRB($destX, $destY, $destX + $targetWidth, $destY + $targetHeight),
            [System.Drawing.Rectangle]::FromLTRB(0, 0, $bounds.Width, $bounds.Height),
            [System.Drawing.GraphicsUnit]::Pixel
          )
        } finally {
          $g.Dispose()
        }
        $tmpPath = $Path + ".tmp"
        $dest.Save($tmpPath, [System.Drawing.Imaging.ImageFormat]::Png)
      } finally {
        $dest.Dispose()
      }
    } finally {
      $crop.Dispose()
    }
  } finally {
    $src.Dispose()
  }

  Move-Item -Force ($Path + ".tmp") $Path
}

for ($i = 0; $i -lt $walkSourceNames.Count; $i += 1) {
  $sourcePath = Join-Path $skinDir $walkSourceNames[$i]
  $outputPath = Join-Path $skinDir ("hero-walk-{0}.png" -f ($i + 1).ToString("00"))
  $tempOutputPath = $outputPath + ".tmp"
  Export-WalkTo160Canvas -SourcePath $sourcePath -OutputPath $tempOutputPath
  Move-Item -Force $tempOutputPath $outputPath
}

 $jumpHeights = @(158, 158, 158, 158, 158, 158, 158)
 $jumpBottoms = @(159, 159, 159, 159, 159, 159, 159)
for ($i = 0; $i -lt $jumpSourceNames.Count; $i += 1) {
  $sourcePath = Join-Path $skinDir $jumpSourceNames[$i]
  $outputPath = Join-Path $skinDir ("hero-jump-{0}.png" -f ($i + 1).ToString("00"))
  $tempOutputPath = $outputPath + ".tmp"
  Export-JumpTo160Canvas -SourcePath $sourcePath -OutputPath $tempOutputPath -TargetHeight $jumpHeights[$i] -TargetBottom $jumpBottoms[$i]
  Move-Item -Force $tempOutputPath $outputPath
}

Get-ChildItem $skinDir -Filter 'hero-*.png' | ForEach-Object {
  Maximize-HeroFrameInPlace -Path $_.FullName
}

Write-Output "Skin03 hero frames prepared as 160x160 exports from selected root run/jump PNG files in $skinDir"
