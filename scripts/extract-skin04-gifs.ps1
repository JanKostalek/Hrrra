$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$skinDir = Join-Path $projectRoot "assets/skins/Skin04"

function Export-GifFrames {
  param(
    [string]$GifPath,
    [string]$OutputDir,
    [string]$Prefix
  )

  if (-not (Test-Path $GifPath)) {
    throw "Missing GIF: $GifPath"
  }

  if (Test-Path $OutputDir) {
    Get-ChildItem $OutputDir -File -Filter '*.png' | Remove-Item -Force
  } else {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
  }

  $image = [System.Drawing.Image]::FromFile($GifPath)
  try {
    $dimension = New-Object System.Drawing.Imaging.FrameDimension($image.FrameDimensionsList[0])
    $frameCount = $image.GetFrameCount($dimension)

    for ($index = 0; $index -lt $frameCount; $index += 1) {
      $image.SelectActiveFrame($dimension, $index)
      $frameBitmap = New-Object System.Drawing.Bitmap($image.Width, $image.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      $graphics = [System.Drawing.Graphics]::FromImage($frameBitmap)
      try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)
        $outputPath = Join-Path $OutputDir ("{0}-{1}.png" -f $Prefix, ($index + 1).ToString("00"))
        $frameBitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
      }
      finally {
        $graphics.Dispose()
        $frameBitmap.Dispose()
      }
    }
  }
  finally {
    $image.Dispose()
  }
}

Export-GifFrames -GifPath (Join-Path $skinDir "skin04_run.gif") -OutputDir (Join-Path $skinDir "run_frames") -Prefix "run"
Export-GifFrames -GifPath (Join-Path $skinDir "skin04_jump.gif") -OutputDir (Join-Path $skinDir "jump_frames") -Prefix "jump"

Write-Output "Skin04 GIF frames exported."
