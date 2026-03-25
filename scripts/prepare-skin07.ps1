$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$pythonScript = Join-Path $projectRoot "scripts\prepare_skin07.py"

py $pythonScript
if ($LASTEXITCODE -ne 0) {
  throw "prepare_skin07.py failed with exit code $LASTEXITCODE"
}
