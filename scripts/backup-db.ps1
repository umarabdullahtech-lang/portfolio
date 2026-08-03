param(
  [string]$Output = "backups/portfolio-$(Get-Date -Format 'yyyyMMdd-HHmmss').dump",
  [string]$Container = "codex-portfolio-preview"
)

$ErrorActionPreference = "Stop"

$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) {
  $envFile = Join-Path $PSScriptRoot "..\.env.local"
  if (-not (Test-Path -LiteralPath $envFile)) {
    throw "DATABASE_URL is not set and .env.local was not found."
  }

  $databaseLine = Get-Content -LiteralPath $envFile | Where-Object { $_ -like "DATABASE_URL=*" } | Select-Object -First 1
  if (-not $databaseLine) { throw "DATABASE_URL is missing from .env.local" }
  $databaseUrl = $databaseLine.Substring("DATABASE_URL=".Length).Trim().Trim('"')
}
$absoluteOutput = [System.IO.Path]::GetFullPath((Join-Path (Join-Path $PSScriptRoot "..") $Output))
$outputDirectory = Split-Path -Parent $absoluteOutput
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
if ($pgDump) {
  & $pgDump.Source --format=custom --no-owner --no-privileges --file=$absoluteOutput $databaseUrl
  if ($LASTEXITCODE -ne 0) { throw "pg_dump failed with exit code $LASTEXITCODE" }
} else {
  $docker = Get-Command docker -ErrorAction SilentlyContinue
  if (-not $docker) {
    throw "Neither pg_dump nor Docker is available. Install PostgreSQL client tools or run this command on the database host."
  }

  $containerRunning = & $docker.Source inspect --format '{{.State.Running}}' $Container 2>$null
  if ($LASTEXITCODE -ne 0 -or $containerRunning -ne 'true') {
    throw "pg_dump is not installed and Docker container '$Container' is not running."
  }

  $databaseUri = [System.Uri]$databaseUrl
  $databaseName = [System.Uri]::UnescapeDataString($databaseUri.AbsolutePath.TrimStart('/'))
  $databaseUser = [System.Uri]::UnescapeDataString(($databaseUri.UserInfo -split ':', 2)[0])
  $containerOutput = "/tmp/portfolio-$(Get-Date -Format 'yyyyMMdd-HHmmss').dump"

  try {
    & $docker.Source exec $Container pg_dump --username=$databaseUser --dbname=$databaseName --format=custom --no-owner --no-privileges --file=$containerOutput
    if ($LASTEXITCODE -ne 0) { throw "Container pg_dump failed with exit code $LASTEXITCODE" }

    & $docker.Source exec $Container pg_restore --list $containerOutput | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "The generated dump could not be verified by pg_restore" }

    & $docker.Source cp "${Container}:$containerOutput" $absoluteOutput
    if ($LASTEXITCODE -ne 0) { throw "docker cp failed with exit code $LASTEXITCODE" }
  } finally {
    & $docker.Source exec $Container rm -f $containerOutput 2>$null | Out-Null
  }
}

Write-Output "Database backup created: $absoluteOutput"
