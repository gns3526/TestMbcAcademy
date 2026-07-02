param(
    [string]$Name,
    [string]$Room,
    [string]$Clue,
    [ValidateSet("found","suspect","fake","question")]
    [string]$Kind = "found"
)

$ErrorActionPreference = "Stop"

function Convert-ToSafeName {
    param([string]$Text)
    $safe = $Text.Trim() -replace '[\\/:*?"<>| ]+', '_'
    if (-not $safe) { return "student" }
    return $safe
}

if (-not $Name) { $Name = Read-Host "Name or team" }
if (-not $Room) { $Room = Read-Host "Room" }
if (-not $Clue) { $Clue = Read-Host "Clue" }

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$board = Join-Path $root "shared_clues"
$safeName = Convert-ToSafeName -Text $Name
$safeRoom = Convert-ToSafeName -Text $Room
$teamDir = Join-Path $board $safeName

New-Item -ItemType Directory -Force -Path $teamDir | Out-Null

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$fileName = "$stamp-$safeRoom-$Kind.md"
$filePath = Join-Path $teamDir $fileName
$relativePath = "escape-room/shared_clues/$safeName/$fileName"

$content = @"
# 단서 기록

작성자: $Name
방: $Room
상태: $Kind
시간: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 내가 본 것

$Clue

## 왜 중요하다고 생각했는지


## 다음 사람이 확인할 것


## 원본 위치


"@

$content | Set-Content -Path $filePath -Encoding UTF8

Write-Host ""
Write-Host "Created: $relativePath"
Write-Host ""
Write-Host "Next:"
Write-Host "git pull"
Write-Host "git add $relativePath"
Write-Host "git commit -m `"share clue from $safeName`""
Write-Host "git push"
Write-Host ""
Write-Host "After push, say only: push"
