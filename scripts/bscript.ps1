$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Push-Location $projectRoot

try {
  $currentBranch = (git branch --show-current).Trim()
  if (-not $currentBranch) {
    throw "Unable to determine the current git branch."
  }

  $statusOutput = git status --short
  if ($statusOutput) {
    throw "Working tree is not clean. Commit or stash changes before running bscript."
  }

  git fetch origin
  git push --force-with-lease origin HEAD:main

  Write-Output "bscript pushed branch '$currentBranch' to origin/main."
} finally {
  Pop-Location
}
