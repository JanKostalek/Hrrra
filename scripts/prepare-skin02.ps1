$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$pythonScript = Join-Path $projectRoot "scripts\prepare_skin02.py"

py $pythonScript
if ($LASTEXITCODE -ne 0) {
  throw "prepare_skin02.py failed with exit code $LASTEXITCODE"
}
