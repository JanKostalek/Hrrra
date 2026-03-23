$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$skinDir = Join-Path $projectRoot "assets/skins/Skin04"

function Test-SimilarColor {
  param(
    [System.Drawing.Color]$ColorA,
    [System.Drawing.Color]$ColorB,
    [int]$Tolerance
  )

  $distance =
    [Math]::Abs([int]$ColorA.R - [int]$ColorB.R) +
    [Math]::Abs([int]$ColorA.G - [int]$ColorB.G) +
    [Math]::Abs([int]$ColorA.B - [int]$ColorB.B)

  return $distance -le $Tolerance
}

function Open-BitmapUnlocked {
  param([string]$Path)

  $stream = [System.IO.File]::Open($Path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
  try {
    $image = [System.Drawing.Image]::FromStream($stream)
    try {
      return New-Object System.Drawing.Bitmap($image)
    } finally {
      $image.Dispose()
    }
  } finally {
    $stream.Dispose()
  }
}

function Clean-SelectedFrame {
  param([string]$Path)

  $source = Open-BitmapUnlocked -Path $Path
  try {
    $width = $source.Width
    $height = $source.Height
    $bgTop = $source.GetPixel(10, [Math]::Min($height - 1, 2))
    $bgBottom = $source.GetPixel(10, [Math]::Max(0, $height - 2))
    $bgMid = $source.GetPixel([int][Math]::Round($width * 0.12), [int][Math]::Round($height * 0.48))

    $output = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      for ($y = 0; $y -lt $height; $y += 1) {
        for ($x = 0; $x -lt $width; $x += 1) {
          $pixel = $source.GetPixel($x, $y)
          if ($pixel.A -lt 10) {
            continue
          }
          if ((Test-SimilarColor -ColorA $pixel -ColorB $bgTop -Tolerance 20) -or
              (Test-SimilarColor -ColorA $pixel -ColorB $bgBottom -Tolerance 20) -or
              (Test-SimilarColor -ColorA $pixel -ColorB $bgMid -Tolerance 60)) {
            continue
          }
          if ($y -ge ($height - 8) -and $pixel.G -ge 90 -and $pixel.G -ge ($pixel.R + 25) -and $pixel.G -ge ($pixel.B + 25)) {
            continue
          }

          $output.SetPixel($x, $y, $pixel)
        }
      }

      $tempPath = "$Path.tmp.png"
      if (Test-Path $tempPath) {
        Remove-Item $tempPath -Force
      }
      $output.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
      Move-Item $tempPath $Path -Force
    } finally {
      $output.Dispose()
    }
  } finally {
    $source.Dispose()
  }
}

Get-ChildItem $skinDir -File | Where-Object { $_.Name -match '^(run|jump)-.*\.png$' } | ForEach-Object {
  Clean-SelectedFrame -Path $_.FullName
}

Write-Output "Skin04 selected frames cleaned."
